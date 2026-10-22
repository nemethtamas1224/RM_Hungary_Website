import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'valducci' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const category = (await payload.find({ collection: 'categories', where: { slug: { equals: 'vizszurok' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!manufacturer || !category) throw new Error('A Valducci márka vagy a vízszűrő kategória nem található.')

const sourceUrl = 'https://www.giuntispa.com/valducci-brand/'
const imageUrl = 'https://www.giuntispa.com/wp-content/uploads/2017/12/BATT-3-QUARZITE-900.jpg'
const imageAlt = 'Valducci háromtartályos kvarchomok-szűrő egység'
let image = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: imageUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!image) image = await payload.create({
  collection: 'media', overrideAccess: true,
  data: { alt: imageAlt, sourceUrl: imageUrl, credit: 'Giunti S.p.A. hivatalos Valducci márkaoldala' },
  filePath: path.join(root, 'public/images/valducci/filters/valducci-quartzite-filter-battery.jpg'),
} as any)

const slug = 'valducci-szurok'
const data = {
  manufacturer: manufacturer.id,
  category: category.id,
  name: 'Valducci szűrőrendszerek',
  slug,
  sortOrder: 20,
  status: 'published',
  summary: 'Kavicságyas, hálós és tárcsás szűrők, hidrociklonok, tápoldatozók és egyedi szűrőállomások.',
  cardTitle: 'Valducci szűrők',
  cardDescription: 'Szűrési megoldások eltérő vízminőséghez és öntözési rendszerekhez.',
  image: image.id,
  overviewTitle: 'Valducci szűrési megoldások',
  overviewIntro: 'A Valducci szűrőválasztéka többféle szűrési elvet és egyedi összeállítású szűrőállomásokat foglal magában.',
  overviewSections: [
    {
      heading: 'Szűrés a vízminőséghez igazítva',
      body: 'A választékban kvarchomokágyas, hálós és tárcsás szűrők, hidrociklonok, valamint tápoldatozó tartályok szerepelnek. A megfelelő szűrőtípust az alkalmazási terület és az öntözővíz minősége határozza meg.',
      image: image.id,
      imageAlt,
    },
    {
      heading: 'Egyedi szűrőállomások',
      body: 'A gyártó műszaki részlege az adott feladathoz igazított szűrőállomásokat is összeállít. A gyártói márkaoldal nem közöl hozzájuk konkrét modell- vagy mérettáblázatot.',
    },
  ],
  sourceUrl,
  sourceDetails: 'A Valducci hivatalos márkaoldalán szereplő szűrőtípusok és szűrőállomás-bemutató. A hivatkozott szűrőbrosúra letöltési ikonja nem tartalmaz fájlhivatkozást; konkrét Valducci modellszintű méretadatot nem adtam meg.',
  reviewNote: 'A Valducci szűrőcsaládot a hivatalos márkaoldal igazolja. A konkrét modellsorozat és a brosúra nem érhető el a forrásoldalról; a Giunti szűrőtermékeket nem társítottam automatikusan ehhez a márkához.',
}
const existing = (await payload.find({ collection: 'product-families', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const family = existing
  ? await payload.update({ collection: 'product-families', id: existing.id, overrideAccess: true, data: data as any })
  : await payload.create({ collection: 'product-families', overrideAccess: true, data: data as any })

console.log(JSON.stringify({ family: family.name, id: family.id, image: image.filename, sourceUrl }, null, 2))
await payload.destroy()
