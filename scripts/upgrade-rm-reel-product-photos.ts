import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const photos: Record<string, string> = {
  'rm-600-xj': 'xj-600-main.jpg',
  'rm-700-xj': 'xj-700-main.jpg',
  'rm-800-xj': 'xj-800-main.jpg',
  'rm-840-xj': 'xj-840-main.jpg',
  'rm-900-xj-evo': 'xj-900-main.jpg',
  'rm-magnum-giant': 'xj-giant-main.jpg',
  'rm-major-evo': 'xj-major-main.jpg',
  'rm-600-xjm': '600-xjm_1_1.jpg',
  'rm-700-xjm': 'xjm-700-1.jpg',
  'rm-800-xjm': '800-xjm_1_1.jpg',
  'rm-840-xjm': 'xjm-840-1.jpg',
  'rm-900-xjm': 'xjm-900-1.jpg',
  'rm-giant-xjm': 'xjm-giant-1.jpg',
  'rm-magnum-xjm': 'magnum-xjm_1_1.jpg',
  'rm-major-xjm': 'xjm-major-1.jpg',
  'rm-900-fx': 'fx-900-1.jpg',
  'rm-magnum-fx': 'fx-magnum-1.jpg',
}

const payload = await getPayload({ config })
try {
  const products = (await payload.find({
    collection: 'products',
    where: { slug: { in: Object.keys(photos) } },
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })).docs as any[]
  const bySlug = new Map(products.map((product) => [product.slug, product]))
  const changes: Array<{ id: number; slug: string; oldImage: string; newImage: any }> = []

  for (const [slug, filename] of Object.entries(photos)) {
    const product = bySlug.get(slug)
    if (!product) throw new Error(`Hiányzó RM modellrekord: ${slug}`)
    const candidate = (product.gallery || []).find((entry: any) => entry?.filename === filename)
    if (!candidate || Number(candidate.width) < 700 || Number(candidate.height) < 300) {
      throw new Error(`${slug}: a megfelelő, kellő felbontású gyártói fotó nincs a termék galériájában: ${filename}`)
    }
    const current = product.image && typeof product.image === 'object' ? product.image : null
    if (current?.id === candidate.id) continue
    changes.push({ id: product.id, slug, oldImage: current?.filename || '(hiányzik)', newImage: candidate })
  }

  if (!apply) {
    console.log(`Előnézet: ${changes.length} termék főképe cserélhető a saját galériájában már szereplő, legalább 700×300 px-es RM gyártói termékfotóra.`)
    for (const item of changes) console.log(`${item.slug}: ${item.oldImage} → ${item.newImage.filename} (${item.newImage.width}×${item.newImage.height})`)
    console.log('Alkalmazáshoz: pnpm upgrade:rm-reel-product-photos -- --apply (előtte készíts adatbázismentést).')
  } else {
    for (const item of changes) {
      await payload.update({ collection: 'products', id: item.id, data: { image: item.newImage.id }, depth: 0, overrideAccess: true } as any)
    }
    console.log(`RM csévélődobok főképe frissítve: ${changes.length} termék.`)
  }
} finally {
  await payload.destroy()
}
