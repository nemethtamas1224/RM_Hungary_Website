import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = process.cwd()
const apply = process.argv.includes('--apply')
const logos = [
  { slug: 'cosmeco', name: 'Cosmeco', file: 'cosmeco.png', source: 'https://www.cosmeco.it/azienda' },
  { slug: 'da-ros', name: 'Da Ros', file: 'da-ros.png', source: 'https://da-ros.com/en/' },
  { slug: 'de-cloet', name: 'De Cloet', file: 'de-cloet.png', source: 'https://www.decloet.it/en/products.html' },
  { slug: 'giunti', name: 'Giunti', file: 'giunti.png', source: 'https://www.giuntispa.com/' },
  { slug: 'mantovani', name: 'Mantovani', file: 'mantovani.png', source: 'https://www.mantovanisrl.it/' },
  { slug: 'oliveragro', name: 'Oliver Agro', file: 'oliveragro.png', source: 'https://www.oliveragro.it/azienda/' },
  { slug: 'rovatti', name: 'Rovatti', file: 'rovatti.png', source: 'https://www.rovatti.it/gruppo-rovatti' },
  { slug: 'starpower', name: 'Starpower', file: 'starpower.png', source: 'https://starpower.it/' },
  { slug: 'valducci', name: 'Valducci', file: 'valducci.png', source: 'https://www.giuntispa.com/valducci-brand/' },
  { slug: 'vodar', name: 'Vodar', file: 'vodar.png', source: 'https://www.vodarirrigations.com/' },
]

const payload = await getPayload({ config })
try {
  for (const item of logos) {
    const filePath = path.join(root, 'public/images/manufacturers', item.file)
    if (!fs.existsSync(filePath)) throw new Error(`Hiányzó logófájl: ${item.file}`)
    const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
    if (!manufacturer) throw new Error(`Gyártó nem található: ${item.slug}`)
    const existing = (await payload.find({ collection: 'media', where: { filename: { equals: item.file } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
    console.log(`${apply ? 'Alkalmazás' : 'Előnézet'}: ${item.name} ← ${item.file}; ${existing ? `média #${existing.id}` : 'új médiatétel'}${manufacturer.logo ? `; jelenlegi logó: ${typeof manufacturer.logo === 'object' ? manufacturer.logo.id : manufacturer.logo}` : '; jelenleg nincs logó'}`)
    if (!apply) continue
    const media = existing || await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: {
        alt: `${item.name} hivatalos logó`,
        sourceUrl: item.source,
        credit: 'A projekt márkaeszközei között megőrzött gyártói logófájl; a logó márkaneve vizuálisan ellenőrizve.',
      } as any,
      filePath,
    } as any)
    if (existing && (existing.alt !== `${item.name} hivatalos logó` || existing.sourceUrl !== item.source)) {
      await payload.update({ collection: 'media', id: existing.id, overrideAccess: true, data: { alt: `${item.name} hivatalos logó`, sourceUrl: item.source, credit: 'A projekt márkaeszközei között megőrzött gyártói logófájl; a logó márkaneve vizuálisan ellenőrizve.' } as any })
    }
    const currentId = typeof manufacturer.logo === 'object' ? manufacturer.logo?.id : manufacturer.logo
    if (Number(currentId) !== Number(media.id)) {
      await payload.update({ collection: 'manufacturers', id: manufacturer.id, overrideAccess: true, data: { logo: media.id } as any })
    }
  }
} finally {
  await payload.destroy()
}
