import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
try {
  const category: any = (await payload.find({
    collection: 'categories', where: { slug: { equals: 'talajelokeszites' }, catalogRole: { equals: 'catalog' } },
    limit: 1, depth: 1, overrideAccess: true,
  })).docs[0]
  const product: any = (await payload.find({
    collection: 'products', where: { slug: { equals: 'bakhathuzo-gepek' }, status: { equals: 'published' } },
    limit: 1, depth: 2, overrideAccess: true,
  })).docs[0]
  const candidate: any = (await payload.find({
    collection: 'media', where: { id: { equals: 96 } }, limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  if (!category || !product || !candidate) throw new Error('A talajelőkészítő kategória, termék vagy jobb képfájl hiányzik.')
  const relationId = (value: any) => String(typeof value === 'object' && value ? value.id : value || '')
  if (relationId(product.category) !== String(category.id) || product.manufacturer || product.slug !== 'bakhathuzo-gepek') {
    throw new Error('A kategória vagy termék besorolása megváltozott; módosítás megszakítva.')
  }
  if (Number(candidate.width) <= Number(product.image?.width || 0) || Number(candidate.width) < 500) {
    throw new Error('A kapcsolódó fotó felbontása nem megfelelő; módosítás megszakítva.')
  }
  const gallery = Array.isArray(product.gallery) ? product.gallery : []
  if (!gallery.some((entry: any) => relationId(entry) === String(candidate.id)) || !String(candidate.alt || '').includes('Bakháthúzó gépek')) {
    throw new Error('A képről nem igazolható, hogy ehhez a termékhez tartozik; módosítás megszakítva.')
  }
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    category: { id: category.id, name: category.name },
    product: { id: product.id, name: product.name, oldImage: product.image?.filename, oldSize: `${product.image?.width}×${product.image?.height}` },
    replacement: { id: candidate.id, filename: candidate.filename, size: `${candidate.width}×${candidate.height}`, source: candidate.sourceUrl },
  }, null, 2))
  if (apply) {
    const orderedGallery = [candidate.id, ...gallery.map((entry: any) => Number(relationId(entry))).filter((id: number) => id !== Number(candidate.id))]
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { image: candidate.id, cardImage: candidate.id, gallery: orderedGallery } as any })
    await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: candidate.id } as any })
    const savedCategory: any = await payload.findByID({ collection: 'categories', id: category.id, depth: 1, overrideAccess: true })
    const savedProduct: any = await payload.findByID({ collection: 'products', id: product.id, depth: 2, overrideAccess: true })
    if (relationId(savedCategory.image) !== String(candidate.id) || relationId(savedProduct.image) !== String(candidate.id) || relationId(savedProduct.cardImage) !== String(candidate.id)) {
      throw new Error('Az új, központi képkapcsolat visszaolvasása nem egyezik.')
    }
    console.log('A talajelőkészítő kártya, termékkártya és termékoldal közös, 598×374-es képet használ; a régi fájl a médiatárban megmaradt.')
  }
} finally {
  await payload.destroy()
}
