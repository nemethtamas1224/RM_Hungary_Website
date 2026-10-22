import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = process.cwd()
const apply = process.argv.includes('--apply')
const dbPath = path.join(root, 'data/rm-hungary.db')
const pairs = [
  { duplicate: 339, duplicateFile: 'albatros-72_1_1.png', canonical: 198, canonicalFile: 'aa8297cff32f-albatros-72_1_1.png' },
  { duplicate: 363, duplicateFile: 'boom_1_1.png', canonical: 206, canonicalFile: '789d5b3be929-boom_1_1.png' },
  { duplicate: 373, duplicateFile: 'condor_1_1.png', canonical: 207, canonicalFile: 'e5c5de99e71c-condor_1_1.png' },
  { duplicate: 378, duplicateFile: 'falcon_1_1.png', canonical: 208, canonicalFile: 'c10c03d27621-falcon_1_1.png' },
  { duplicate: 387, duplicateFile: 'liqu_1_1.png', canonical: 209, canonicalFile: '90f0758e898d-liqu_1_1.png' },
  { duplicate: 353, duplicateFile: 'albatros_1_1.png', canonical: 199, canonicalFile: '1c9b941faedf-albatros_1_1.png' },
  { duplicate: 710, duplicateFile: 'SistemaCWM.jpg', canonical: 712, canonicalFile: 'SistemaCWM-1.jpg' },
  { duplicate: 711, duplicateFile: 'Pompe.png', canonical: 713, canonicalFile: 'Pompe-1.png' },
  { duplicate: 694, duplicateFile: 'liquo-13.jpg', canonical: 687, canonicalFile: 'liquo-05.jpg' },
  { duplicate: 697, duplicateFile: 'liquo-16.jpg', canonical: 684, canonicalFile: 'liquo-02.jpg' },
  { duplicate: 698, duplicateFile: 'liquo-17.jpg', canonical: 686, canonicalFile: 'liquo-04.jpg' },
  { duplicate: 701, duplicateFile: 'liquo-20.jpg', canonical: 688, canonicalFile: 'liquo-06.jpg' },
] as const

const sqlString = (value: string) => `'${value.replaceAll("'", "''")}'`
const sha = async (file: string) => createHash('sha256').update(await readFile(file)).digest('hex')
const referencesSql = (id: number) => {
  const refs: [string, string][] = [
    ['categories', 'image_id'], ['product_families', 'image_id'], ['product_families', 'card_logo_id'],
    ['manufacturers', 'logo_id'], ['products', 'image_id'], ['products', 'card_image_id'], ['products', 'card_logo_id'],
    ['_products_v', 'version_image_id'], ['_products_v', 'version_card_image_id'], ['_products_v', 'version_card_logo_id'],
    ['news', 'cover_image_id'], ['_news_v', 'version_cover_image_id'],
    ['site_settings', 'hero_image_id'], ['site_settings', 'logo_id'], ['site_settings', 'service_image_id'],
    ['products_rels', 'media_id'], ['_products_v_rels', 'media_id'], ['products_technical_sections', 'image_id'], ['_products_v_version_technical_sections', 'image_id'],
    ['product_families_overview_sections', 'image_id'], ['product_families_overview_sections', 'secondary_image_id'],
    ['pages_rels', 'media_id'], ['_pages_v_rels', 'media_id'],
    ['references_rels', 'media_id'], ['used_machines_rels', 'media_id'], ['products_source_evidence', 'media_id'],
    ['_products_v_version_source_evidence', 'media_id'], ['payload_locked_documents_rels', 'media_id'],
  ]
  return refs.map(([table, column]) => `SELECT ${sqlString(`${table}.${column}`)} || ':' || COUNT(*) FROM "${table}" WHERE "${column}"=${id} HAVING COUNT(*)>0`).join(' UNION ALL ')
}

const payload = await getPayload({ config })
try {
  for (const pair of pairs) {
    const [duplicate, canonical] = await Promise.all([
      payload.findByID({ collection: 'media', id: pair.duplicate, depth: 0, overrideAccess: true }).catch(() => null) as Promise<any>,
      payload.findByID({ collection: 'media', id: pair.canonical, depth: 0, overrideAccess: true }).catch(() => null) as Promise<any>,
    ])
    if (!canonical || canonical.filename !== pair.canonicalFile) throw new Error(`A kanonikus média váratlan: ${pair.canonical}.`)
    const duplicatePath = path.join(root, 'public/uploads', pair.duplicateFile)
    const canonicalPath = path.join(root, 'public/uploads', pair.canonicalFile)

    if (!duplicate) {
      execFileSync('test', ['!','-e', duplicatePath])
      console.log(`Már összevonva: ${pair.duplicateFile}`)
      continue
    }
    if (duplicate.filename !== pair.duplicateFile) throw new Error(`A duplikált média neve váratlan: ${duplicate.filename}.`)
    const [duplicateHash, canonicalHash] = await Promise.all([sha(duplicatePath), sha(canonicalPath)])
    if (duplicateHash !== canonicalHash) throw new Error(`A két fájl tartalma eltér: ${pair.duplicateFile}.`)

    const refs = execFileSync('sqlite3', [dbPath, referencesSql(pair.duplicate)], { encoding: 'utf8' }).trim()
    if (refs) throw new Error(`A ${pair.duplicateFile} média még hivatkozott: ${refs.replaceAll('\n', '; ')}.`)

    if (!apply) {
      console.log(`Előnézet: törölhető az igazoltan hivatkozatlan media ${pair.duplicate} (${pair.duplicateFile}); a bitre azonos kanonikus media ${pair.canonical} és minden forrásarchívum megmarad.`)
    } else {
      await payload.delete({ collection: 'media', id: pair.duplicate, overrideAccess: true })
      execFileSync('test', ['!','-e', duplicatePath])
      console.log(`Eltávolítva a hivatkozatlan média: ${pair.duplicateFile}`)
    }
  }
} finally {
  await payload.destroy()
}
