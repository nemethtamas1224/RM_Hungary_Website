import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const sourceUrl = 'https://www.rmirrigation.com/hu/modell/motopompe.html'
const filenames = ['MOP-1095-5.jpg', 'MOP-1095-6.jpg', 'MOP-1095-3.jpg', 'MOP-1095-4.jpg', 'MOP-1095-1.jpg', 'mop2.jpg', 'mop3.jpg', 'mop4.jpg']
const payload = await getPayload({ config })

try {
  const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'rm-motoros-szivattyuegyseg' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!product) throw new Error('Az RM MOP termékrekord nem található.')

  const records = await Promise.all(filenames.map(async (filename) => {
    const doc: any = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 5, depth: 0, overrideAccess: true })).docs.find((item: any) => item.sourceUrl === sourceUrl)
    if (!doc) throw new Error(`Hiányzik vagy nem gyártói forrású RM MOP fotó: ${filename}`)
    if (!doc.mimeType?.startsWith('image/')) throw new Error(`Nem képfájl a galériához: ${filename}`)
    return doc
  }))

  const currentGallery = (product.gallery || []).map((item: any) => typeof item === 'object' ? item.id : item).filter(Boolean)
  const mainImage = typeof product.image === 'object' ? product.image.id : product.image
  const gallery = [...new Set([...currentGallery.filter((id: number) => id !== mainImage), ...records.map((item: any) => item.id)].filter(Boolean))]
  const evidence = [...(product.sourceEvidence || [])]
  if (!evidence.some((item: any) => item.url === sourceUrl && String(item.note || '').includes('fotó'))) {
    evidence.push({ url: sourceUrl, note: 'A termékgaléria RM MOP gyártói termékfotói.', media: records[0].id })
  }

  console.log(`${apply ? 'Alkalmazás' : 'Előnézet'}: ${records.length} hivatalos RM MOP fotó; a galéria összesen ${gallery.length} képet tartalmaz majd.`)
  for (const item of records) console.log(`- ${item.filename}: ${item.width}×${item.height}, ${item.filesize} byte`)
  if (JSON.stringify(gallery) === JSON.stringify(currentGallery) && evidence.length === (product.sourceEvidence || []).length) {
    console.log('A termékgaléria és a forrásjegyzet már naprakész.')
  } else if (apply) {
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { gallery, sourceEvidence: evidence } as any })
    console.log('Az RM MOP termékgaléria és forrásjegyzet frissítve.')
  }
} finally {
  await payload.destroy()
}
