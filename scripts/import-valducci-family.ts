import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'valducci' } }, limit: 1, overrideAccess: true })).docs[0] as any
const category = (await payload.find({ collection: 'categories', where: { slug: { equals: 'szelepek-hidranok' } }, limit: 1, overrideAccess: true })).docs[0] as any
const product = (await payload.find({ collection: 'products', where: { slug: { equals: 'hidransfej' } }, limit: 1, depth: 1, overrideAccess: true })).docs[0] as any
if (!manufacturer || !category || !product) throw new Error('Valducci gyártó, hidráns kategória vagy termék nem található.')
const logoUrl = 'https://www.giuntispa.com/wp-content/uploads/2017/12/Valducci-logo-Giunti.jpg'
let logo = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: logoUrl } }, limit: 1, overrideAccess: true })).docs[0] as any
if (!logo) logo = await payload.create({ collection: 'media', overrideAccess: true, data: { alt: 'Valducci és Giunti logó', sourceUrl: logoUrl, credit: 'Giunti S.p.A. hivatalos márkaoldala' }, filePath: path.join(root, 'public/images/valducci/valducci-giunti-logo.jpg') } as any)
await payload.update({ collection: 'manufacturers', id: manufacturer.id, overrideAccess: true, data: {
  description: 'A Valducci Irrigazione márka öntözőgépeket, szűrőrendszereket és rögzített öntözőhálózatok szerelvényeit kínálja. A márka 2004 óta a Giunti csoport része.',
  logo: logo.id,
  sourceUrl: 'https://www.giuntispa.com/valducci-brand/',
} as any })
const familySlug = 'valducci-hidransfejek'
let family = (await payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, overrideAccess: true })).docs[0] as any
const familyData = {
  name: 'Valducci hidránsfejek', slug: familySlug, category: category.id, manufacturer: manufacturer.id,
  sortOrder: 10, summary: 'Bajonettzáras és szigonyos csatlakozású hidránsfejek rögzített és mobil öntözőrendszerekhez.',
  image: typeof product.image === 'object' ? product.image.id : product.image,
  cardLogo: logo.id, cardTitle: 'Valducci',
  cardDescription: 'Hidránsfejek bajonettzáras és szigonyos csatlakozással.',
  sourceDetails: 'A Valducci hivatalos márkaoldala külön hidránsfejeket és hozzájuk illeszkedő hidránsgörbéket nevez meg.',
  sourceUrl: 'https://www.giuntispa.com/valducci-brand/', status: 'published',
}
if (family) family = await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData as any })
else family = await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })
const productEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const urls = [
  ['https://www.giuntispa.com/valducci-brand/', 'A Valducci márka és a hidránsfej-család hivatalos áttekintője.'],
  ['https://www.giuntispa.com/en/product/hydrant-heads-harpoon-2/', 'A hidránsfej anyagára, tömítésére, Johnson-elvű működésére és gyártói próbájára vonatkozó leírás.'],
]
for (const [url, note] of urls) if (!productEvidence.some((item: any) => item.url === url)) productEvidence.push({ url, note })
await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { family: family.id, sortOrder: 10, showInFamily: true, sourceEvidence: productEvidence } as any })
console.log(JSON.stringify({ manufacturer: manufacturer.name, family: family.name, product: product.name, logo: logo.filename }, null, 2))
await payload.destroy()
