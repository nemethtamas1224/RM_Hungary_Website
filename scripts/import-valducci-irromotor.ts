import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const officialPage = 'https://www.giuntispa.com/valducci-brand/'
const catalogUrl = 'https://www.giuntispa.com/wp-content/uploads/2017/12/Irromotor_depliant.pdf'
const category = (await payload.find({ collection: 'categories', where: { slug: { equals: 'csevelodobos' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'valducci' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!category || !manufacturer) throw new Error('A csévélődobos alkategória vagy a Valducci gyártórekord hiányzik.')

const mediaFiles = [
  { key: 'newMini40', file: 'public/images/valducci/irromotor/new-mini-40-125.jpg', alt: 'Valducci Irromotor New Mini 40/125', source: catalogUrl },
  { key: 'newMini50', file: 'public/images/valducci/irromotor/new-mini-50-150.jpg', alt: 'Valducci Irromotor New Mini 50/150', source: catalogUrl },
  { key: 'vSeries', file: 'public/images/valducci/irromotor/v-series.jpg', alt: 'Valducci Irromotor V sorozatú csévélődob', source: catalogUrl },
  { key: 'viSeries', file: 'public/images/valducci/irromotor/vi-series.jpg', alt: 'Valducci Irromotor Vi hidraulikus csévélődob', source: catalogUrl },
  { key: 'catalog', file: 'public/documents/valducci/irromotor-depliant.pdf', alt: 'Valducci Irromotor termékkatalógus', source: catalogUrl },
]
const media: Record<string, any> = {}
for (const item of mediaFiles) {
  media[item.key] = (await payload.find({ collection: 'media', where: { and: [{ sourceUrl: { equals: item.source } }, { alt: { equals: item.alt } }] }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!media[item.key]) {
    media[item.key] = await payload.create({
      collection: 'media', overrideAccess: true,
      data: { alt: item.alt, sourceUrl: item.source, credit: 'Valducci Irromotor termékkatalógus, Giunti S.p.A. hivatalos oldala' },
      filePath: path.join(root, item.file),
    } as any)
  }
}
const logoUrl = 'https://www.giuntispa.com/wp-content/uploads/2017/12/Valducci-logo-Giunti.jpg'
let logo = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: logoUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
if (!logo) logo = await payload.create({
  collection: 'media', overrideAccess: true,
  data: { alt: 'Valducci és Giunti logó', sourceUrl: logoUrl, credit: 'Giunti S.p.A. hivatalos Valducci márkaoldala' },
  filePath: path.join(root, 'public/images/valducci/valducci-giunti-logo.jpg'),
} as any)

await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: {
  name: 'Csévélődobos öntözőgépek',
  description: 'Szállítható, tömlődobos öntözőgépek többféle vázzal és tömlőméret-változattal.',
} as any })
await payload.update({ collection: 'manufacturers', id: manufacturer.id, overrideAccess: true, data: {
  description: 'A Valducci Irromotor önjáró csévélődobos öntözőgépeket, továbbá szűrő- és rögzített öntözőrendszer-elemeket kínál.',
  logo: logo.id,
  sourceUrl: officialPage,
  reviewNote: 'A márkakínálat és a Giunti-csoporthoz tartozás a hivatalos Valducci márkaoldalon; az Irromotor modellek és méretek a hivatkozott gyártói katalógusban ellenőrizve.',
} as any })

const familySlug = 'valducci-irromotor'
let family = (await payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const overviewSections = [
  { heading: 'New Mini a kisebb területekhez', body: 'A New Mini önjáró mikrogépek kertek, parkok, rekreációs és sportterületek öntözésére készültek. Kis méretüket egyszerű, precíz működés egészíti ki.', image: media.newMini50.id, imageAlt: 'Valducci Irromotor New Mini 50/150 csévélődob' },
  { heading: 'V sorozat a többféle mérettartományhoz', body: 'A V0–V2 sorozat egyszerű, gazdaságos kialakítású: a V0 egyfokozatú, a V1 és V2 háromfokozatú hajtóművel szerepel a katalógusban. A V3–V6 sorozat négyfokozatú hajtóművet használ; a V6 dobját mindkét oldalon fogaskoszorú hajtja.', image: media.vSeries.id, imageAlt: 'Valducci Irromotor V sorozatú öntözőgép' },
  { heading: 'Vi hidraulikus sorozat', body: 'A Vi4–Vi9 modellek hidraulikus mozgatást alkalmaznak. A Vi8 és Vi9 kompresszorral segíti a tömlő kiürítését az öntözés végén; a Vi9 dobját két fogaskoszorú hajtja.', image: media.viSeries.id, imageAlt: 'Valducci Irromotor Vi hidraulikus öntözőgép' },
]
const familyData = {
  name: 'Valducci Irromotor', slug: familySlug, category: category.id, manufacturer: manufacturer.id,
  sortOrder: 50, summary: 'Valducci önjáró csévélődobos öntözőgépek New Mini, V és Vi sorozatokkal.',
  image: media.vSeries.id, cardLogo: logo.id, cardTitle: 'Irromotor',
  cardDescription: 'Önjáró csévélődobos gépek kisebb és nagyobb öntözési területekre.',
  overviewTitle: 'Valducci Irromotor öntözőgépek',
  overviewIntro: 'Az Irromotor termékcsalád különböző méretű csévélődobos gépeket foglal magában: a kompakt New Mini modellektől a V és hidraulikus Vi sorozatokig.',
  overviewSections,
  sourceDetails: 'A New Mini, V és Vi sorozatok, valamint a bemutatott modell- és méretváltozatok a Valducci Irromotor termékkatalógusában szerepelnek.',
  sourceUrl: officialPage, status: 'published',
}
family = family
  ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData as any })
  : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })

const richText = (paragraphs: string[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map(text => ({
    type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
  })) },
})
const sizeTable = (title: string, rows: Array<[string, string, string]>) => ({
  title, column1: 'Modell', column2: 'Csőátmérő (mm)', column3: 'Tömlőhossz (m)',
  rows: rows.map(([model, diameter, length]) => ({ cell1: model, cell2: diameter, cell3: length })),
})
const parseRows = (groups: Record<string, string[]>) => Object.entries(groups).flatMap(([model, sizes]) => sizes.map(size => {
  const [diameter, length] = size.split('x')
  return [model, diameter, length] as [string, string, string]
}))
const products = [
  {
    slug: 'valducci-irromotor-new-mini', name: 'Valducci Irromotor New Mini', sortOrder: 10,
    image: media.newMini40, gallery: [media.newMini40, media.newMini50],
    summary: 'Kompakt, önjáró mikrogép kertek, parkok és sportterületek öntözésére.',
    description: richText(['A Valducci Irromotor New Mini önjáró mikrogép kertek, parkok, rekreációs területek és sportpályák öntözésére készült. Kompakt mérete mellett egyszerű kezelést és precíz, professzionális működést kínál.']),
    technicalTables: [sizeTable('Katalógusban szereplő modellek', [['New Mini 40/125', '40', '125'], ['New Mini 50/150', '50', '150']])],
  },
  {
    slug: 'valducci-irromotor-v-sorozat', name: 'Valducci Irromotor V sorozat', sortOrder: 20,
    image: media.vSeries, gallery: [media.vSeries],
    summary: 'V0–V6 csévélődobos öntözőgépek többféle csőátmérővel és tömlőhosszal.',
    description: richText(['A Valducci Irromotor V sorozat többféle méretű, önjáró csévélődobos öntözőgépet foglal magában. A V0 egyfokozatú, a V1 és V2 háromfokozatú hajtóművel szerepel a gyártói katalógusban. A V3, V4, V5, V5S és V6 négyfokozatú hajtóművel készül; a V6 dobját két, a dob két oldalán elhelyezett fogaskoszorú hajtja.']),
    technicalTables: [sizeTable('V sorozat – csőátmérő és tömlőhossz', parseRows({
      V0: ['50x240','63x220','63x200'],
      V1: ['63x250','63x280','63x300','75x200'],
      V2: ['75x300','75x320','82x300','90x220','82x220','90x240','82x250'],
      V3: ['75x340','75x400','82x320','82x360','82x400','90x260','90x300','90x350','100x210','100x250','100x270','100x300','110x200'],
      V4: ['82x400','90x350','90x380','90x400','90x440','100x320','100x350','100x400','110x270','110x300','110x340','125x220'],
      V5: ['100x450','100x500','100x550','110x400','110x450','110x500','110x540','125x300','125x340','125x380','125x400'],
      V5S: ['110x560','110x600','125x420','125x450','140x320','140x350'],
      V6: ['110x600','110x650','125x450','125x500','140x350','140x400'],
    }))],
  },
  {
    slug: 'valducci-irromotor-vi-sorozat', name: 'Valducci Irromotor Vi hidraulikus sorozat', sortOrder: 30,
    image: media.viSeries, gallery: [media.viSeries],
    summary: 'Vi4–Vi9 hidraulikusan mozgatott csévélődobos öntözőgépek.',
    description: richText(['A Valducci Irromotor Vi sorozat gépei a gyártói katalógus szerint hidraulikus mozgatást használnak, így a kezelés a gép méretétől függetlenül egyszerű. A Vi8 és Vi9 kompresszorral üríti ki a tömlőt az öntözés végén; a Vi9 dobhajtását két fogaskoszorú adja.']),
    technicalTables: [sizeTable('Vi sorozat – csőátmérő és tömlőhossz', parseRows({
      Vi4: ['82x400','82x420','90x350','90x380','90x400','90x440','100x320','100x350','100x400','110x270','110x300','110x340','125x220'],
      Vi5: ['100x450','100x500','100x550','110x400','110x450','110x500','110x540','125x300','125x340','125x400','140x300'],
      Vi6: ['110x560','110x600','125x420','125x450','140x320','140x350'],
      Vi7: ['110x600','110x650','125x450','125x500','140x350','140x400'],
      Vi8: ['125x550','125x600','125x650','140x450','140x500'],
      Vi9: ['125x650','125x700','140x500','140x550','140x600'],
    }))],
  },
]

for (const item of products) {
  const existing = (await payload.find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const data = {
    ...item, manufacturer: manufacturer.id, brand: 'Valducci', family: family.id, category: category.id,
    productKind: 'model', reviewState: 'ready', reviewNote: 'A modellcsoportokat és a táblázatokban szereplő méretváltozatokat a Valducci Irromotor prospektus alapján ellenőriztem.',
    cardDescription: item.summary, cardImage: item.image.id, image: item.image.id,
    gallery: item.gallery.map((photo: any) => photo.id), documents: [media.catalog.id],
    sourceUrl: catalogUrl,
    sourceDetails: 'A gyártói Valducci márkaoldal és az Irromotor katalógus tartalma. A mérettáblázat katalógusadat, nem aktuális készlet- vagy rendelhetőségi ígéret.',
    sourceEvidence: [
      { url: officialPage, note: 'A Valducci márkaoldal Irromotor gépcsaládja és termékkatalógusának hivatkozása.' },
      { url: catalogUrl, note: 'Hivatalos Irromotor prospektus; a sorozatleírások, képek és méretváltozatok forrása.', media: media.catalog.id },
    ],
    status: 'published', showInFamily: true,
  }
  if (existing) await payload.update({ collection: 'products', id: existing.id, overrideAccess: true, data: data as any })
  else await payload.create({ collection: 'products', overrideAccess: true, data: data as any })
}

console.log(JSON.stringify({ category: category.name, family: family.name, products: products.map(item => item.name), catalog: media.catalog.filename }, null, 2))
await payload.destroy()
