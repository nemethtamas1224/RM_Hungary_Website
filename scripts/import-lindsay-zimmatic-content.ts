import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const src9500 = 'https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots/9500p-center-pivot'
const src8500 = 'https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots/8500p-center-pivot'
const src7500 = 'https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots/7500p-center-pivot'
const srcGuide = 'https://www.lindsay.com/uploads/files/resources/317-Zimmatic_Product_Guide_US_Web_Final_1123.pdf'
const srcOmegaManual = 'https://hydro-air.de/wp-content/uploads/2023/02/Bedienungsaleitung-OMEGA2v3_GER-NEU-komprimiert.pdf'
const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })

async function media(sourceUrl: string, file: string, alt: string, credit: string) {
  let item: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!item) item = await payload.create({ collection: 'media', overrideAccess: true, data: { alt, sourceUrl, credit }, filePath: path.join(root, file) } as any)
  return item
}
const photo9500 = await media('https://www.lindsay.com/usca/en/filesimages/Irrigation/9500P/05_9500P.jpg', 'public/images/lindsay/zimmatic-9500p.jpg', 'Zimmatic 9500P körforgó öntözőrendszer kukoricatáblán', 'Lindsay hivatalos termékoldala')
const photos8500 = await Promise.all([
  media('https://www.lindsay.com/usca/en/filesimages/Irrigation/8500P/01_8500P.jpg', 'public/images/lindsay/8500p-01.jpg', 'Zimmatic 8500P körforgó öntözőrendszer szántóföldön', 'Lindsay hivatalos termékoldala'),
  media('https://www.lindsay.com/usca/en/filesimages/Irrigation/8500P/02_8500P.jpg', 'public/images/lindsay/8500p-02.jpg', 'Zimmatic 8500P öntözőrendszer működés közben', 'Lindsay hivatalos termékoldala'),
  media('https://www.lindsay.com/usca/en/filesimages/Irrigation/8500P/05_8500P.jpg', 'public/images/lindsay/8500p-05.jpg', 'Zimmatic 8500P körforgó öntözőrendszer növényállományban', 'Lindsay hivatalos termékoldala'),
])
const photos7500 = await Promise.all([
  media('https://www.lindsay.com/usca/en/filesimages/Irrigation/7500P/Zimmatic%207500P_1200x730.jpg', 'public/images/lindsay/7500p-main.jpg', 'Zimmatic 7500P kis táblákhoz kialakított körforgó öntözőrendszer', 'Lindsay hivatalos termékoldala'),
  media('https://www.lindsay.com/usca/en/filesimages/Irrigation/7500P/Zimmatic%207500P_1200x730_2.jpg', 'public/images/lindsay/7500p-02.jpg', 'Zimmatic 7500P öntözőrendszer részlete szántóföldön', 'Lindsay hivatalos termékoldala'),
  media('https://www.lindsay.com/usca/en/filesimages/Irrigation/7500P/Zimmatic%207500P_1200x730_3.jpg', 'public/images/lindsay/7500p-03.jpg', 'Zimmatic 7500P öntözőrendszer táblán', 'Lindsay hivatalos termékoldala'),
])
const manual = await media(srcOmegaManual, 'public/images/lindsay/9510pl-omega-manual.pdf', 'Lindsay Europe OMEGA 9510PL kezelési kézikönyv', 'Lindsay Europe kézikönyv, Hydro-Air dokumentumtár')

let maker: any = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'lindsay' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!maker) maker = await payload.create({ collection: 'manufacturers', overrideAccess: true, data: { name: 'Lindsay', slug: 'lindsay', description: 'A Lindsay mezőgazdasági öntözőrendszereket gyárt Zimmatic márkanév alatt. Kínálatában körforgó, lineáris és kombinált lineáris-körforgó gépek is szerepelnek.', sourceUrl: 'https://www.lindsay.com/usca/en/irrigation/', reviewNote: 'A Zimmatic 9500P és az OMEGA 9510PL gyártói azonosítása Lindsay, illetve Lindsay Europe dokumentáció alapján ellenőrizve.', status: 'published' } as any })

const families = [
  { slug: 'lindsay-zimmatic-center-pivot', name: 'Zimmatic körforgó öntözőrendszerek', categorySlug: 'korforgo', sourceUrl: 'https://www.lindsay.com/usca/en/irrigation/zimmatic/pivots-and-laterals/center-pivots', image: photo9500, summary: 'A 7500P, 8500P és 9500P modellek eltérő táblaméretekhez és műszaki igényekhez kínálnak körforgó öntözési megoldást.' },
  { slug: 'lindsay-omega-linearis', name: 'Lindsay Europe OMEGA lineáris-körforgó rendszer', categorySlug: 'linearis', sourceUrl: srcOmegaManual, image: (await payload.find({ collection: 'media', where: { id: { equals: 14 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0], summary: 'Az OMEGA 9510PL lineáris és körforgó módban is működtethető, kombinált öntözőgép.' },
]
const familyRecords: Record<string, any> = {}
for (const familyData of families) {
  const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: familyData.categorySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  let family: any = (await payload.find({ collection: 'product-families', where: { slug: { equals: familyData.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const isCenterPivot = familyData.slug === 'lindsay-zimmatic-center-pivot'
  const data: any = {
    name: familyData.name, slug: familyData.slug, category: category?.id, manufacturer: maker.id,
    summary: familyData.summary, cardDescription: isCenterPivot ? 'Körforgó rendszerek kisebb és nagyobb táblákhoz.' : undefined,
    overviewTitle: isCenterPivot ? 'Körforgó öntözés a tábla méretéhez igazítva' : undefined,
    overviewIntro: isCenterPivot ? 'A Zimmatic 7500P, 8500P és 9500P rendszerek különböző méretű táblákhoz és műszaki igényekhez kínálnak központi forgáspont körül működő öntözési megoldást.' : undefined,
    overviewSections: isCenterPivot ? [
      { heading: 'Választható gépcsaládok', body: 'A 7500P kompakt kialakítású, kisebb táblákhoz; a 8500P rugalmasan konfigurálható középkategóriás rendszer; a 9500P pedig nagy fesztávokra és igényesebb terepviszonyokra készült. A megfelelő konfigurációt a tábla, a növénykultúra és a vízellátás alapján kell meghatározni.' },
      { heading: 'Tervezés és vezérlés', body: 'A toronymagasság, a fesztávok, a szórófejek és a vezérlés a helyszíni adottságok szerint választhatók. A gyártó a Zimmatic rendszerekhez precíziós vezérlési és távfelügyeleti megoldásokat is kínál.' },
    ] : undefined,
    sourceUrl: familyData.sourceUrl,
    sourceDetails: 'A Zimmatic körforgó termékcsalád leírása a Lindsay hivatalos center pivot oldalán szereplő modellkínálat alapján készült. Az OMEGA család adatai a Lindsay Europe kézikönyvéhez kapcsolódnak.',
    reviewNote: 'A gyártói család- és képadatok egyeztetve; a forrásoldali URL-ek adminisztratív mezőben rögzítve.',
    image: familyData.image?.id, status: 'published'
  }
  family = family ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data } as any) : await payload.create({ collection: 'product-families', overrideAccess: true, data } as any)
  familyRecords[familyData.slug] = { family, categoryId: category?.id }
}

const pivotFamily = familyRecords['lindsay-zimmatic-center-pivot']
const centerPivotModels = [
  {
    slug: 'lindsay-zimmatic-7500p', name: 'Zimmatic 7500P', code: '7500P', sourceUrl: src7500, photos: photos7500,
    summary: 'Kompakt körforgó öntözőrendszer kisebb, legfeljebb 60 acre-es táblákhoz.',
    paragraphs: [
      'A Zimmatic 7500P-t a gyártó kisebb táblák körforgó öntözéséhez alakította ki. Kompakt központi forgáspontja segít mérsékelni a gép által elfoglalt területet, miközben automatizált vízkijuttatást biztosít.',
      'A Lindsay termékoldala legfeljebb 60 acre-es (kb. 24 hektáros) területhez ajánlja a modellt. A 10,5 láb (kb. 3,2 m) növényállományi szabadmagasság többféle kultúrához teszi konfigurálhatóvá.',
      'A gyártó ismertetése 4,5 hüvelykes csővezetéket és 5 hüvelykes központi forgáspontot ad meg. A pontos kialakítást, fesztávot, szórófej-kiosztást és vezérlést az adott tábla adottságai szerint kell meghatározni.',
    ],
    specifications: [
      { label: 'Rendszertípus', value: 'Körforgó öntözőrendszer' },
      { label: 'Ajánlott táblaméret', value: 'Legfeljebb 60 acre (kb. 24 ha), a gyártói leírás szerint' },
      { label: 'Fővezeték átmérője', value: '4,5 hüvelyk' },
      { label: 'Központi forgáspont átmérője', value: '5 hüvelyk' },
      { label: 'Növényállományi szabadmagasság', value: '10,5 láb (kb. 3,2 m)' },
    ],
  },
  {
    slug: 'lindsay-zimmatic-8500p', name: 'Zimmatic 8500P', code: '8500P', sourceUrl: src8500, photos: photos8500,
    summary: 'Rugalmasan konfigurálható, 12-es gauge fővezetékkel készülő körforgó rendszer.',
    paragraphs: [
      'A Zimmatic 8500P a gyártó értékorientált, tartós körforgó öntözőrendszere. Kialakítása többféle üzemeltetési igényhez igazítható, és számos meglévő központi forgáspont-alaphoz illeszthető.',
      'A 12-es gauge fővezeték és a rácsos tartószerkezet a gyártói leírás szerint a terhelés egyenletes elosztását szolgálja. A modellhez standard, közepes és magas szabadmagasságú toronyváltozatok választhatók.',
      'A Zimmatic 8500P 9500CC saroköntöző rendszerrel is kompatibilis. A helyszínhez illő fesztávot, vezérlést és kiegészítő technológiákat a teljes rendszer tervezésekor kell kiválasztani.',
    ],
    specifications: [
      { label: 'Rendszertípus', value: 'Körforgó öntözőrendszer' },
      { label: 'Fővezeték', value: '12-es gauge' },
      { label: 'Szabadmagasság-változatok', value: 'Standard, közepes és magas' },
      { label: 'Saroköntöző kompatibilitás', value: 'Zimmatic 9500CC' },
      { label: 'Maximális lejtés', value: '30%, a Lindsay termékútmutató szerint' },
    ],
  },
]
for (const model of centerPivotModels) {
  const existing: any = (await payload.find({ collection: 'products', where: { slug: { equals: model.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const gallery = model.photos.map((photo: any) => photo.id)
  const data: any = {
    name: model.name, slug: model.slug, modelCode: model.code, productKind: 'model', manufacturer: maker.id, brand: 'Lindsay / Zimmatic',
    category: pivotFamily.categoryId, family: pivotFamily.family.id, sortOrder: Number(model.code.slice(0, 4)), status: 'published',
    summary: model.summary, description: richText(model.paragraphs), specifications: model.specifications,
    image: gallery[0], gallery, originalUrl: model.sourceUrl,
    sourceDetails: 'A modellnév és a képek a Lindsay hivatalos Zimmatic termékoldaláról származnak. A leírás és az adatok a termékoldal, illetve a Lindsay Zimmatic termékútmutató alapján készültek.',
    sourceEvidence: [{ url: model.sourceUrl, note: 'Hivatalos Zimmatic termékoldal: modellleírás, főfotó és galériaképek.', media: gallery[0] }, { url: srcGuide, note: 'Lindsay Zimmatic termékútmutató: gépcsaládok és műszaki összehasonlító adatok.' }],
    reviewState: 'ready', reviewNote: 'A 7500P/8500P modellazonosság a korábbi RM Hungary öntözőrendszer-oldal képeiből, a modellszintű tartalom a Lindsay hivatalos oldalairól és termékútmutatójából ellenőrizve. Az itt megadott adatok konfigurációtól függhetnek.',
  }
  if (existing) await payload.update({ collection: 'products', id: existing.id, overrideAccess: true, data } as any)
  else await payload.create({ collection: 'products', overrideAccess: true, data } as any)
}

const product9500: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'vodar-9500p' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (product9500) await payload.update({ collection: 'products', id: product9500.id, overrideAccess: true, data: {
  name: 'Zimmatic 9500P', manufacturer: maker.id, brand: 'Lindsay / Zimmatic', category: familyRecords['lindsay-zimmatic-center-pivot'].categoryId, family: familyRecords['lindsay-zimmatic-center-pivot'].family.id,
  summary: 'Zimmatic 9500P körforgó öntözőrendszer 11-es gauge fővezetékkel, hosszú fesztávokra és igényes terepviszonyokhoz.',
  description: richText([
    'A Zimmatic 9500P a Lindsay nagy fesztávú körforgó öntözőrendszere. A gyártó a modellt hosszú rendszerekhez, változatos terepviszonyokhoz és nagyobb mezőgazdasági területekhez ajánlja.',
    'A 11-es gauge fővezeték a gyártói leírás szerint versenytársak megoldásaihoz képest 15%-kal vastagabb. A 6⅝ hüvelykes csőátmérő, a moduláris fesztáv-kialakítás és a választható, standardtól ultra-magasig terjedő szabadmagasság segít a gépet a tábla és a termesztett növény igényeihez igazítani.',
    'A Lindsay termékútmutató további konfigurációs lehetőségeket sorol fel, köztük vezérlőpaneleket, saroköntöző kart és FieldNET távfelügyeleti megoldást. A konkrét gép műszaki összeállítását a helyszín, a tábla és az öntözési igény alapján kell meghatározni.',
  ]),
  specifications: [
    { label: 'Rendszertípus', value: 'Körforgó öntözőrendszer' },
    { label: 'Fővezeték', value: '11-es gauge' },
    { label: 'Fővezeték átmérője', value: '6⅝ hüvelyk (kb. 168 mm)' },
    { label: 'Szabadmagasság', value: 'Standardtól ultra-magasig választható' },
    { label: 'Gyártói vastagsági összevetés', value: '15%-kal vastagabb cső a Lindsay termékoldalának állítása szerint' },
  ],
  image: photo9500.id, gallery: [photo9500.id], originalUrl: src9500,
  sortOrder: 9500,
  sourceDetails: 'A termékleírás és a fotó a Lindsay hivatalos Zimmatic 9500P oldaláról származik; a családszintű konfigurációs választékot a Lindsay termékútmutató támasztja alá.',
  sourceEvidence: [{ url: src9500, note: 'Hivatalos Zimmatic 9500P termékoldal, leírás és főfotó.', media: photo9500.id }, { url: srcGuide, note: 'Lindsay nemzetközi termékútmutató, konfigurációs lehetőségek.' }],
  reviewState: 'ready', reviewNote: 'A Lindsay Zimmatic 9500P modellszintű azonosítása, képe és gyártói leírása ellenőrizve. A kiválasztott konfiguráció adatai ajánlatonként egyeztetendők.',
} as any })

const omega: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'vodar-9510pl-omega' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (omega) {
  const omegaPhoto: any = (await payload.find({ collection: 'media', where: { id: { equals: 14 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (omegaPhoto) await payload.update({ collection: 'media', id: omegaPhoto.id, overrideAccess: true, data: { alt: 'Lindsay Europe OMEGA 9510PL lineáris-körforgó öntözőrendszer', credit: 'RM Hungary eredeti termékoldala; 9510PL Omega képként azonosítva' } as any })
  await payload.update({ collection: 'products', id: omega.id, overrideAccess: true, data: {
    name: 'Lindsay Europe OMEGA 9510PL', manufacturer: maker.id, brand: 'Lindsay Europe / Zimmatic Omega', category: familyRecords['lindsay-omega-linearis'].categoryId, family: familyRecords['lindsay-omega-linearis'].family.id,
    summary: 'Kombinált öntözőgép, amely lineáris és körforgó módban is bejárhatja a táblát.',
    description: richText([
      'A Lindsay Europe OMEGA 9510PL kombinált lineáris-körforgó öntözőgép. A Lindsay Europe kézikönyve szerint lineáris, körforgó, illetve a két mozgást váltogató üzemben is használható, így a gép mozgása a tábla alakjához igazítható.',
      'A horganyzott acél váz és a több járótag között rugalmasan követhető kialakítás egyenetlen terepen is segíti az egyenes futást. A tornyok vízálló, nagy indítónyomatékú villanymotorjai hajtják a gépet; a kezelő lineáris vagy körforgó haladást és annak irányát programozhatja.',
      'A kézikönyv két program tárolását és programonként legfeljebb 40 automatikus útszakasz beállítását ismerteti. A vízadag, a sebesség és a kiegészítő berendezések működése is beállítható. A konfiguráció és a telepítési feltételek egyeztetést igényelnek.',
    ]),
    specifications: [
      { label: 'Üzemmódok', value: 'Lineáris, körforgó vagy kombinált' },
      { label: 'Programozás', value: '2 program; programonként legfeljebb 40 automatikus útszakasz' },
      { label: 'Váz', value: 'Horganyzott acél' },
      { label: 'Megengedett szélsebesség', value: '140 km/h a kézikönyvben idézett tervezési szabvány szerint' },
    ],
    image: omegaPhoto?.id, gallery: omegaPhoto ? [omegaPhoto.id] : [], documents: [manual.id], originalUrl: srcOmegaManual,
    sourceDetails: 'A gyártói azonosítást a Lindsay Europe 2015. november 15-i OMEGA 9510PL kezelési kézikönyve támasztja alá. A képet az eredeti RM-oldal fájlneve és modellkörnyezete alapján azonosítottam; az adatlap dokumentumként tartalmazza a kézikönyvet.',
    sourceEvidence: [{ url: srcOmegaManual, note: 'Lindsay Europe OMEGA 9510PL kezelési kézikönyv; üzemmódok, kezelés, adatok.', media: manual.id }],
    reviewState: 'source-check', reviewNote: 'Lindsay Europe gyártói kézikönyv alapján kitöltve. A kézikönyv 2015-ös; aktuális konfigurációs és alkatrész-adatokat külön kell ellenőrizni.',
  } as any })
}

await payload.destroy()
console.log('Lindsay/Zimmatic: 9500P és OMEGA 9510PL a gyártó szerinti családba sorolva; fotó, leírás, adatmezők és OMEGA kézikönyv kapcsolva.')
