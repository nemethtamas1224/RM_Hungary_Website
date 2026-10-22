import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

try {
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'ontozovizagyu' } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const product = result.docs[0] as any
  if (!product) throw new Error('Az Öntözővízágyú rekord nem található.')
  if (product.status !== 'published') throw new Error(`Váratlan státusz: ${product.status}`)
  if (product.manufacturer?.slug !== 'giunti') throw new Error(`Váratlan márkakapcsolat: ${product.manufacturer?.slug ?? 'nincs'}`)
  if (product.category?.slug !== 'ontozofejek-vizagyuk') throw new Error(`Váratlan kategória: ${product.category?.slug ?? 'nincs'}`)

  const changes = {
    manufacturer: null,
    brand: '',
    reviewState: 'source-check',
    reviewNote: 'A régi RM alkat=13 forrásoldal csepegtető/mikroöntözési tartalmat mutat, nem azonosítja ezt a terméket vagy annak gyártóját. Giunti márkakötés feloldva; kategória és publikus útvonal megőrizve. Kép és leírás csak pontos modellazonosítás után adható meg.',
  }

  if (!apply) {
    console.log('Előnézet – változtatás nincs:')
    console.log(JSON.stringify({ id: product.id, slug: product.slug, currentManufacturer: product.manufacturer?.name ?? null, currentCategory: product.category?.slug, currentStatus: product.status, planned: changes }, null, 2))
  } else {
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: changes } as any)
    const updated = await payload.findByID({ collection: 'products', id: product.id, depth: 1, overrideAccess: true }) as any
    if (updated.manufacturer || updated.brand || updated.reviewState !== 'source-check' || updated.category?.slug !== 'ontozofejek-vizagyuk' || updated.status !== 'published') {
      throw new Error('Az új termékbesorolás ellenőrzése sikertelen.')
    }
    console.log(`Frissítve: ${updated.slug}; márkakötés feloldva, kategória és URL megőrizve.`)
  }
} finally {
  await payload.destroy()
}
