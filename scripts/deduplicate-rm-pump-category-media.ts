import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const root = process.cwd()
const duplicateId = 222
const canonicalId = 630
const legacyProductId = 7
const digest = async (file: string) => createHash('sha256').update(await readFile(file)).digest('hex')

const payload = await getPayload({ config })
try {
  const [legacyProduct, canonical] = await Promise.all([
    payload.findByID({ collection: 'products', id: legacyProductId, depth: 0, overrideAccess: true }) as Promise<any>,
    payload.findByID({ collection: 'media', id: canonicalId, depth: 0, overrideAccess: true }) as Promise<any>,
  ])
  const currentImage = typeof legacyProduct.image === 'object' ? legacyProduct.image?.id : legacyProduct.image
  const duplicateRows = await payload.find({
    collection: 'media', limit: 1, depth: 0, overrideAccess: true,
    where: { id: { equals: duplicateId } },
  }) as any

  if (!duplicateRows.docs.length) {
    if (currentImage !== canonicalId || canonical.filename !== 'rm-motor-pump-1.jpeg') {
      throw new Error('A duplikátum hiányzik, de a rekordok nem az összevont állapotot mutatják; megszakítva.')
    }
    console.log(`Az RM MOP képmédia már össze van vonva (media ${canonicalId}); nincs módosítás.`)
  } else {
    const duplicate = duplicateRows.docs[0]
    if (currentImage !== duplicateId || legacyProduct.productKind !== 'legacy') {
      throw new Error(`A régi RM terméktípus képe vagy szerepe váratlan (${currentImage}, ${legacyProduct.productKind}); megszakítva.`)
    }
    if (duplicate.filename !== 'rm-motor-pump.jpeg' || canonical.filename !== 'rm-motor-pump-1.jpeg') {
      throw new Error('A médiarekordok neve váratlan; megszakítva.')
    }

    const [duplicateHash, canonicalHash] = await Promise.all([
      digest(path.join(root, 'public/uploads/rm-motor-pump.jpeg')),
      digest(path.join(root, 'public/uploads/rm-motor-pump-1.jpeg')),
    ])
    if (duplicateHash !== canonicalHash) throw new Error('A két szivattyúfotó már nem bitre azonos; megszakítva.')

    const products = await payload.find({
      collection: 'products', limit: 1000, depth: 0, overrideAccess: true,
      where: { or: [{ image: { equals: duplicateId } }, { cardImage: { equals: duplicateId } }, { cardLogo: { equals: duplicateId } }] },
    }) as any
    const families = await payload.find({
      collection: 'product-families', limit: 1000, depth: 0, overrideAccess: true,
      where: { or: [{ image: { equals: duplicateId } }, { cardLogo: { equals: duplicateId } }] },
    }) as any
    if (products.docs.length !== 1 || products.docs[0].id !== legacyProductId || families.docs.length) {
      throw new Error('A duplikált média használata eltér a várt egyetlen archivált termékrekordtól; megszakítva.')
    }

    if (!apply) {
      console.log(`Előnézet: az RM MOP terméktípus képe ${duplicateId} helyett a termékkel és családdal közös ${canonicalId} médiára áll; a duplikátum törlődik. Nincs módosítás.`)
    } else {
      // This preserved legacy row has an old parent-category relation that fails current Payload validation.
      const databasePath = path.join(root, 'data/rm-hungary.db')
      const changes = execFileSync('sqlite3', [databasePath, `UPDATE products SET image_id=${canonicalId} WHERE id=${legacyProductId} AND image_id=${duplicateId}; SELECT changes();`], { encoding: 'utf8' }).trim()
      if (changes !== '1') throw new Error(`A régi termékkép frissítése nem pontosan egy sort módosított (${changes}); megszakítva.`)
      await payload.delete({ collection: 'media', id: duplicateId, overrideAccess: true })
      console.log(`A régi RM MOP terméktípus a termékkel és családdal közös képet használja (media ${canonicalId}); az igazolt duplikátum (media ${duplicateId}) eltávolítva.`)
    }
  }
} finally {
  await payload.destroy()
}
