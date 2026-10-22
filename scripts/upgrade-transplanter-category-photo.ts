import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const sourceUrl = 'https://madosz.hu/article/view?id=257'
const filePath = path.resolve('public/images/madosz/decloet-transplanter-category.jpg')
const payload = await getPayload({ config })

try {
  const category: any = (await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'palantaulteto-gepek' }, catalogRole: { equals: 'catalog' } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })).docs[0]
  const product: any = (await payload.find({
    collection: 'products',
    where: { slug: { equals: 'palantaulteto-gepek' }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })).docs[0]
  if (!category || !product) throw new Error('A palántaültető kategória vagy a helyi termékrekord nem található.')
  const relationId = (value: any) => String(typeof value === 'object' && value ? value.id : value || '')
  if (relationId(product.category) !== String(category.id) || product.manufacturer || product.brand) {
    throw new Error('A termékazonosság vagy besorolás megváltozott; a kategóriakép frissítése megszakadt.')
  }
  if (Number(product.image?.width || 0) >= 700) throw new Error('A helyi termékkép már legalább ilyen széles; a cserét újra kell értékelni.')

  const existingMedia: any = (await payload.find({
    collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  const currentImage = category.image && typeof category.image === 'object' ? category.image : null
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    category: { id: category.id, name: category.name, oldImage: currentImage?.filename || null, oldSize: currentImage ? `${currentImage.width}×${currentImage.height}` : 'termékkép-fallback' },
    product: { id: product.id, name: product.name, manufacturer: product.manufacturer || null, imagePreserved: product.image?.filename },
    replacement: { mediaId: existingMedia?.id || null, filename: 'decloet-transplanter-category.jpg', size: '700×500', source: sourceUrl },
  }, null, 2))
  if (apply) {
    const image: any = existingMedia || await payload.create({
      collection: 'media',
      overrideAccess: true,
      filePath,
      data: {
        alt: 'Négy sorban dolgozó De Cloet palántaültető gép',
        sourceUrl,
        credit: 'MADOSZ – Magyar Dohánytermelők Országos Szövetsége',
      } as any,
    } as any)
    await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: image.id } as any })

    const savedCategory: any = await payload.findByID({ collection: 'categories', id: category.id, depth: 1, overrideAccess: true })
    const savedProduct: any = await payload.findByID({ collection: 'products', id: product.id, depth: 1, overrideAccess: true })
    if (relationId(savedCategory.image) !== String(image.id) || relationId(savedProduct.image) !== relationId(product.image)) {
      throw new Error('A kategóriakép visszaolvasása hibás, vagy a termékkép váratlanul megváltozott.')
    }
    console.log(`A palántaültető kategória illusztrációja frissült (${image.width}×${image.height}); a termék saját képe és tartalma változatlan.`)
  }
} finally {
  await payload.destroy()
}
