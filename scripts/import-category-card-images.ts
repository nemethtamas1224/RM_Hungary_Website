import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })

const items = [
  {
    categorySlug: 'csevelodobos',
    candidate: async () => {
      const family: any = (await payload.find({
        collection: 'product-families', where: { slug: { equals: 'rm-gx' } }, limit: 1, depth: 1, overrideAccess: true,
      })).docs[0]
      return family?.image
    },
    description: 'RM csévélődob-családok többféle konstrukcióval a különböző öntözési feladatokhoz.',
  },
  {
    categorySlug: 'ontozoszarnyak',
    candidate: async () => {
      const product: any = (await payload.find({
        collection: 'products', where: { slug: { equals: 'albatros' } }, limit: 1, depth: 1, overrideAccess: true,
      })).docs[0]
      return product?.cardImage
    },
    description: 'RM esőztető szárnyak és konzolok a termőterület egyenletes vízellátásához.',
  },
] as const

for (const item of items) {
  const category: any = (await payload.find({
    collection: 'categories', where: { slug: { equals: item.categorySlug }, catalogRole: { equals: 'catalog' }, parent: { exists: true } },
    limit: 1, depth: 1, overrideAccess: true,
  })).docs[0]
  if (!category) throw new Error(`Nem található az aktív alkategória: ${item.categorySlug}`)

  const candidate: any = await item.candidate()
  const imageId = candidate && typeof candidate === 'object' ? candidate.id : candidate
  if (!imageId) throw new Error(`Nincs ellenőrzött képreláció a kategóriához: ${item.categorySlug}`)
  const existingImageId = category.image && typeof category.image === 'object' ? category.image.id : category.image
  if (existingImageId && String(existingImageId) !== String(imageId)) {
    throw new Error(`A(z) ${item.categorySlug} kategóriának már másik képe van; felülírás megszakítva.`)
  }

  await payload.update({
    collection: 'categories', id: category.id, overrideAccess: true,
    data: {
      image: imageId,
      description: category.description || item.description,
    },
  })
}

console.log('Kategóriakártya-képek és egy soros összefoglalók összekapcsolva: RM csévélődobok, RM öntözőszárnyak.')
await payload.destroy()
