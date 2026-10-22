import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

const items = [
  { id: 112, slug: 'rm-major-xj-evo' },
  { id: 98, slug: 'ontozovizagyu' },
]

try {
  for (const item of items) {
    const product: any = await payload.findByID({ collection: 'products', id: item.id, depth: 0, overrideAccess: true })
    if (product.slug !== item.slug || product.reviewState !== 'source-check') {
      throw new Error(`A rekord váratlan állapotú: ${item.id} / ${product.slug} / ${product.reviewState}`)
    }
    console.log(`${apply ? 'Alkalmazás' : 'Előnézet'}: ${product.name} | ${product.status} → draft; kategória és slug megmarad`)
    if (apply && product.status !== 'draft') {
      await payload.update({ collection: 'products', id: item.id, overrideAccess: true, data: { status: 'draft' } as any })
    }
  }

  if (apply) {
    for (const item of items) {
      const product: any = await payload.findByID({ collection: 'products', id: item.id, depth: 0, overrideAccess: true })
      if (product.status !== 'draft' || product.reviewState !== 'source-check' || product.slug !== item.slug) {
        throw new Error(`A piszkozat állapot visszaellenőrzése sikertelen: ${item.id}`)
      }
      console.log(`Visszaolvasva: ${product.id} ${product.slug} ${product.status}`)
    }
  }
} finally {
  await payload.destroy()
}
