import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const hydroplusUrl = 'https://www.giuntispa.com/product/hydroplus/'
const categoryUrl = 'https://www.giuntispa.com/product-category/manichetta-gocciolante/'
const hydroplusImageUrl = 'https://www.giuntispa.com/wp-content/uploads/2017/11/Hydroplus-x-ico-giunti-spa-600x600.jpg'
const hydroplusTableUrl = 'https://www.giuntispa.com/wp-content/uploads/2017/11/HIDROPLUS-TABELLA.png'

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
})

async function mediaFor(sourceUrl: string, file: string, alt: string) {
  const existing = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (existing) return existing
  return payload.create({
    collection: 'media', overrideAccess: true,
    data: { alt, sourceUrl, credit: 'Giunti S.p.A. hivatalos termékoldala' },
    filePath: path.join(root, file),
  } as any)
}

const mainImage = await mediaFor(hydroplusImageUrl, 'public/images/giunti/hydroplus.jpg', 'Giunti Hydroplus csepegtetőszalag és belső labirintus')
const tableImage = await mediaFor(hydroplusTableUrl, 'public/images/giunti/hydroplus-table.png', 'Giunti Hydroplus méret- és vízhozamtáblázat')

const product = (await payload.find({ collection: 'products', where: { slug: { equals: 'hydroplus-csepegtetoszalag' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!product) throw new Error('Missing local Hydroplus product record')

const flowCodes = [
  { spacing: 10, high: '15', highCode: '1150', standard: '10', standardCode: '1100', low: '6', lowCode: '1060' },
  { spacing: 20, high: '7,5', highCode: '2075', standard: '5', standardCode: '2050', low: '3', lowCode: '2030' },
  { spacing: 30, high: '5', highCode: '3050', standard: '3,3', standardCode: '3033', low: '2', lowCode: '3020' },
  { spacing: 40, high: '3,8', highCode: '4038', standard: '2,5', standardCode: '4025', low: '1,5', lowCode: '4015' },
]
const rollLengths: Record<string, number> = { '16-6': 3000, '16-8': 2200, '16-10': 1800, '16-12': 1500, '22-8': 1700, '22-10': 1300, '22-12': 1000 }
const variants = Object.entries(rollLengths).flatMap(([key, rollLength]) => {
  const [diameter, thickness] = key.split('-')
  const sizePrefix = diameter === '16' ? 'H' : 'X'
  return flowCodes.map((row) => {
    return {
      name: `Ø${diameter} mm · ${thickness} mil · ${row.spacing} cm osztás`,
      value: `Nagy vízhozam: ${row.high} l/óra/m (${sizePrefix}A${String(thickness).padStart(2, '0')}${row.highCode}); normál: ${row.standard} l/óra/m (${sizePrefix}S${String(thickness).padStart(2, '0')}${row.standardCode}); kis vízhozam: ${row.low} l/óra/m (${sizePrefix}B${String(thickness).padStart(2, '0')}${row.lowCode}); tekercs: ${rollLength.toLocaleString('hu-HU')} m.`,
      sourceUrl: hydroplusUrl,
    }
  })
})

await payload.update({
  collection: 'products', id: product.id, overrideAccess: true,
  data: {
    summary: 'Felső kategóriás csepegtetőszalag, amely nyílt területen és üvegházban is egyenletes vízelosztást biztosít. Több csőátmérővel, falvastagsággal, csepegtető-osztással és vízhozam-változattal készül.',
    description: richText([
      'A Hydroplus közvetlen extrudálással készül: a gyártási folyamat során egyszerre formálják a polietilén csövet és annak belső szalagját. Az adagolónyílásokat lézer vágja az előre meghatározott távolságokra; infrakamera ellenőrzi a vágási pontot, a méreteket pedig külön lézeres állomás vizsgálja.',
      'A kialakítás egyenletes vízelosztásra készült, és sokféle szántóföldi, illetve üvegházi kultúrához alkalmazható. A gyártó által felsorolt előnyök közé tartozik az egyöntetű öntözés, a víz- és energiafelhasználás mérséklése, a gyomok fejlődésének visszaszorítása és a tápoldatozás támogatása.',
      'A megfelelő szűrés elengedhetetlen. A vízforrástól függően ciklonos, finom kvarchomokos, tárcsás vagy hálós szűrés alkalmazható; az ajánlott szűrési finomság 150 mesh (100 mikron).',
      'Vízben oldódó tápanyag használható. Az öntözés leállítása előtt a gyártó a csővezeték átöblítését javasolja, hogy ne maradjon benne műtrágya vagy vegyszer.',
      'A belső labirintus speciális geometriája kis turbulenciákat hoz létre, amelyek segítik a mikrorészecskék továbbhaladását, és csökkentik a lerakódás, illetve az eltömődés kockázatát.',
    ]),
    specifications: [
      { label: 'Kialakítás', value: 'Közvetlen extrudálással kialakított PE cső és belső szalag' },
      { label: 'Átmérő a gyártói táblázatban', value: '16 mm és 22 mm' },
      { label: 'Falvastagság', value: '16 mm-es változat: 6, 8, 10 és 12 mil; 22 mm-es változat: 8, 10 és 12 mil' },
      { label: 'Csepegtető-osztás', value: '10, 20, 30 vagy 40 cm' },
      { label: 'Szűrési finomság', value: 'Ajánlás: 150 mesh (100 mikron)' },
    ],
    configurations: variants,
    image: mainImage.id,
    gallery: [mainImage.id, tableImage.id],
    documents: [tableImage.id],
    originalUrl: hydroplusUrl,
    sourceDetails: 'A gyártói Hydroplus oldalon közölt leírás és HIDROPLUS-TABELLA táblázat. A táblázat kódjait, osztásait, vízhozamait és tekercshosszait a helyi változatokba is átvezettem.',
    sourceEvidence: [{ url: hydroplusUrl, note: 'Gyártási folyamat, felhasználás, szűrés, tápoldatozás és belső labirintus leírása.' }, { url: hydroplusTableUrl, note: 'Átmérők, falvastagságok, csepegtető-osztások, vízhozamok, termékkódok és tekercshosszak.' }],
    reviewState: 'ready',
    reviewNote: 'A magyar leírás és a választható változatok a Giunti hivatalos Hydroplus-oldaláról és táblázatából ellenőrizve.',
  },
} as any)

const family = (await payload.find({ collection: 'product-families', where: { slug: { equals: 'giunti-csepegteto' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (family) await payload.update({
  collection: 'product-families', id: family.id, overrideAccess: true,
  data: {
    summary: 'Csepegtetőszalagok és mikroöntözési megoldások kis vízhozamú, célzott vízadagoláshoz. A választékban különböző csepegtetőszalagok, csövek, szűrő- és tápoldatozó elemek találhatók.',
    image: mainImage.id,
    sourceUrl: categoryUrl,
    sourceDetails: 'A Giunti mikroöntözési és csepegtetőszalag-kategória összefoglalója. A gyártó a csepegtetőelemeket a gyökérzónához juttatott, kis térfogatú vízadagokkal és alacsony üzemi vízhozammal írja le.',
    reviewNote: 'A családbemutató a hivatalos mikroöntözési és csepegtetőszalag-oldal alapján készült. A HydroG helyi rekord nevét HydroG2-re nem módosítottam, mert a névazonosság nem igazolt.',
  },
} as any)

const category = (await payload.find({ collection: 'categories', where: { slug: { equals: 'csepegteto-mikro' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (category) await payload.update({
  collection: 'categories', id: category.id, overrideAccess: true,
  data: { description: 'Giunti csepegtetőszalagok, csepegtetőcsövek és mikroöntözési elemek célzott vízadagoláshoz.' },
} as any)

const genericProduct = (await payload.find({ collection: 'products', where: { slug: { equals: 'csepegteto-csovek' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const brochure = (await payload.find({ collection: 'media', where: { filename: { equals: 'bf24c56446ea-giunti_csepeg.pdf' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (genericProduct) await payload.update({
  collection: 'products', id: genericProduct.id, overrideAccess: true,
  data: {
    summary: 'Csepegtetőcsövek gyümölcsösök, kertészeti kultúrák és fóliasátrak egyenletes, takarékos öntözéséhez.',
    description: richText([
      'A csepegtetőcső kis vízadagokat juttat közvetlenül a növények gyökérzónájához. A Giunti kínálatában merev falú, labirintusos csepegtetőcsövek szerepelnek gyümölcsösök, kertészeti kultúrák és fóliasátrak öntözéséhez.',
      'Az egyenletes vízelosztás és a kis vízhozam segíti a víztakarékos üzemet. A rendszer szűrőállomáshoz kapcsolható; a gyártói választékleírás szerint tápoldatozás is lehetséges.',
    ]),
    specifications: [
      { label: 'Kivitel', value: 'Merev falú, labirintusos csepegtetőcső' },
      { label: 'Felhasználás', value: 'Gyümölcsösök, kertészeti kultúrák és fóliasátrak' },
      { label: 'Rendszerelemek', value: 'Szűrőállomáshoz kapcsolható; tápoldatozás lehetséges' },
    ],
    documents: brochure ? [brochure.id] : [],
    sourceDetails: 'A terméktípus leírása a korábbi RM Hungary Giunti-oldalról lett átdolgozva. A csatolt magyar Giunti-csepegtető prospektus a rendszer áttekintését adja; modell-specifikus adatlapként nem szerepel.',
    originalUrl: 'https://www.rmhungary.hu/index.php?alkat=13',
    reviewState: 'specs-missing',
    reviewNote: 'Általános terméktípus; modell- és méretspecifikus adatlap nincs hozzárendelve.',
    sourceEvidence: [{ url: 'https://www.giuntispa.com/product-category/manichetta-gocciolante/', note: 'A gyártó a csepegtetőelemeket kis adagú, gyökérzónához irányított öntözésként ismerteti.' }],
  },
} as any)

const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'giunti' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (manufacturer) await payload.update({
  collection: 'manufacturers', id: manufacturer.id, overrideAccess: true,
  data: {
    description: 'A Giunti öntözési rendszerekhez csepegtetőszalagokat, csöveket, szűrőket és vízelosztó szerelvényeket gyárt.',
    sourceUrl: 'https://www.giuntispa.com/',
    reviewNote: 'Bemutatkozás a Giunti hivatalos mezőgazdasági öntözési és mikroöntözési kínálata alapján.',
  },
} as any)

console.log(`Giunti Hydroplus frissítve: ${variants.length} konfiguráció, médiák ${mainImage.id} és ${tableImage.id}; csepegtetőcsövek: PDF ${brochure?.id ?? 'nincs'}`)
await payload.destroy()
