import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

const expected = [
  { slug: 'mantovani-idrojet-125', order: 125 },
  { slug: 'mantovani-1400-vv', order: 1400 },
]

for (const item of expected) {
  const result: any = await payload.find({
    collection: 'products',
    where: { slug: { equals: item.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const product = result.docs[0]
  if (!product) throw new Error(`A termék nem található: ${item.slug}`)
  console.log(`${apply ? 'Alkalmazás' : 'Előnézet'}: ${product.name} | ${product.sortOrder ?? 0} → ${item.order}`)
  if (apply && product.sortOrder !== item.order) {
    await payload.update({
      collection: 'products',
      id: product.id,
      overrideAccess: true,
      data: { sortOrder: item.order } as any,
    })
  }
}

await payload.destroy()
