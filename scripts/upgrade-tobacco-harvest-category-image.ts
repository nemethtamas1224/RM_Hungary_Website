import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

try {
  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'dohanybetakaritas' }, catalogRole: { equals: 'catalog' } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const category = categoryResult.docs[0] as any
  const productResult = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'de-cloet-1th4' }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })
  const product = productResult.docs[0] as any
  if (!category || !product) throw new Error('A kategória vagy a De Cloet 1TH4 termék nem található.')

  const relationId = (value: any) => String(typeof value === 'object' && value ? value.id : value || '')
  if (relationId(product.category) !== String(category.id) || product.manufacturer?.slug !== 'de-cloet') {
    throw new Error('A De Cloet 1TH4 kategória- vagy gyártókapcsolata megváltozott; nincs módosítás.')
  }
  const cardImage = product.cardImage && typeof product.cardImage === 'object' ? product.cardImage : null
  const currentImage = category.image && typeof category.image === 'object' ? category.image : null
  if (!cardImage?.id || !cardImage.sourceUrl || !cardImage.width || !currentImage?.id) {
    throw new Error('Hiányzik a gyártói képreláció vagy a jelenlegi kategóriakép; nincs módosítás.')
  }
  if (Number(cardImage.width) <= Number(currentImage.width)) {
    throw new Error('A javasolt termékkép felbontása nem jobb; nincs módosítás.')
  }

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    category: { id: category.id, name: category.name, oldImage: currentImage.filename, oldSize: `${currentImage.width}×${currentImage.height}` },
    replacement: { product: product.name, manufacturer: product.manufacturer.name, imageId: cardImage.id, filename: cardImage.filename, size: `${cardImage.width}×${cardImage.height}`, source: cardImage.sourceUrl },
  }, null, 2))

  if (apply) {
    await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: cardImage.id } as any })
    const saved = await payload.findByID({ collection: 'categories', id: category.id, depth: 1, overrideAccess: true }) as any
    if (String(saved.image?.id || saved.image) !== String(cardImage.id)) throw new Error('A kategóriakép visszaolvasása nem egyezik.')
    console.log('A dohánybetakarító kategóriakép frissült; a korábbi médiafájl megmaradt a médiatárban.')
  }
} finally {
  await payload.destroy()
}
