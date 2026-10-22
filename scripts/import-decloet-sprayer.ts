import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const source = 'https://www.decloet.it/en/products/sprayer.html'
const legacy = 'https://www.rmhungary.hu/index.php?alkat=7'
const brochureUrl = 'https://www.decloet.it/pdf/depliant_sprayer_ita_eng.pdf'
const assets = [
  ['sprayer_1.jpg', 'De Cloet önjáró permetezőgép szántóföldön'],
  ['sprayer_2.jpg', 'De Cloet önjáró permetezőgép oldalnézetből'],
  ['sprayer_3.jpg', 'De Cloet önjáró permetezőgép permetezőkerettel'],
  ['sprayer_cloche.jpg', 'De Cloet permetezőgép növényvédelmi kezelőegysége'],
  ['sprayer_computer.jpg', 'De Cloet permetezőgép kezelő számítógépe'],
  ['sprayer_volante.jpg', 'De Cloet permetezőgép ventilátoros egysége'],
] as const
const media = async (url: string, file: string, alt: string) => {
  const found: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const data = { sourceUrl: url, alt, credit: 'De Cloet hivatalos permetezőgép-oldala' }
  return found ? payload.update({ collection: 'media', id: found.id, overrideAccess: true, data: data as any }) : payload.create({ collection: 'media', overrideAccess: true, data: data as any, filePath: path.join(root, file) } as any)
}
const photos: any[] = []
for (const [file, alt] of assets) photos.push(await media(`https://www.decloet.it/img/photos/sprayer/${file}`, `public/images/decloet/${file}`, alt))
const brochure: any = await media(brochureUrl, 'public/images/decloet/sprayer-brochure.pdf', 'De Cloet permetezőgép kétnyelvű gyártói katalógusa')
const get = async (collection: 'manufacturers'|'categories'|'product-families'|'products', slug: string) => (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const maker = await get('manufacturers', 'de-cloet')
const category = await get('categories', 'permetezogepek')
if (!maker || !category) throw new Error('De Cloet gyártó vagy permetező kategória nem található.')
await payload.update({ collection: 'manufacturers', id: maker.id, overrideAccess: true, data: { description: 'A De Cloet olasz mezőgazdasági gépgyártó dohánytermesztési gépeket, köztük önjáró permetezőket, palántázókat és betakarítógépeket kínál.', sourceUrl: 'https://www.decloet.it/en/products.html', reviewNote: 'A termékkör a De Cloet hivatalos termékoldalán, a permetezőgép magyarországi márkajelenléte a korábbi RM Hungary kategóriaoldalon ellenőrizve.' } as any })
const familyData: any = { name: 'De Cloet önjáró permetezők', slug: 'de-cloet-onjaro-permetezok', category: category.id, manufacturer: maker.id, summary: 'Önjáró, hidrosztatikus permetezőgépek 1500, 2000 vagy 2500 literes rozsdamentes acéltartállyal.', image: photos[0].id, sourceUrl: source, sortOrder: 20, status: 'published', sourceDetails: 'A De Cloet hivatalos oldalán szereplő Sprayer változatok; a korábbi RM Hungary oldal De Cloet és Mantovani permetezőgépeket nevez meg.', reviewNote: 'A De Cloet termék- és fotóazonosság a gyártói oldallal, a márka magyarországi kínálata a régi RM oldallal ellenőrizve.' }
let family = await get('product-families', familyData.slug)
family = family ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData }) : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData })
const rich = { root: { type: 'root', format: '', indent: 0, version: 1, children: [
  'A De Cloet önjáró Sprayer permetező 1500, 2000 vagy 2500 literes rozsdamentes acéltartállyal készül. Dohánytermesztésben és más intenzív kultúrákban, például cukorrépában, paradicsomban, szőlőben, kukoricában, búzában és burgonyában alkalmazható növényvédelmi kezelésekhez.',
  'A gép hidrosztatikus hajtású, három hajtott kerékkel és szervokormányzással. A gyártó 80–120 cm sortávolságot, 12–18 méteres permetezőkeretet és 185 liter/perc névleges adatú membránszivattyút közöl. A felszereltségben elosztásszabályozó számítógép, légkondicionált fülke és aktív szenes szűrők szerepelnek.',
  'A dohány tetejezéséhez használható egység kérésre szerelhető fel. A tartályméret szerinti motorváltozatok teljesítménye 85, 115 és 125 LE; a gyártó a pontos motoradatokat modellenként adja meg. A közúti közlekedésre vonatkozó megfelelőséget a gyártó CE és közúti jóváhagyásként jelöli.',
].map(text => ({ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } }
const productData: any = {
 name: 'De Cloet Sprayer', slug: 'de-cloet-sprayer', productKind: 'model', category: category.id, family: family.id, manufacturer: maker.id, brand: 'De Cloet', modelCode: 'Sprayer 1500 / 2000 / 2500', status: 'published', reviewState: 'ready',
 summary: 'Önjáró permetező 1500, 2000 vagy 2500 literes tartállyal és 12–18 méteres keretváltozatokkal.', description: rich,
 specifications: [
  { label: 'Tartály', value: '1500, 2000 vagy 2500 literes rozsdamentes acéltartály' },
  { label: 'Motor', value: 'John Deere, 4 hengeres, vízhűtéses; változattól függően 85, 115 vagy 125 LE' },
  { label: 'Hajtás', value: 'Hidrosztatikus, három hajtott kerékkel' },
  { label: 'Kormányzás', value: 'Szervokormány' },
  { label: 'Sortávolság', value: '80–120 cm' },
  { label: 'Munkasebesség', value: '0–13 km/h; közúti haladási sebesség 0–28 km/h' },
  { label: 'Permetezőkeret', value: '12, 14, 16 vagy 18 m' },
  { label: 'Membránszivattyú', value: '185 l/perc' },
  { label: 'Méret', value: '6,10 m hosszú, 2,45 m széles, 3,60 m magas; nyomtáv állítható' },
  { label: 'Tömeg üzemkészen', value: '1500: 3900 kg; 2000: 4500 kg; 2500: 4700 kg' },
  { label: 'Fülke és vezérlés', value: 'Elosztásszabályozó számítógép, légkondicionált fülke, aktív szenes szűrők' },
 ],
 configurations: [{ name: 'Sprayer 1500', value: '1500 literes tartály, 85 LE, 3900 kg üzemkész tömeg.', sourceUrl: source }, { name: 'Sprayer 2000', value: '2000 literes tartály, 115 LE, 4500 kg üzemkész tömeg.', sourceUrl: source }, { name: 'Sprayer 2500', value: '2500 literes tartály, 125 LE, 4700 kg üzemkész tömeg.', sourceUrl: source }, { name: 'Dohány tetejező egység', value: 'Kérésre felszerelhető kiegészítő egység.', sourceUrl: source }],
 image: photos[0].id, gallery: photos.map(p => p.id), documents: [brochure.id], originalUrl: source,
 sourceDetails: 'A termékleírás, a műszaki adatok, a fotók és a kétnyelvű katalógus a De Cloet hivatalos Sprayer oldaláról származnak. A De Cloet permetező magyarországi termékkategóriáját a korábbi RM Hungary oldal nevezi meg.',
 sourceEvidence: [{ url: source, note: 'Hivatalos termékadatlap: változatok, leírás, műszaki adatok és termékfotók.', media: photos[0].id }, { url: brochureUrl, note: 'Hivatalos kétnyelvű permetezőgép-katalógus.', media: brochure.id }, { url: legacy, note: 'Korábbi RM Hungary kategória: De Cloet és Mantovani permetezőgépek.' }], reviewNote: 'A gyártói Sprayer oldal több tartályváltozatot egy termékcsalád alatt közöl; a specifikációk és konfigurációk változatonként elkülönítve szerepelnek.'
}
const existing = await get('products', productData.slug)
if (existing) await payload.update({ collection: 'products', id: existing.id, overrideAccess: true, data: productData })
else await payload.create({ collection: 'products', overrideAccess: true, data: productData })
console.log(`De Cloet Sprayer: család, 3 tartályváltozat, ${photos.length} fotó és katalógus.`)
await payload.destroy()
