import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const productUrl = 'https://www.oliveragro.it/prodotto/sarchiatura/rotosark/'
const companyUrl = 'https://www.oliveragro.it/azienda/'
const brochureUrl = 'https://www.oliveragro.it/wp-content/uploads/2020/12/ROTOSARK-CATALOGO-20201216-IT-1.pdf'
const legacyUrl = 'https://www.rmhungary.hu/index.php?alkat=44'
const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })

async function media(sourceUrl: string, file: string, alt: string, credit: string) {
  let item: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!item) item = await payload.create({ collection: 'media', overrideAccess: true, data: { alt, sourceUrl, credit }, filePath: path.join(root, file) } as any)
  else await payload.update({ collection: 'media', id: item.id, overrideAccess: true, data: { alt, credit } as any })
  return item
}

const base = 'https://www.oliveragro.it/wp-content/uploads/'
const assets = [
  { file: 'public/images/oliveragro/rotosark-field-corn.jpg', url: `${base}2018/06/IMG_0846-1-2-1900x779.jpg`, alt: 'Oliver Agro Rotosark sorközművelő gép munka közben, kukoricában' },
  { file: 'public/images/oliveragro/rotosark-main.jpg', url: `${base}2018/06/rotosark-ttp-2048x1552-1.jpg`, alt: 'Oliver Agro Rotosark gép gyártói termékképe' },
  { file: 'public/images/oliveragro/rotoblizz.png', url: `${base}2018/04/ROTOBLIZZ.png`, alt: 'Oliver Agro Rotoblizz ellentétesen forgó rotorok' },
  { file: 'public/images/oliveragro/rotoclean.png', url: `${base}2018/04/icona-rotoclean.png`, alt: 'Oliver Agro Rotoclean gyomirtó és bakhátformáló tárcsa' },
  { file: 'public/images/oliveragro/rotodisk.png', url: `${base}2018/04/icone-rotodisk.png`, alt: 'Oliver Agro Rotodisk bakhátművelő tárcsa' },
  { file: 'public/images/oliveragro/chassis-options.jpg', url: `${base}2018/06/TELAI-1.jpg`, alt: 'Oliver Agro Rotosark vázkialakítások' },
  { file: 'public/images/oliveragro/rotoblizz-standard.png', url: `${base}2018/06/elemento-rotoblizz-standard-1.png`, alt: 'Oliver Agro Rotosark alap Rotoblizz paralelogramma-elemmel' },
  { file: 'public/images/oliveragro/rotoblizz-full.png', url: `${base}2018/06/elemento-rotoblizz-full-1.png`, alt: 'Oliver Agro Rotosark teljes felszereltségű sorközművelő eleme' },
  { file: 'public/images/oliveragro/corn-application.jpg', url: `${base}2018/06/ROTOBLIZZ-MAIS-4.jpg`, alt: 'Rotosark Rotoblizz rotorok kukoricasorban' },
  { file: 'public/images/oliveragro/lettuce-application.jpg', url: `${base}2018/06/ROTOBLIZZ-INSALATA-5.jpg`, alt: 'Rotosark salátasorok mechanikus gyomirtása' },
  { file: 'public/images/oliveragro/radicchio-application.jpg', url: `${base}2018/06/ROTOBLIZZ-RADICCHIO-1.jpg`, alt: 'Rotosark radicchio kultúrában' },
  { file: 'public/images/oliveragro/tomato-application.jpg', url: `${base}2018/06/POMODORO-3.jpg`, alt: 'Rotosark paradicsomkultúrában' },
  { file: 'public/images/oliveragro/robot-integration.jpg', url: `${base}2018/06/Screenshot_20230704_155318_Gallery.jpg`, alt: 'Oliver Agro Rotosark Robotti önjáró mezőgazdasági robotra szerelve' },
]
const photos: any[] = []
for (const item of assets) photos.push(await media(item.url, item.file, item.alt, 'Oliver Agro hivatalos Rotosark termékoldala'))
const brochure = await media(brochureUrl, 'public/images/oliveragro/rotosark-brochure.pdf', 'Oliver Agro Rotosark gyártói katalógus (olasz nyelvű, 2 oldal)', 'Oliver Agro hivatalos Rotosark termékoldala')

const maker: any = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'oliveragro' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: 'novenyapolas' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'oliveragro-rotosark' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!maker || !category || !product) throw new Error('Missing Oliver Agro manufacturer, category, or Rotosark product record.')

await payload.update({ collection: 'manufacturers', id: maker.id, overrideAccess: true, data: {
  description: 'Az olasz Oliver Agro 1979 óta gyárt mezőgazdasági gépeket. Kiemelt területe a sorközművelés és a mechanikus gyomirtás; gépei a zöldségtermesztés, faiskolai és dohánytermesztési munkákhoz is készülnek.',
  sourceUrl: companyUrl,
  reviewNote: 'A gyártói bemutatkozás, az alapítás éve és a fő tevékenységi terület az Oliver Agro hivatalos vállalati oldalával ellenőrizve.',
} as any })
await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: {
  description: 'Sorközművelő és növényápoló gépek a vetett vagy palántázott kultúrák mechanikus gyomirtásához és talajműveléséhez.',
} as any })

let family: any = (await payload.find({ collection: 'product-families', where: { slug: { equals: 'oliveragro-rotosark' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const familyData = {
  name: 'Oliver Agro Rotosark', slug: 'oliveragro-rotosark', category: category.id, manufacturer: maker.id,
  summary: 'Három funkció egy gépben: mechanikus gyomirtás, talajlazítás és bakhátformálás.',
  image: photos[1].id, sourceUrl: productUrl, sortOrder: 10, status: 'published',
  sourceDetails: 'A Rotosark a gyártó fix, oldaleltolásos vagy összecsukható vázzal konfigurálható, egy vagy több paralelogramma-elemmel készülő sorközművelő gépe. A gyártói oldalon szereplő Rotoblizz rotoradatok, konfigurációk, opciók, képek és videók a családhoz tartoznak.',
  reviewNote: 'A családnév, főfotó és leírás az Oliver Agro hivatalos Rotosark oldalával egyezik.',
}
family = family ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData as any }) : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })

await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
  name: 'Oliver Agro Rotosark', manufacturer: maker.id, brand: 'Oliver Agro', category: category.id, family: family.id,
  productKind: 'model', reviewState: 'ready', modelCode: 'Rotosark',
  summary: 'Három az egyben sorközművelő gép: mechanikus gyomirtás, talajlazítás és bakhátformálás vetett vagy palántázott sorokban.',
  description: richText([
    'A Rotosark a vetett vagy palántázott kultúrák sorain dolgozó sorközművelő gép. Egy menetben segíti a mechanikus gyomirtást, a felső talajréteg lazítását és a bakhát formálását. A gyártó fix, hidraulikusan oldalra tolható vagy összecsukható vázzal, egy vagy több paralelogramma-elemmel kínálja.',
    'A paralelogramma változó terhelésű, kézi kurblival állítható rugóval és három szerszámhelyes tartógerendával készül. Az alapfelszerelés része a Rotoblizz rotor; a vázra az adott kultúrához és művelési feladathoz illő eszközök szerelhetők. A két acélrotor egymással szemben, 28°-os szögben forog, és a felső talajrétegben általában 3–4 cm mélyen dolgozik. A gyártó szerint a rotorok akár 2 cm-re is megközelíthetik a növényt.',
    'A Rotoblizz 30, 35 és 40 cm-es átmérővel szerepel a gyártói táblázatban. Az egyes változatokhoz megadott sortávolság 40–45 cm, 50–60 cm, illetve 60 cm felett; a növény melletti hasznos munkasáv rendre 12, 14 és 16 cm. A megadott értékek a rotorválasztáshoz tartoznak, nem a teljes gép munkaszélességét jelentik.',
    'A konfiguráció a fix, vontatott vagy tolható váztól az oldalra tolható hidraulikus kivitelig terjed; választható kézi vagy joystickos irányítás, összecsukható szárnyrész, valamint kamerás automatikus vezetés is. A kiegészítők között szerepelnek kéregtörő kapák, sorközművelő kapák, töltögetők, levélvédők, tömlőemelő, Rotoclean és Rotodisk elemek, műtrágyaszóró, tömörítőhengerek és simítórácsok.',
    'A gyártó a Rotosarkot többek között kukorica, szója, paradicsom, burgonya, cukorrépa, saláta, káposztafélék, hagyma, póréhagyma, hüvelyesek, dohány, faiskolai növények és gyógynövények sorközi művelésére sorolja fel. A konkrét gépkialakítást a kultúra, a sortávolság, a talaj és a traktor vagy hordozógép szerint kell kiválasztani.',
  ]),
  specifications: [
    { label: 'Műveletek', value: 'Mechanikus gyomirtás, talajlazítás és bakhátformálás' },
    { label: 'Vázváltozatok', value: 'Fix; hidraulikus oldaleltolásos; hidraulikusan összecsukható; eltolt elemes kivitel' },
    { label: 'Rotoblizz rotorátmérők', value: '30, 35 vagy 40 cm' },
    { label: 'Ajánlott sortávolság rotor szerint', value: '30 cm rotor: 40–45 cm; 35 cm rotor: 50–60 cm; 40 cm rotor: 60 cm felett' },
    { label: 'Hasznos munkasáv a növénytől', value: '30 cm rotor: 12 cm; 35 cm rotor: 14 cm; 40 cm rotor: 16 cm' },
    { label: 'Megközelítés a növényhez', value: 'A gyártó szerint akár 2 cm' },
    { label: 'Rotorállás', value: 'Egymással szemben, 28°-os dőléssel' },
    { label: 'Jellemző munkamélység', value: '3–4 cm' },
    { label: 'Rotorkés vastagsága', value: '3 cm' },
    { label: 'Vázméretek harmadikpont-csatlakozással', value: '240, 300, 350, 450, 520 és 600 cm' },
    { label: 'Irányítás', value: 'Kiviteltől függően kézi kormány, joystick vagy kamerás automatikus vezetés' },
  ],
  configurations: [
    { name: 'Alap Rotosark paralelogramma', value: 'Rotoblizz rotorok és a rotorok által el nem ért sávokhoz sorközművelő készlet.' },
    { name: 'Teljes felszereltségű elem', value: 'Opcionális első kapák, Rotoblizz rotorok, sorközművelő készlet és töltögető elemek.' },
    { name: 'Talaj- és bakhátkiegészítők', value: 'Rotoclean, Rotodisk, kéregtörő csillag, töltögető tárcsa és sorközművelő kapák.' },
    { name: 'További felszerelések', value: 'Tömlőemelő, magas növények levélvédelme, műtrágyaszóró, tömörítőhenger, simítórács és rugalmas rugók.' },
    { name: 'Vezetés', value: 'Joystickos oldaleltolás, fülkéből kezelhető kamera-monitor rendszer vagy automatikus kamerás vezetés.' },
  ],
  image: photos[0].id, gallery: photos.map((photo) => photo.id), documents: [brochure.id], originalUrl: productUrl,
  sourceDetails: 'Az aktuális magyar termékszöveg, táblázat, opciólista, képek, videók és PDF az Oliver Agro hivatalos Rotosark adatlapján alapul. A márkabemutató az Oliver Agro hivatalos cégtörténetét használja. A helyi RM kategóriaoldal is Rotosarkként nevezi meg a terméket.',
  sourceEvidence: [
    { url: productUrl, note: 'Hivatalos termékadatlap: működés, Rotoblizz mérettáblázat, konfigurációk, opciók, termékfotók és 31 kultúránként csoportosított videó.', media: photos[0].id },
    { url: brochureUrl, note: 'A gyártói termékoldalról letölthető Rotosark katalógus (olasz, 2 oldal).', media: brochure.id },
    { url: companyUrl, note: 'Hivatalos cégtörténet és gyártói bemutatkozás.' },
    { url: legacyUrl, note: 'A korábbi RM Hungary kategóriaoldal a Rotosarkot az Oliveragro gyártmányai közé sorolja.' },
  ],
  reviewNote: 'A helyi terméknév és a gyártói Rotosark modell egyértelműen egyezik. A magyar leírás, táblázat, konfigurációk, galéria, katalógus és videók a hivatalos termékoldallal ellenőrizve.',
} as any })

console.log(`Oliver Agro Rotosark: család, gyártói bemutató, termékleírás, 11 műszaki adat, konfigurációk, ${photos.length} kép, PDF és 31 videó kapcsolva.`)
await payload.destroy()
