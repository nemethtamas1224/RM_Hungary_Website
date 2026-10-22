import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const categoryUrl = 'https://da-ros.com/en/products/seeders-and-seeding-lines/'
const sem100Url = 'https://da-ros.com/en/product/seeder-sem-100/'
const legacyUrl = 'https://www.rmhungary.hu/index.php?alkat=9'
const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })

async function media(sourceUrl: string, file: string, alt: string, credit: string) {
  let item: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!item) item = await payload.create({ collection: 'media', overrideAccess: true, data: { alt, sourceUrl, credit }, filePath: path.join(root, file) } as any)
  else await payload.update({ collection: 'media', id: item.id, overrideAccess: true, data: { alt, credit } as any })
  return item
}

const familyImage = await media('https://da-ros.com/wp-content/uploads/2022/12/SEM100-scaled.jpg', 'public/images/da-ros/sem100-official.jpg', 'Da Ros SEM 100 – példa a tálcás magvetőgépek családjára', 'Da Ros hivatalos SEM 100 termékoldala; családkártya-illusztráció')
const productPhoto = await media('https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image1%285%29.jpeg', 'public/images/da-ros/tray-seeder-01.jpeg', 'Da Ros tálcás magvetőgép, az RM Hungary korábbi kategóriaoldalán szereplő fotó', 'RM Hungary korábbi Tálcás magvető gépek kategóriaoldala')
const relatedPhoto = await media('https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image2.png', 'public/images/da-ros/tray-seeder-02.png', 'Da Ros vetőgép és tálcás vetősor, az RM Hungary korábbi kategóriaoldalán szereplő fotó', 'RM Hungary korábbi Tálcás magvető gépek kategóriaoldala')

const maker: any = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'da-ros' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: 'magveto-gepek' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'da-ros-talcas-magvetogep' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!maker || !category || !product) throw new Error('Missing Da Ros manufacturer, category, or product record.')

const makerCopy = 'A Da Ros faiskolai vetőgépeket és vetősorokat tervez és gyárt. Kínálatában önálló magvetőgépek és az adott munkafolyamathoz illeszthető, moduláris vetősorok találhatók.'
await payload.update({ collection: 'manufacturers', id: maker.id, overrideAccess: true, data: { description: makerCopy, sourceUrl: categoryUrl, reviewNote: 'A magvetőgépek és vetősorok gyártói kínálata a Da Ros hivatalos kategóriaoldalával egyeztetve.' } as any })
await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { description: 'Tálcás magvetőgépek és a vetési folyamatot kiegészítő, moduláris vetősorok faiskolák számára.' } as any })

let family: any = (await payload.find({ collection: 'product-families', where: { slug: { equals: 'da-ros-seeders' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const familyData = {
  name: 'Da Ros tálcás magvetőgépek', slug: 'da-ros-seeders', category: category.id, manufacturer: maker.id,
  summary: 'Tálcás magvetőgépek és moduláris vetősorok faiskolai vetéshez.', image: familyImage.id, status: 'published', sortOrder: 10,
  sourceUrl: categoryUrl,
  sourceDetails: 'A gyártó 1986 óta tervez és gyárt faiskolai vetőgépeket és vetősorokat. A hivatalos kínálatban soronként vető és hengeres vetőgépek, valamint különféle kiegészítő modulokkal összeállítható vetősorok szerepelnek. A SEM 100 kép kizárólag a családkártya reprezentatív illusztrációja; nem azonosítja a helyi termék modellszámát.',
  reviewNote: 'A családbemutató a Da Ros hivatalos kategóriaoldalán ellenőrizve. A kártyakép a hivatalos SEM 100 oldalról származó családpélda; a helyi termék modellje nincs azonosítva.',
}
family = family ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData as any }) : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })

await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
  name: 'Da Ros tálcás magvetőgép', manufacturer: maker.id, brand: 'Da Ros', category: category.id, family: family.id,
  productKind: 'type', reviewState: 'specs-missing',
  summary: 'Tálcás magvetőgép kis- és nagy termelők számára.',
  description: richText([
    'A tálcás magvetőgépek a faiskolai palántanevelés vetési munkafolyamatához készülnek. A Da Ros önálló vetőgépeket és a munkatérhez, illetve a kívánt folyamatlépésekhez igazítható vetősorokat kínál.',
    'A gyártó választékában soronként vető és hengeres vetőgépek szerepelnek. A vetősorok modulárisan alakíthatók, és a vetést kiegészítő berendezésekkel, például tálcázó, takaró vagy öntöző egységekkel kapcsolhatók össze.',
  ]),
  image: productPhoto.id, gallery: [productPhoto.id, relatedPhoto.id], originalUrl: legacyUrl,
  sourceDetails: 'A tálcás magvetőgép megnevezése és két kapcsolódó fotó az RM Hungary korábbi kategóriaoldaláról származik. A családszintű leírást a Da Ros hivatalos vetőgép- és vetősor-kategóriaoldaláról dolgoztam át. A gyártói oldalon szereplő SEM 100 egy konkrét modell, de a helyi általános rekorddal való azonossága nem igazolt; modell-specifikus adatot, videót vagy PDF-et ezért nem kapcsoltam hozzá.',
  sourceEvidence: [
    { url: legacyUrl, note: 'A korábbi RM kategória a tálcás magvetőgépet Da Ros gyártmányként nevezi meg; innen származik a termék megnevezése és a két fotó.', media: productPhoto.id },
    { url: categoryUrl, note: 'Hivatalos családbemutató: vetőgépek, vetősorok, moduláris összeállítások és kiegészítő egységek.' },
    { url: sem100Url, note: 'A családkártyán használt SEM 100 illusztráció eredete; a helyi termék SEM 100-ként nincs azonosítva.', media: familyImage.id },
  ],
  reviewNote: 'A terméktípus és két helyi kategóriafotó egyezik az RM Hungary korábbi oldalával. A konkrét modell és modellszintű műszaki adatok nem azonosítottak; ezért nincs megadva SEM 100 specifikáció vagy videó.',
} as any })

console.log('Da Ros tálcás magvetőgép: családbemutató, kategória- és termékleírás, főfotó és galéria frissítve; konkrét modellhez nem rendeltünk bizonytalan adatot.')
await payload.destroy()
