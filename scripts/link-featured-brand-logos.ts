import { getPayload } from 'payload'
import config from '../payload.config'

const links = [
  { slug: 'rm', mediaId: 7 },
  { slug: 'rovatti', mediaId: 8 },
  { slug: 'starpower', mediaId: 9 },
  { slug: 'giunti', mediaId: 6 },
  { slug: 'de-cloet', mediaId: 5 },
]
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

try {
  for (const { slug, mediaId } of links) {
    const result = await payload.find({
      collection: 'manufacturers',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const brand = result.docs[0] as any
    if (!brand) throw new Error(`Gyártó nem található: ${slug}`)
    if (brand.logo && Number(typeof brand.logo === 'object' ? brand.logo.id : brand.logo) !== mediaId) {
      throw new Error(`${slug}: már van másik logókapcsolat; ellenőrzés szükséges.`)
    }
    const media = await payload.findByID({ collection: 'media', id: mediaId, depth: 0, overrideAccess: true })
    if (!media) throw new Error(`Logó médiatétel nem található: ${mediaId}`)
    console.log(`${apply ? 'Kapcsolás' : 'Előnézet'}: ${slug} → ${media.filename}${brand.logo ? ' (már beállítva)' : ''}`)
    if (apply && !brand.logo) {
      await payload.update({ collection: 'manufacturers', id: brand.id, overrideAccess: true, data: { logo: mediaId } as any })
    }
  }
} finally {
  await payload.destroy()
}
