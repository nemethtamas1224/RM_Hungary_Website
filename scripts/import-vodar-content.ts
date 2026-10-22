import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const sourceCenter = 'https://www.vodarirrigations.com/center_pivot_irrigation_system/center_pivot_irrigation_system.html'
const sourceLinear = 'https://www.vodarirrigations.com/linear_irrigation_system/linear_irrigation_system.html'
const sourceHome = 'https://www.vodarirrigations.com/'
const sourcePivotCn = 'https://www.vodar.cn/ProductDetail/11137301.html'
const sourceLinearCn = 'https://www.vodar.cn/Product/663969.html'

const mediaAssets = [
  { key: 'pivotMain', file: 'center-pivot-main.jpg', url: 'https://www.vodar.cn/comdata/111309/product/20250903160202793F050C669B217E_b.jpg', alt: 'VODAR központi forgópontos öntözőgép szántóföldön' },
  { key: 'pivotField', file: 'center-pivot-field.jpg', url: 'https://www.vodar.cn/comdata/111309/product/20250903160202F95020A9C76CD73C_b.jpg', alt: 'VODAR központi forgópontos öntözőrendszer működés közben' },
  { key: 'pivotCrop', file: 'center-pivot-crop.jpg', url: 'https://www.vodar.cn/comdata/111309/product/20250903160202321CC815F0EA3D72_b.jpg', alt: 'VODAR központi forgópontos öntözőgép gabonatáblán' },
  { key: 'pivotNozzles', file: 'center-pivot-nozzles.jpg', url: 'https://www.vodar.cn/comdata/111309/product/20250903160202AC8BC1825C29BD1B_b.jpg', alt: 'VODAR öntözőgép függesztett szórófejei közelről' },
  { key: 'linearMain', file: 'linear-system.jpg', url: 'https://www.vodar.cn/comdata/111309/product/202509031601421C74D99C766D1C5C_b.jpg', alt: 'VODAR lineáris öntözőgép motoros járókerekekkel' },
]
const media: Record<string, any> = {}
for (const item of mediaAssets) {
  const found: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: item.url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  media[item.key] = found || await payload.create({
    collection: 'media', overrideAccess: true,
    data: { alt: item.alt, sourceUrl: item.url, credit: 'VODAR (Tianjin) Co., Ltd. hivatalos termékoldala' },
    filePath: path.join(root, 'public/images/vodar', item.file),
  } as any)
}

const richText = (paragraphs: string[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({
    type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
  })) },
})

const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'vodar' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!manufacturer) throw new Error('VODAR márkarekord nem található')
await payload.update({ collection: 'manufacturers', id: manufacturer.id, overrideAccess: true, data: {
  description: 'A VODAR mezőgazdasági öntözőberendezéseket gyárt. Kínálatában körforgó és lineáris öntözőrendszerek, valamint csévélődobos gépek szerepelnek.',
  sourceUrl: sourceHome,
  reviewNote: 'A gyártói tevékenység és a termékkör a VODAR hivatalos weboldalán ellenőrizve.',
} as any })

const categoryCopy: Array<[string, string]> = [
  ['korforgo', 'A körforgó öntözőrendszer központi vízellátási pont körül forduló, járókerekekkel mozgatott csővezetéken juttatja ki a vizet. A rendszer a berendezés hosszától függő kör alakú területet öntöz.'],
  ['linearis', 'A lineáris öntözőrendszer motoros járókerekekkel halad oda-vissza a táblán, és téglalap alakú területet öntöz. A lefedett területet a gép hossza és a megtett út együttesen határozza meg.'],
]
for (const [slug, description] of categoryCopy) {
  const category = (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (category) await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { description } as any })
}

const familyCopy: Array<{ slug: string; summary: string; source: string; details: string }> = [
  {
    slug: 'vodar-korforgo', source: sourceCenter,
    summary: 'Központi vízellátási pont körül forgó, járókerekes öntözőgép; kör alakú területek egyenletes öntözésére.',
    details: 'A gyártó leírása szerint a rendszer központi vízellátáshoz kapcsolódó, fúvókákkal szerelt csővezetéket mozgat automatikusan egy központi pont körül. A megadott span-hosszak 50, 56 és 62 méter; a szabad magasság 6, 12, 18 vagy 24 méterként választható. A gyártó 168 és 219 mm-es csőátmérőt, 1,5 vagy 3 méteres fúvókatávolságot, illetve 2,9 és 4,6 méteres átjárási magasságot sorol fel. A konfigurációtól függően a gép hossza elérheti a 800 métert.',
  },
  {
    slug: 'vodar-linearis', source: sourceLinear,
    summary: 'Oda-vissza haladó öntözőgép, amely téglalap alakú táblán dolgozik; a lefedés a géphossztól és a haladási úttól függ.',
    details: 'A lineáris berendezés motoros kerekeken halad oda-vissza a táblán. A gyártó 200–400 méteres géphosszt emel ki általános tájékoztatásként, a rendszer pedig a gép hosszától és a haladási úttól függően öntöz téglalap alakú területet. Az ismertetett fővezeték 168 vagy 219 mm-es; a fesztávok többek között 38, 44, 50, 56 és 62 méteres kivitelűek. A gyártó különböző szabadmagasságot, túlnyúlást, abroncsot és energiaellátási módot sorol fel.',
  },
]
for (const familyData of familyCopy) {
  const family = (await payload.find({ collection: 'product-families', where: { slug: { equals: familyData.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!family) continue
  await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: {
    summary: familyData.summary,
    sourceUrl: familyData.source,
    sourceDetails: familyData.details,
    image: familyData.slug === 'vodar-korforgo' ? media.pivotMain.id : media.linearMain.id,
    reviewNote: 'A rövid leírás és a hivatalos VODAR termékoldalon bemutatott megfelelő géptípus képe ellenőrizve.',
    status: 'published',
  } as any })
}

const centerPivot = (await payload.find({ collection: 'products', where: { slug: { equals: 'vodar-center-pivot' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (centerPivot) await payload.update({ collection: 'products', id: centerPivot.id, overrideAccess: true, data: {
  summary: 'VODAR körforgó öntözőrendszer központi vízellátással, az adott táblához és növényállományhoz méretezhető fesztávokkal.',
  description: richText([
    'A körforgó öntözőrendszer központi vízellátási pont körül forduló csővezetéken, automatikusan mozgó tartószerkezetekkel juttatja ki a vizet. A fúvókák a gép haladása közben öntözik a területet.',
    'A gyártó a hagyományos öntözési megoldásokhoz képest tartós, könnyen kezelhető szerkezetként írja le, amely egyenletes vízkijuttatásra készült. Kiegészítő konfigurációtól függően a rendszer hossza és a végi szóróágyú is a kívánt öntözési sugárhoz igazítható.',
    'A gyártói kínálatban 50, 56 és 62 méteres fesztávok szerepelnek. A megadott fővezeték-átmérők 168 és 219 mm; a fúvókák távolsága 1,5 vagy 3 méter, az átjárási magasság pedig 2,9 vagy 4,6 méter. A választható szabad magasság 6, 12, 18 vagy 24 méter. A tápellátás lehet földkábel vagy generátor, a vízellátás pedig föld alatti vezetékről vagy tárolótartályból történhet.',
    'A konkrét gép összeállítását a tábla mérete, az öntözési igény, a vízforrás és az energiaellátás alapján kell meghatározni.',
  ]),
  specifications: [
    { label: 'Fesztávhossz', value: '50 / 56 / 62 m' },
    { label: 'Fővezeték-átmérő', value: '168 / 219 mm' },
    { label: 'Fúvókatávolság', value: '1,5 / 3 m' },
    { label: 'Átjárási magasság', value: '2,9 / 4,6 m' },
    { label: 'Választható szabad magasság', value: '6 / 12 / 18 / 24 m' },
    { label: 'Tápellátás', value: 'Földkábel vagy generátor' },
    { label: 'Vízellátás', value: 'Föld alatti csővezeték vagy tárolótartály' },
  ],
  image: media.pivotMain.id,
  gallery: [media.pivotMain.id, media.pivotField.id, media.pivotCrop.id, media.pivotNozzles.id],
  originalUrl: sourceCenter,
  sourceDetails: 'A leírás és a felsorolt családszintű konfigurációs értékek a VODAR hivatalos Center Pivot oldaláról származnak; ezek nem egy konkrét gépajánlat paraméterei. A termékfotók a gyártó hivatalos kínai termékoldalán szerepelnek a „Center pivot irrigation system” termékhez.',
  sourceEvidence: [{ url: sourceCenter, note: 'Körforgó öntözőrendszer működése és családszintű konfigurációs adatai.' }, { url: sourcePivotCn, note: 'A gyártó hivatalos Center Pivot termékoldala és a termékhez tartozó négy fotó.', media: media.pivotMain.id }],
  reviewState: 'specs-missing',
  reviewNote: 'A hivatalos termékoldali Center Pivot gépazonosítás és galéria ellenőrizve; a helyi rekord továbbra is általános, egyedi konfigurációja nincs meghatározva.',
} as any })

await payload.destroy()
console.log('VODAR: két kategória, két családkártya és a Center Pivot termékoldal forrásalapú leírása frissítve; bizonytalan modellrekordok változatlanok.')
