import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const article = 'https://madosz.hu/article/view?id=257'
const root = path.resolve('public/images/madosz')
const targets = [
  {
    categorySlug: 'zold-dohany-feldolgozas',
    productSlug: 'zold-dohany-feldolgozo-gepek',
    filename: 'green-tobacco-handling.jpg',
    sourceUrl: 'https://madosz.hu/storage/kcf-upload/files/regi-fajlok/Image/kaszcoop/ilk/gepek/new-20.jpg',
    alt: 'Zölddohány-feldolgozó gép levelek válogatásához és anyagmozgatásához',
  },
  {
    categorySlug: 'dohany-szaritas',
    productSlug: 'dohany-szarito-kamrak',
    filename: 'tobacco-drying.jpg',
    sourceUrl: 'https://madosz.hu/storage/kcf-upload/files/regi-fajlok/Image/kaszcoop/ilk/gepek/new-22.jpg',
    alt: 'Dohánylevelek berakodása szárítókamrába',
  },
] as const

const payload = await getPayload({ config })
try {
  for (const target of targets) {
    const category: any = (await payload.find({
      collection: 'categories', where: { slug: { equals: target.categorySlug }, catalogRole: { equals: 'catalog' } },
      limit: 1, depth: 1, overrideAccess: true,
    })).docs[0]
    const product: any = (await payload.find({
      collection: 'products', where: { slug: { equals: target.productSlug }, status: { equals: 'published' } },
      limit: 1, depth: 1, overrideAccess: true,
    })).docs[0]
    if (!category || !product) throw new Error(`Hiányzó kategória vagy termék: ${target.categorySlug}/${target.productSlug}`)
    const relationId = (value: any) => String(typeof value === 'object' && value ? value.id : value || '')
    if (relationId(product.category) !== String(category.id) || product.manufacturer || product.brand) {
      throw new Error(`A terméktípus vagy besorolás megváltozott: ${target.productSlug}; módosítás nélkül leáll.`)
    }
    const existingMedia: any = (await payload.find({
      collection: 'media', where: { sourceUrl: { equals: target.sourceUrl } }, limit: 1, depth: 0, overrideAccess: true,
    })).docs[0]
    const currentImage = category.image && typeof category.image === 'object' ? category.image : null
    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'preview',
      category: { id: category.id, name: category.name, oldImage: currentImage?.filename || null, oldSize: currentImage ? `${currentImage.width}×${currentImage.height}` : null },
      product: { id: product.id, name: product.name, mainImagePreserved: product.image?.filename },
      replacement: { id: existingMedia?.id || null, filename: target.filename, size: '700×500', source: article },
    }, null, 2))
    if (!apply) continue

    const image: any = existingMedia || await payload.create({
      collection: 'media', overrideAccess: true, filePath: path.join(root, target.filename),
      data: { alt: target.alt, sourceUrl: target.sourceUrl, credit: `MADOSZ – Magyar Dohánytermelők Országos Szövetsége; ${article}` } as any,
    } as any)
    await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: image.id } as any })
    const savedCategory: any = await payload.findByID({ collection: 'categories', id: category.id, depth: 1, overrideAccess: true })
    const savedProduct: any = await payload.findByID({ collection: 'products', id: product.id, depth: 1, overrideAccess: true })
    if (relationId(savedCategory.image) !== String(image.id) || relationId(savedProduct.image) !== relationId(product.image)) {
      throw new Error(`A kapcsolat ellenőrzése hibás: ${target.categorySlug}`)
    }
    console.log(`Frissítve: ${category.name}; ${image.width}×${image.height}; a termék saját képe változatlan.`)
  }
} finally {
  await payload.destroy()
}
