import { createHash } from 'node:crypto'
import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { getPayload } from 'payload'
import config from '../payload.config'

type Candidate = { id: number; filename: string; sha256: string; bytes: number; preservedCopy: string }
type Manifest = { candidateCount: number; bytes: number; items: Candidate[] }

const root = process.cwd()
const apply = process.argv.includes('--apply')
const backupArg = process.argv.find((arg) => arg.startsWith('--backup='))
const backupPath = backupArg?.slice('--backup='.length)
const dbPath = path.join(root, 'data/rm-hungary.db')
const manifestPath = path.join(root, 'audit/media-copy-prune-manifest-2026-10-22.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Manifest
const hashFile = async (file: string) => createHash('sha256').update(await readFile(file)).digest('hex')

// Includes direct media fields and relationship tables, including version history.
const mediaRelations: [string, string][] = [
  ['categories', 'image_id'], ['product_families', 'image_id'], ['product_families', 'card_logo_id'],
  ['product_families_overview_sections', 'image_id'], ['product_families_overview_sections', 'secondary_image_id'],
  ['manufacturers', 'logo_id'], ['products', 'image_id'], ['products', 'card_image_id'], ['products', 'card_logo_id'],
  ['_products_v', 'version_image_id'], ['_products_v', 'version_card_image_id'], ['_products_v', 'version_card_logo_id'],
  ['news', 'cover_image_id'], ['_news_v', 'version_cover_image_id'],
  ['site_settings', 'hero_image_id'], ['site_settings', 'logo_id'], ['site_settings', 'service_image_id'],
  ['products_rels', 'media_id'], ['_products_v_rels', 'media_id'],
  ['products_technical_sections', 'image_id'], ['_products_v_version_technical_sections', 'image_id'],
  ['pages_rels', 'media_id'], ['_pages_v_rels', 'media_id'], ['references_rels', 'media_id'],
  ['used_machines_rels', 'media_id'], ['products_source_evidence', 'media_id'],
  ['_products_v_version_source_evidence', 'media_id'], ['payload_locked_documents_rels', 'media_id'],
]
const sqlString = (value: string) => `'${value.replaceAll("'", "''")}'`
const referencesSql = (id: number) => mediaRelations
  .map(([table, column]) => `SELECT ${sqlString(`${table}.${column}`)} || ':' || COUNT(*) FROM "${table}" WHERE "${column}"=${id} HAVING COUNT(*)>0`)
  .join(' UNION ALL ')

if (manifest.items.length !== manifest.candidateCount) throw new Error('A média-manifeszt elemszáma hibás.')
if (new Set(manifest.items.map((item) => item.id)).size !== manifest.items.length) throw new Error('A média-manifeszt ismétlődő rekordazonosítót tartalmaz.')

if (apply) {
  if (!backupPath) throw new Error('Alkalmazáskor add meg a friss mentést: --backup=/abszolút/útvonal.zip')
  await access(backupPath)
  const entries = new Set(execFileSync('unzip', ['-Z1', backupPath], { encoding: 'utf8' }).split(/\r?\n/))
  if (!entries.has('database.sqlite')) throw new Error('A mentésből hiányzik a database.sqlite.')
  const missing = manifest.items.filter((item) => !entries.has(`public/uploads/${item.filename}`))
  if (missing.length) throw new Error(`A mentés nem tartalmazza az összes jelölt fájlt: ${missing.map((item) => item.filename).join(', ')}`)
}

const payload = await getPayload({ config })
try {
  let removedCount = 0
  let removedBytes = 0
  for (const item of manifest.items) {
    const uploadPath = path.join(root, 'public/uploads', item.filename)
    const preservedPath = path.join(root, item.preservedCopy)
    const [record, uploadHash, preservedHash] = await Promise.all([
      payload.findByID({ collection: 'media', id: item.id, depth: 0, overrideAccess: true }).catch(() => null) as Promise<any>,
      hashFile(uploadPath).catch(() => null),
      hashFile(preservedPath).catch(() => null),
    ])

    if (!record) {
      try { await access(uploadPath); throw new Error(`A ${item.filename} rekord hiányzik, de a feltöltés még megvan.`) }
      catch (error) { if (error instanceof Error && error.message.includes('még megvan')) throw error }
      console.log(`Már eltávolítva: ${item.filename}`)
      continue
    }
    if (record.filename !== item.filename) throw new Error(`A ${item.id} média neve megváltozott: ${record.filename}`)
    if (uploadHash !== item.sha256 || preservedHash !== item.sha256) throw new Error(`A(z) ${item.filename} hash-e vagy megőrzött másolata megváltozott.`)

    const refs = execFileSync('sqlite3', [dbPath, referencesSql(item.id)], { encoding: 'utf8' }).trim()
    if (refs) throw new Error(`A(z) ${item.filename} média még hivatkozott: ${refs.replaceAll('\n', '; ')}`)

    if (!apply) {
      console.log(`Előnézet: ${item.id} ${item.filename} (${item.bytes} bájt); megmarad: ${item.preservedCopy}`)
      continue
    }

    await payload.delete({ collection: 'media', id: item.id, overrideAccess: true })
    try { await access(uploadPath); throw new Error(`A Payload nem törölte a feltöltött fájlt: ${item.filename}`) }
    catch (error) { if (error instanceof Error && error.message.includes('nem törölte')) throw error }
    if (await hashFile(preservedPath) !== item.sha256) throw new Error(`A megőrzött másolat ellenőrzése hibás: ${item.preservedCopy}`)
    removedCount += 1
    removedBytes += item.bytes
    console.log(`Eltávolítva: ${item.filename}`)
  }
  console.log(apply ? `Végösszeg: ${removedCount} médiarekord, ${removedBytes} bájt felszabadítva.` : `Előnézeti végösszeg: ${manifest.candidateCount} médiarekord, ${manifest.bytes} bájt.`)
} finally {
  await payload.destroy()
}
