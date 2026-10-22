import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const manufacturer: any = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'rovatti' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: 'kistermeloi-szivattyuk' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'midi-szivattyu' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!manufacturer || !category || !product) throw new Error('A Rovatti gyártó, kistermelői kategória vagy Midy termék nem található.')

const imageUrl = 'https://www.rovatti.it/upload/blocchi/MIDY-CENT-1-1179.JPG'
const pdfUrl = 'https://www.rovatti.it/pdf/T0A.pdf'
const upsertMedia = async (sourceUrl: string, file: string, data: Record<string, unknown>) => {
  const existing: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  return existing
    ? payload.update({ collection: 'media', id: existing.id, overrideAccess: true, data: data as any })
    : payload.create({ collection: 'media', overrideAccess: true, data: data as any, filePath: path.join(root, file) } as any)
}
const image: any = await upsertMedia(imageUrl, 'public/images/rovatti/midy-pump.jpg', {
  alt: 'Rovatti Midy szivattyú traktoros öntözési alkalmazásban', sourceUrl: imageUrl, credit: 'Rovatti Pompe hivatalos termékoldala',
})
const pdf: any = await upsertMedia(pdfUrl, 'public/images/rovatti/T0A.pdf', {
  alt: 'Rovatti T0 szivattyúcsalád műszaki katalógusa', sourceUrl: pdfUrl, credit: 'Rovatti Pompe hivatalos műszaki katalógusa',
})

const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map(text => ({
  type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
  children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
})) } })
const categoryUrl = 'https://www.rovatti.it/prodotti/pompe-di-superficie/1240/pompe-con-moltiplicatore-di-ridotte-dimensioni'
const sourceEvidence = [
  { url: categoryUrl, note: 'Hivatalos Rovatti termékcsalád-oldal: kompakt szivattyúk kardánhajtású vagy közvetlen traktor-TLT csatlakozású kivitelben; T0-50 és T0F-50 modellek, családszintű maximális teljesítményadatok.', media: image.id },
  { url: pdfUrl, note: 'A Rovatti T0 műszaki katalógusa a T0-50/T0F-50 jelöléseket, hajtásmódot és teljesítménygörbéket közli; a dokumentumban önfelszívó A-változatok is szerepelnek.', media: pdf.id },
]
const familySlug = 'rovatti-midy'
const familyData = {
  name: 'Rovatti Midy szivattyúk', slug: familySlug, category: category.id, manufacturer: manufacturer.id, sortOrder: 10,
  summary: 'Kompakt Rovatti szivattyúk traktoros kardánhajtású vagy közvetlen TLT-csatlakozású kivitelben.',
  image: image.id, cardTitle: 'Midy', cardDescription: 'Kompakt, traktoros hajtású szivattyúk öntözéshez és folyadékszállításhoz.',
  sourceDetails: 'A magyar családbemutató a Rovatti hivatalos T0-50/T0F-50 termékoldala és műszaki katalógusa alapján készült.',
  sourceUrl: categoryUrl, reviewNote: 'A gyártói termékoldal főképe MIDY-CENT néven szerepel; az adatlap T0-50 és T0F-50 modelleket nevez meg.', status: 'published',
}
let family: any = (await payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
family = family
  ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData as any })
  : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })

await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
  name: 'Rovatti Midy szivattyú',
  family: family.id, manufacturer: manufacturer.id, brand: 'Rovatti',
  status: 'published', reviewState: 'ready', reviewNote: 'A korábbi RM kategória „midi szivattyú” megnevezését a Rovatti hivatalos MIDY képével és T0-50/T0F-50 műszaki adatlapjával egyeztettem.',
  summary: 'Kompakt, traktoros Rovatti szivattyú kardántengelyes vagy közvetlen TLT-hajtású kivitelben.',
  cardDescription: 'Kompakt szivattyú traktoros kardánhajtással vagy közvetlen TLT-csatlakozással.',
  description: richText([
    'A Rovatti Midy kompakt, könnyű, hajtóműves centrifugálszivattyú-család. A tengelyirányú szívócsonkhoz csigaházas nyomóoldal csatlakozik.',
    'A T0-50 kardántengelyről hajtható. A T0F-50 változat közvetlenül a traktor teljesítményleadó tengelyére csatlakozik. A gyártói katalógus külön önfelszívó A-változatokat is felsorol.',
    'A gyártó öntözési, permetezési, folyadékátviteli, valamint tartály- és ciszternafeltöltési feladatokat nevez meg.',
    'A sorozat közölt felső értékei: legfeljebb 33 m³/óra térfogatáram, 50 m emelőmagasság és 9,2 HP teljesítmény. Ezek a termékcsalád katalógusértékei; az adott szivattyú munkapontját a gyártói görbe alapján kell kiválasztani.',
  ]),
  specifications: [
    { label: 'Szivattyútípus', value: 'Kompakt, egyfokozatú centrifugálszivattyú hajtóművel; axiális szívóoldallal és csigaházas nyomóoldallal.' },
    { label: 'Család maximális térfogatárama', value: '33 m³/óra' },
    { label: 'Család maximális emelőmagassága', value: '50 m' },
    { label: 'Család maximális teljesítménye', value: '9,2 HP' },
  ],
  configurations: [
    { name: 'T0-50', value: 'Kardántengelyes hajtás; 50 mm névleges szívócsonk.' , sourceUrl: pdfUrl },
    { name: 'T0F-50', value: 'Közvetlen traktor-TLT csatlakozás; 50 mm névleges szívócsonk.', sourceUrl: pdfUrl },
  ],
  image: image.id, cardImage: image.id, gallery: [image.id], documents: [pdf.id],
  sourceDetails: 'A termékleírás és konfigurációk a Rovatti hivatalos T0-50/T0F-50 oldalából és T0 műszaki katalógusából készültek. A közölt teljesítmények a gyártói sorozat felső értékei, nem egyedi munkapontok.',
  sourceEvidence, originalUrl: categoryUrl,
} as any })
console.log(JSON.stringify({ family: family.name, product: 'Rovatti Midy szivattyú', image: image.filename, imageSize: `${image.width}×${image.height}`, pdf: pdf.filename }, null, 2))
await payload.destroy()
