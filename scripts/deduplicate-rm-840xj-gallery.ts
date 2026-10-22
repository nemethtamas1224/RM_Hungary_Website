import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const root = process.cwd()
const productId = 34
const keptMediaId = 485
const duplicateMediaId = 486
const relationId = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof (value as any).id === 'number') return (value as any).id
  return undefined
}
const digest = async (file: string) => createHash('sha256').update(await readFile(file)).digest('hex')

const payload = await getPayload({ config })
try {
  const product: any = await payload.findByID({ collection: 'products', id: productId, depth: 0, overrideAccess: true })
  const duplicateRows: any = await payload.find({
    collection: 'media', limit: 1, depth: 0, overrideAccess: true,
    where: { id: { equals: duplicateMediaId } },
  })
  const gallery: number[] = Array.isArray(product.gallery)
    ? product.gallery
        .map((value: unknown) => relationId(value))
        .filter((id: number | undefined): id is number => typeof id === 'number')
    : []

  if (!duplicateRows.docs.length) {
    if (!gallery.includes(keptMediaId) || gallery.includes(duplicateMediaId)) {
      throw new Error('A duplikátum hiányzik, de a galéria nem egyezik az összevont állapottal; megszakítva.')
    }
    console.log('Az RM 840 XJ galéria duplikátuma már el van távolítva; nincs módosítás.')
  } else {
    if (!gallery.includes(keptMediaId) || !gallery.includes(duplicateMediaId)) {
      throw new Error('A termék galériájának képei eltérnek a várt állapottól; megszakítva.')
    }
    const duplicate: any = duplicateRows.docs[0]
    const kept: any = await payload.findByID({ collection: 'media', id: keptMediaId, depth: 0, overrideAccess: true })
    if (duplicate.filename !== 'xj-840-main-2.jpg' || kept.filename !== 'xj-840-main.jpg') {
      throw new Error('A médiarekordok neve váratlan; megszakítva.')
    }
    const [duplicateHash, keptHash] = await Promise.all([
      digest(path.join(root, 'public/uploads/xj-840-main-2.jpg')),
      digest(path.join(root, 'public/uploads/xj-840-main.jpg')),
    ])
    if (duplicateHash !== keptHash) throw new Error('A két XJ 840 fotó már nem bitre azonos; megszakítva.')

    const dbPath = path.join(root, 'data/rm-hungary.db')
    const references = execFileSync('sqlite3', [dbPath, `SELECT parent_id || ':' || path FROM products_rels WHERE media_id=${duplicateMediaId};`], { encoding: 'utf8' }).trim()
    if (references !== `${productId}:gallery`) throw new Error(`A duplikált képnek váratlan CMS-hivatkozásai vannak (${references}); megszakítva.`)

    if (!apply) {
      console.log(`Előnézet: a 840 XJ galériából eltávolítom a bitre azonos ${duplicateMediaId} elemet, megtartom a ${keptMediaId} képet, majd törlöm a duplikált médiafájlt. Nincs módosítás.`)
    } else {
      await payload.update({
        collection: 'products', id: productId, depth: 0, overrideAccess: true,
        data: { gallery: gallery.filter((id) => id !== duplicateMediaId) } as any,
      })
      await payload.delete({ collection: 'media', id: duplicateMediaId, overrideAccess: true })
      console.log(`Az RM 840 XJ galériából a duplikált kép eltávolítva; a ${keptMediaId} kép és a további galériaelemek megmaradtak.`)
    }
  }
} finally {
  await payload.destroy()
}
