import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const categorySlug = 'dohanybetakaritas'
const legacyUrl = 'https://www.rmhungary.hu/index.php?alkat=38'
const familyUrl = 'https://www.decloet.it/en/products.html'
const modelSource = {
  oneRow: 'https://www.decloet.it/en/products/1_row_harvester.html',
  oneTwoRows: 'https://www.decloet.it/en/products/1-2_rows_harvester.html',
  apical: 'https://www.decloet.it/en/products/apical.html',
}
const imageBase = 'https://www.decloet.it/img/photos'
const harvesterBrochureUrl = 'https://www.decloet.it/pdf/depliant_raccoglitrice_ita.pdf'
const brochureUrl = 'https://www.decloet.it/pdf/depliant_2TTH_eng.pdf'
const assets = [
  { file: '2th2_1.jpg', model: '2TH-II', relative: '2TH-II/raccoglitrice_2TH-II_1.jpg', alt: 'De Cloet 2TH-II kétsoros dohánybetakarító gép oldalnézetből' },
  { file: '2th2_2.jpg', model: '2TH-II', relative: '2TH-II/raccoglitrice_2TH-II_2.jpg', alt: 'De Cloet 2TH-II dohánybetakarító gép hátulnézetből' },
  { file: '2th2_3.jpg', model: '2TH-II', relative: '2TH-II/raccoglitrice_2TH-II_3.jpg', alt: 'De Cloet 2TH-II dohánybetakarító gép elölnézetből' },
  { file: '2th2_harvest.jpg', model: '2TH-II', relative: '2TH-II/raccoglitrice_2TH-II_raccolta.jpg', alt: 'De Cloet 2TH-II betakarítás közben' },
  { file: '2th2_assembly_1.jpg', model: '2TH-II', relative: '2TH-II/raccoglitrice_2TH-II_assemblaggio_1.jpg', alt: 'De Cloet dohánybetakarító összeszerelése' },
  { file: '2th2_assembly_2.jpg', model: '2TH-II', relative: '2TH-II/raccoglitrice_2TH-II_assemblaggio_2.jpg', alt: 'De Cloet dohánybetakarító összeszerelési részlete' },
  { file: '1th4_1.jpg', model: '1TH4', relative: '1TH4/raccoglitrice_1th4.jpg', alt: 'De Cloet 1TH4 egysoros dohánybetakarító gép' },
  { file: '1th4_2.jpg', model: '1TH4', relative: '1TH4/raccoglitrice_1th4_2.jpg', alt: 'De Cloet 1TH4 dohánybetakarító gép oldalnézetből' },
  { file: '1th4_3.jpg', model: '1TH4', relative: '1TH4/raccoglitrice_1th4_3.jpg', alt: 'De Cloet 1TH4 dohánybetakarító gép munkaegysége' },
  { file: '2tth_1.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_1.jpg', alt: 'De Cloet 2TTH kétsoros, apicalis dohánybetakarító gép' },
  { file: '2tth_2.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_2.jpg', alt: 'De Cloet 2TTH dohánybetakarító gép oldalnézetből' },
  { file: '2tth_3.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_3.jpg', alt: 'De Cloet 2TTH dohánybetakarító gép elölnézetből' },
  { file: '2tth_4.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_4.jpg', alt: 'De Cloet 2TTH betakarítóegység részlete' },
  { file: '2tth_harvest_1.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_raccolta_1.jpg', alt: 'De Cloet 2TTH dohánybetakarítás közben' },
  { file: '2tth_harvest_2.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_raccolta_2.jpg', alt: 'De Cloet 2TTH dohánybetakarítás közben' },
  { file: '2tth_unload.jpg', model: '2TTH', relative: '2TTH/apicale_2TTH_scarico.jpg', alt: 'A De Cloet 2TTH betakarítógép terményürítése' },
] as const

const specs = (rows: Array<[string, string]>) => rows.map(([label, value]) => ({ label, value }))
const simpleRichText = (paragraphs: readonly string[], link?: { label: string; url: string }) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: [
      ...paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })),
      ...(link ? [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'link', fields: { url: link.url, newTab: true, linkType: 'custom' }, format: '', indent: 0, version: 1, children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: link.label, version: 1 }] }] }] : []),
    ],
  },
})

const definitions = [
  {
    model: '1TH-I', slug: 'de-cloet-1th-i', sortOrder: 10, status: 'draft', showInFamily: false,
    source: modelSource.oneTwoRows, summary: 'Egysoros, háromkerekű dohánybetakarító gép.',
    description: ['A De Cloet 1TH-I egysoros, háromkerekű, hidrosztatikus hajtású dohánybetakarító. A gyártó leírása szerint a gumiból készült, spirális leválasztóhengerek kíméletesen távolítják el az alsó és középső leveleket; a levelek szállítószalagon jutnak a konténerbe vagy utánfutóra.', 'A gyártó 85 LE-s John Deere motort, 112–122 cm sortávolságot, 0–10 km/h munkasebességet és 0–22 km/h haladási sebességet közöl. A terméket az adatlap és a táblázat azonosítja, de külön 1TH-I termékfotót nem találtam; ezért ez a rekord piszkozat, és nem jelenik meg üres vagy más modell képével a családkártyák között.'],
    specifications: specs([['Kialakítás', '3 kerék / 1 sor'], ['Motor', 'John Deere 4045, 4 hengeres, vízhűtéses'], ['Teljesítmény', '85 LE'], ['Hajtás', 'Hidrosztatikus, 3 hajtott kerékkel'], ['Sortávolság', '112–122 cm'], ['Munkasebesség', '0–10 km/h'], ['Haladási sebesség', '0–22 km/h'], ['Első gumiabroncs', '12.5/80–18 10 PR'], ['Hátsó gumiabroncs', '13.6–24 6 PR'], ['Hossz × szélesség × magasság', '6,80 × 2,54 × 3,86 m'], ['Tengelytáv', '3,40 m'], ['Nyomtáv', 'Állítható'], ['Tömeg menetkészen', '4500 kg']]),
    imageFiles: [] as string[], videos: [], reviewState: 'identified', reviewNote: 'A gyártói adatlap és a közös műszaki táblázat azonosítja a modellt és specifikációit. A külön 1TH-I fotó és a helyi modellhez kötés nincs megerősítve; a termék piszkozatban marad.',
  },
  {
    model: '1TH4', slug: 'de-cloet-1th4', sortOrder: 20, status: 'published', showInFamily: true,
    source: modelSource.oneRow, summary: 'Egysoros dohánybetakarító négy hajtott kerékkel.',
    description: ['A De Cloet 1TH4 egysoros dohánybetakarító négy hajtott kerékkel és hidrosztatikus hajtással. A gyártó a gumiból készült, spirális leválasztóhengereket az alsó és középső levelekhez, a késes egységet az apicalis levelek betakarításához ismerteti.', 'A leveleket szállítószalag juttatja a konténerbe vagy utánfutóra; a ventilátorok egyenletesen terítik szét őket.'],
    specifications: specs([['Kialakítás', '4 kerék / 1 sor'], ['Motor', 'Perkins 804 C33, 4 hengeres, vízhűtéses'], ['Teljesítmény', '63 LE'], ['Hajtás', 'Hidrosztatikus, 4 hajtott kerékkel és 2 független hidraulikaszivattyúval'], ['Munkasebesség', '0–10 km/h'], ['Haladási sebesség', '0–22 km/h'], ['Első gumiabroncs', '280/70 R16'], ['Hátsó gumiabroncs', '12.5/80–18 10 PR'], ['Hossz × szélesség × magasság', '5,20 × 2,10 × 3,10 m'], ['Tengelytáv', '3,00 m'], ['Nyomtáv', 'Állítható'], ['Tömeg menetkészen', '4500 kg']]),
    imageFiles: ['1th4_1.jpg', '1th4_2.jpg', '1th4_3.jpg'], videos: [], reviewState: 'ready', reviewNote: 'A termék neve, képei és modellspecifikációi a De Cloet hivatalos 1TH4 adatlapjáról és három gyártói fotóról származnak.', brochureUrl: harvesterBrochureUrl,
  },
  {
    model: '2TH-II', slug: 'de-cloet-2th-ii', sortOrder: 30, status: 'published', showInFamily: true,
    source: modelSource.oneTwoRows, summary: 'Kétsoros, háromkerekű, hidrosztatikus dohánybetakarító.',
    description: ['A De Cloet 2TH-II kétsoros, háromkerekű, hidrosztatikus dohánybetakarító. A gyártó kiegészítő behúzóhengert és elektrohidraulikus arányos vezérlést ismertet, amely a gép haladását a leválasztóhengerek és a kések mozgásához hangolja.', 'A gumiból készült, spirális leválasztóhengerek az alsó és középső levelekhez, a kések az apicalis levelekhez használhatók. A leszedett levelek szállítószalagon jutnak a konténerbe vagy utánfutóra; a ventilátorok nedves leveleknél is egyenletes elosztást segítenek.'],
    specifications: specs([['Kialakítás', '3 kerék / 2 sor'], ['Motor', 'John Deere 4045, 4 hengeres, vízhűtéses'], ['Hajtás', 'Hidrosztatikus, 3 hajtott kerékkel'], ['Sortávolság', '112–122 cm'], ['Munkasebesség', '0–10 km/h'], ['Haladási sebesség', '0–22 km/h'], ['Első gumiabroncs', '12.5/80–18 10 PR'], ['Hátsó gumiabroncs', '13.6–24 6 PR'], ['Hossz × szélesség × magasság', '6,80 × 3,14 × 3,86 m'], ['Tengelytáv', '3,40 m'], ['Nyomtáv', 'Állítható'], ['Tömeg menetkészen', '5900 kg']]),
    imageFiles: ['2th2_1.jpg', '2th2_2.jpg', '2th2_3.jpg', '2th2_harvest.jpg', '2th2_assembly_1.jpg', '2th2_assembly_2.jpg'], videos: [{ title: 'De Cloet dohánybetakarító gép – gyártói videó', url: 'https://www.youtube.com/watch?v=WrLMXnfLh0E' }], reviewState: 'ready', reviewNote: 'A termék neve, képei, leírása és táblázatos adatai a De Cloet hivatalos 1-2 Rows adatlapjáról származnak. A gyártó a teljesítményadatot 85–115 LE tartományként közli, nem rendeli egyértelműen a 2TH-II-höz, ezért azt itt nem tüntettem fel.',
    brochureUrl: harvesterBrochureUrl,
  },
  {
    model: '2TTH', slug: 'de-cloet-2tth', sortOrder: 40, status: 'published', showInFamily: true,
    source: modelSource.apical, summary: 'Kétsoros, háromkerekű, apicalis dohánybetakarító gép.',
    description: ['A De Cloet 2TTH apicalis dohánybetakarító gép három hidrosztatikusan hajtott kerékkel és kétsoros kialakítással készül. A gyártó 115 LE-s John Deere turbódízel-motort és 4500 cm³ lökettérfogatot közöl; a brosúra 126 LE-s Iveco motorváltozatot is megemlít.', 'A gép szállítószalagja kíméletesen továbbítja a leveleket a konténerbe. A felszereltség része a hidraulikusan állítható, hosszú acél késsor, a két tárcsás hidraulikus szártörő, a nagy ürítőtartály és a kezelőszervek melletti fedélzeti kijelző. A vezetőfülke légkondicionálója választható.', 'A gyártó a közúti közlekedést kísérő járművel és CE-jelölést említ.'],
    specifications: specs([['Kialakítás', '3 kerék / 2 sor'], ['Motor', 'John Deere turbódízel, intercoolerrel; a brosúra 126 LE-s Iveco változatot is felsorol'], ['Teljesítmény', '115 LE (John Deere); 126 LE (Iveco brosúraváltozat)'], ['Lökettérfogat', '4500 cm³ (John Deere változat)'], ['Hajtás', 'Hidrosztatikus, 3 hajtott kerékkel'], ['Munkasebesség', '0–24 km/h'], ['Első gumiabroncs', '400/70 R18'], ['Hátsó gumiabroncs', '440/65 R24'], ['Hossz × szélesség × magasság', '6,80 × 2,90 × 3,30 m'], ['Fordulókör', '3,20 m'], ['Ürítési magasság', 'Legfeljebb 3,5 m']]),
    imageFiles: ['2tth_1.jpg', '2tth_2.jpg', '2tth_3.jpg', '2tth_4.jpg', '2tth_harvest_1.jpg', '2tth_harvest_2.jpg', '2tth_unload.jpg'], videos: [{ title: 'De Cloet 2TTH apicalis dohánybetakarító – gyártói videó', url: 'https://www.youtube.com/watch?v=oh12HHukEKU' }], reviewState: 'ready', reviewNote: 'A termékadatok a gyártói 2TTH adatlapról és a kétnyelvű gyártói brosúráról származnak. A brosúra az Iveco opciót közli, de annak műszaki konfigurációja nincs részletezve.',
    brochureUrl,
  },
] as const

const maker = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'de-cloet' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const category = (await payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!maker || !category) throw new Error('A De Cloet gyártó vagy a dohánytörő-kombájn kategória nem található.')

const mediaByFile = new Map<string, any>()
for (const asset of assets) {
  const sourceUrl = `${imageBase}/${asset.relative}`
  const found = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const data = { alt: asset.alt, sourceUrl, credit: 'De Cloet hivatalos gyártói oldala' }
  if (apply) mediaByFile.set(asset.file, found ? await payload.update({ collection: 'media', id: found.id, overrideAccess: true, data: data as any }) : await payload.create({ collection: 'media', overrideAccess: true, data: data as any, filePath: path.join(root, 'public/images/decloet/tobacco-harvesters', asset.file) } as any))
  else mediaByFile.set(asset.file, found || { id: `preview:${asset.file}` })
}

const brochureDefinitions = [
  { url: harvesterBrochureUrl, file: 'decloet-harvesters-ita.pdf', alt: 'De Cloet dohánybetakarító gépek hivatalos katalógusa (olasz nyelven)', credit: 'De Cloet hivatalos gyártói brosúra' },
  { url: brochureUrl, file: 'decloet-2tth-eng.pdf', alt: 'De Cloet 2TTH apicalis dohánybetakarító hivatalos katalógusa (angol nyelven)', credit: 'De Cloet hivatalos gyártói brosúra' },
] as const
const brochureByUrl = new Map<string, any>()
for (const brochureDef of brochureDefinitions) {
  const existing = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: brochureDef.url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (apply) {
    const metadata = { alt: brochureDef.alt, sourceUrl: brochureDef.url, credit: brochureDef.credit }
    const media = existing
      ? await payload.update({ collection: 'media', id: existing.id, overrideAccess: true, data: metadata as any })
      : await payload.create({ collection: 'media', overrideAccess: true, data: metadata as any, filePath: path.join(root, 'public/documents/decloet', brochureDef.file) } as any)
    brochureByUrl.set(brochureDef.url, media)
  } else brochureByUrl.set(brochureDef.url, existing || { id: `preview:${brochureDef.file}` })
}

const familySlug = 'de-cloet-dohanybetakaritok'
const familyExisting = (await payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const familyImage = mediaByFile.get('2th2_1.jpg')
const familyData = {
  name: 'De Cloet dohánybetakarító gépek', slug: familySlug, category: category.id, manufacturer: maker.id,
  summary: 'Egysoros és kétsoros, hidrosztatikus dohánybetakarítók különböző leválasztó- és továbbítórendszerekkel.',
  image: familyImage.id, sourceUrl: familyUrl, sortOrder: 30, status: 'published',
  sourceDetails: 'A De Cloet hivatalos 1 Row, 1-2 Rows és Apical oldalai; a magyarországi márkakategóriát a korábbi RM Hungary dohánytörő-kombájn oldala nevezi meg.',
  reviewNote: 'A modellfotók a gyártói oldalakról származnak. Az 1TH-I modellrekord külön fotó hiányában piszkozatban marad.',
  overviewTitle: 'Egysoros és kétsoros dohánybetakarítók',
  overviewIntro: 'A De Cloet dohánybetakarító gépei hidrosztatikus hajtással, a betakarítási feladathoz igazított sor- és kerékkialakítással készülnek. A modellek a levelek leválasztását, továbbítását és konténerbe vagy utánfutóra juttatását végzik.',
  overviewSections: [
    { heading: '1TH4 – egysoros betakarítás négy hajtott kerékkel', body: 'Az 1TH4 egysoros kivitelű, négy hajtott kerékkel és két független hidraulikaszivattyúval. A gyártó az alsó és középső levelek spirális leválasztóhengereit, valamint az apicalis levelekhez használható késes egységet ismerteti.', image: mediaByFile.get('1th4_1.jpg').id, imageAlt: 'De Cloet 1TH4 egysoros dohánybetakarító' },
    { heading: '2TH-II – kétsoros betakarítás három kerékkel', body: 'A 2TH-II háromkerekű, kétsoros gép. Elektrohidraulikus arányos vezérlése a haladást a leválasztóhengerek és a kések mozgásához hangolja; a betakarított levelek szállítószalagon jutnak a gyűjtőegységhez.', image: mediaByFile.get('2th2_1.jpg').id, imageAlt: 'De Cloet 2TH-II kétsoros dohánybetakarító' },
    { heading: '2TTH – apicalis kétsoros betakarítás', body: 'A 2TTH három hidrosztatikusan hajtott kerékkel dolgozik. A gyártó hidraulikusan állítható késsort, szártörő egységet, nagy ürítőtartályt és a kezelőszervek melletti fedélzeti kijelzőt mutat be.', image: mediaByFile.get('2tth_1.jpg').id, imageAlt: 'De Cloet 2TTH apicalis dohánybetakarító' },
  ],
}
let family: any = familyExisting
if (apply) family = familyExisting ? await payload.update({ collection: 'product-families', id: familyExisting.id, overrideAccess: true, data: familyData as any }) : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })
else family = familyExisting || { id: 'preview:family' }

for (const item of definitions) {
  const photos = item.imageFiles.map((file) => mediaByFile.get(file)).filter(Boolean)
  const main = photos[0]
  const source = item.model === '1TH4' ? modelSource.oneRow : item.model === '2TTH' ? modelSource.apical : modelSource.oneTwoRows
  const previous = (await payload.find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const sourceEvidence: any[] = [
    { url: source, note: `A De Cloet ${item.model} gyártói modelloldala.` },
    ...item.imageFiles.map((file) => {
      const asset = assets.find((entry) => entry.file === file)!
      return { url: `${imageBase}/${asset.relative}`, note: `A De Cloet ${item.model} hivatalos termékfotója.`, media: mediaByFile.get(file).id }
    }),
    { url: legacyUrl, note: 'A korábbi RM Hungary dohánytörő-kombájn kategóriája De Cloet gépeket nevez meg.' },
  ]
  if ('brochureUrl' in item) sourceEvidence.push({ url: item.brochureUrl, note: item.model === '2TTH' ? 'A De Cloet hivatalos 2TTH brosúrája.' : 'A De Cloet dohánybetakarító gépeinek hivatalos brosúrája.' })
  const productData: any = {
    name: `De Cloet ${item.model}`, slug: item.slug, modelCode: item.model, productKind: 'model', sortOrder: item.sortOrder,
    showInFamily: item.showInFamily, category: category.id, family: family.id, manufacturer: maker.id, brand: 'De Cloet',
    status: item.status, reviewState: item.reviewState, reviewNote: item.reviewNote,
    summary: item.summary, cardDescription: item.summary, description: simpleRichText(item.description, 'brochureUrl' in item ? { label: item.model === '2TTH' ? 'De Cloet 2TTH gyártói brosúra (PDF)' : 'De Cloet dohánybetakarító gépek gyártói brosúrája (PDF)', url: item.brochureUrl } : undefined),
    specifications: item.specifications, image: main?.id, cardImage: main?.id, gallery: photos.map((photo) => photo.id),
    videos: item.videos, originalUrl: source, sourceDetails: `A leírás, a műszaki adatok, a videó és a modellfotók a De Cloet hivatalos ${item.model} termékoldaláról származnak.`, sourceEvidence,
  }
  if ('brochureUrl' in item) {
    const brochureMedia = brochureByUrl.get(item.brochureUrl)
    if (brochureMedia?.id) productData.documents = [brochureMedia.id]
  }
  if (apply) {
    const saved = previous
      ? await payload.update({ collection: 'products', id: previous.id, overrideAccess: true, data: productData })
      : await payload.create({ collection: 'products', overrideAccess: true, data: productData })
    console.log(`${item.status === 'published' ? 'Frissítve' : 'Piszkozat'}: ${item.model} (${saved.id}); ${photos.length} fotó; ${item.videos.length} videó.`)
  } else console.log(`Előnézet: ${item.model}; ${photos.length} fotó; ${item.videos.length} videó; állapot=${item.status}; meglévő=${Boolean(previous)}`)
}

console.log(`${apply ? 'Alkalmazás kész.' : 'Előnézet kész; adatbázis-módosítás nem történt. Alkalmazás: -- --apply'}`)
await payload.destroy()
