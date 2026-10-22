import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const summaries: Record<string, string> = {
  'rm-560-gx': 'Forgó torony szerkezetű RM 560 GX csévélődob.',
  'rm-570-gx-evo': 'Forgó torony szerkezetű RM 570 GX EVO csévélődob.',
  'rm-581-gx-evo': 'Forgó torony szerkezetű RM 581 GX EVO csévélődob.',
  'rm-690-gx-evo': 'Forgó torony szerkezetű RM 690 GX EVO csévélődob.',
  'rm-790-gx': 'Forgó torony szerkezetű RM 790 GX csévélődob.',
  'rm-890-gx': 'Forgó torony szerkezetű RM 890 GX csévélődob.',
  'rm-990-gx': 'Forgó torony szerkezetű RM 990 GX csévélődob.',
  'rm-600-xjm': 'Beépített motorral szerelt RM 600 XJM csévélődob.',
  'rm-800-xjm': 'Beépített motorral szerelt RM 800 XJM csévélődob.',
  'rm-magnum-xjm': 'Beépített motorral szerelt RM Magnum XJM csévélődob.',
  'rm-magnum': 'RM Magnum csévélődob.',
  albatros: 'RM Albatros esővízszárny öntözőgépekhez.',
  falcon: 'RM Falcon esővízszárny öntözőgépekhez.',
  boom: 'RM Boom esővízszárny öntözőgépekhez.',
  condor: 'RM Condor esővízszárny öntözőgépekhez.',
  liquo: 'RM Liquò szárny digestátum kijuttatásához.',
  'rm-1100-gx': 'Forgó torony szerkezetű RM 1100 GX csévélődob.',
  'rm-major-xj-evo': 'RM Major XJ EVO csévélődob.',
}

const payload = await getPayload({ config })
try {
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
    where: { slug: { in: Object.keys(summaries) } },
  })
  const bySlug = new Map((products.docs as any[]).map((product) => [product.slug, product]))
  const missing = Object.keys(summaries).filter((slug) => !bySlug.has(slug))
  if (missing.length) throw new Error(`Hiányzó termékrekordok: ${missing.join(', ')}`)

  const update = (products.docs as any[]).filter((product) => !String(product.summary || '').trim())
  if (!apply) {
    console.log(`Előnézet: ${update.length} üres RM termék-összefoglaló tölthető ki; nincs módosítás.`)
    for (const product of update) console.log(`${product.slug}: ${summaries[product.slug]}`)
    process.exitCode = 0
  } else {
    for (const product of update) {
      await payload.update({
        collection: 'products',
        id: product.id,
        overrideAccess: true,
        data: { summary: summaries[product.slug] },
      } as any)
    }
    console.log(`Kitöltve: ${update.length} rövid RM termék-összefoglaló.`)
  }
} finally {
  await payload.destroy()
}
