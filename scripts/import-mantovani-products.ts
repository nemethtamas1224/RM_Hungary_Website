import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const overview = 'https://www.mantovanisrl.it/'
const sources = {
  idrojet: 'https://www.mantovanisrl.it/irroratrice-semovente-a-carreggiata-variabile-idrojet-125/',
  sprayer1400: 'https://www.mantovanisrl.it/novita-irroratrice-per-tabacco-mais-e-altre-colture/',
  fm156c: 'https://www.mantovanisrl.it/raccoglitrice-trainata-con-guida-automatica-fm-156c/',
}

const maker: any = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'mantovani' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!maker) throw new Error('A Mantovani gyártórekord nem található.')
await payload.update({ collection: 'manufacturers', id: maker.id, overrideAccess: true, data: {
  description: 'A Mantovani Srl mezőgazdasági gépeket gyárt. Hivatalos oldala dohánybetakarító gépeket, valamint dohányhoz, kukoricához és más kultúrákhoz kínált permetezőket mutat be.',
  sourceUrl: overview,
  reviewNote: 'A gyártóazonosság és a dohánygépek/permetezők köre a Bovolone-i Mantovani Srl hivatalos nyitóoldalán ellenőrizve; ne keverd össze más, hasonló nevű gyártókkal.',
} as any })

const assets = [
  { key: 'idrojet', file: 'idrojet-125.jpg', url: 'https://www.mantovanisrl.it/wp-content/uploads/2014/08/idrojet-125_1.jpg', alt: 'Mantovani IDROJET 125 önjáró, változtatható nyomtávú permetezőgép' },
  { key: 'sprayer1400', file: 'irroratrice-1400vv.jpg', url: 'https://www.mantovanisrl.it/wp-content/uploads/2016/06/IRRORATRICE-1400VV.jpg', alt: 'Mantovani 1400 VV permetezőgép dohány-, kukorica- és más kultúrákhoz' },
  { key: 'fm156c', file: 'fm-156c.jpg', url: 'https://www.mantovanisrl.it/wp-content/uploads/2014/03/fm156c.jpg', alt: 'Mantovani FM 156/C vontatott dohánybetakarító gép' },
]
const media: Record<string, any> = {}
for (const asset of assets) {
  const found: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: asset.url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  media[asset.key] = found || await payload.create({
    collection: 'media', overrideAccess: true,
    data: { alt: asset.alt, sourceUrl: asset.url, credit: 'Mantovani Srl hivatalos gyártói oldala' },
    filePath: path.join(root, 'public/images/mantovani', asset.file),
  } as any)
}

const familyDefs = [
  { key: 'sprayers', name: 'Mantovani permetezőgépek', slug: 'mantovani-permetezogepek', categorySlug: 'permetezogepek', summary: 'Önjáró és vontatott permetezőgépek dohányhoz, kukoricához és más kultúrákhoz.', image: media.sprayer1400, source: overview },
  { key: 'harvesters', name: 'Mantovani dohánybetakarító gépek', slug: 'mantovani-dohanybetakaritok', categorySlug: 'dohanybetakaritas', summary: 'Dohánybetakarító gépek kézi vagy automatizált munkavégzéshez.', image: media.fm156c, source: overview },
]
const families: Record<string, any> = {}
for (const def of familyDefs) {
  const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: def.categorySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!category) throw new Error(`A kategória nem található: ${def.categorySlug}`)
  const data = {
    name: def.name, slug: def.slug, summary: def.summary, category: category.id, manufacturer: maker.id,
    image: def.image.id, sourceUrl: def.source,
    sourceDetails: 'A családot az RM Hungary Mantovani kategóriamegnevezései és a Mantovani Srl hivatalos oldala támasztja alá.',
    reviewNote: 'A családhoz csak a gyártói oldalon egyértelműen azonosított Mantovani gépek tartoznak.', status: 'published',
  }
  families[def.key] = (await payload.find({ collection: 'product-families', where: { slug: { equals: def.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  families[def.key] = families[def.key]
    ? await payload.update({ collection: 'product-families', id: families[def.key].id, overrideAccess: true, data: data as any })
    : await payload.create({ collection: 'product-families', overrideAccess: true, data: data as any })
}

const richText = (paragraph: string) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: paragraph, version: 1 }] }] } })
const products = [
  { name: 'Mantovani IDROJET 125', slug: 'mantovani-idrojet-125', code: 'IDROJET 125', category: 'permetezogepek', family: 'sprayers', summary: 'Változtatható nyomtávú, önjáró permetezőgép.', description: 'A Mantovani IDROJET 125 önjáró permetezőgépet változtatható nyomtávú kivitelben mutatja be a gyártó.', image: media.idrojet, source: sources.idrojet },
  { name: 'Mantovani 1400 VV', slug: 'mantovani-1400-vv', code: '1400 VV', category: 'permetezogepek', family: 'sprayers', summary: 'Permetezőgép dohány-, kukorica- és más kultúrák kezelésére.', description: 'A Mantovani 1400 VV permetezőgépet a gyártó dohány, kukorica és más kultúrák kezelésére mutatja be.', image: media.sprayer1400, source: sources.sprayer1400 },
  { name: 'Mantovani FM 156/C', slug: 'mantovani-fm-156-c', code: 'FM 156/C', category: 'dohanybetakaritas', family: 'harvesters', summary: 'Vontatott dohánybetakarító automatikus sorvezetővel.', description: 'A Mantovani FM 156/C vontatott dohánybetakarító automatikus sorvezetővel készül.', image: media.fm156c, source: sources.fm156c },
]
for (const item of products) {
  const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: item.category } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!category) throw new Error(`A termékkategória nem található: ${item.category}`)
  const data = {
    name: item.name, slug: item.slug, modelCode: item.code, productKind: 'model', category: category.id,
    family: families[item.family].id, manufacturer: maker.id, brand: 'Mantovani', status: 'published', reviewState: 'specs-missing',
    summary: item.summary, description: richText(item.description), image: item.image.id, gallery: [item.image.id],
    originalUrl: item.source,
    sourceDetails: 'A termék neve, rövid terméktípusa és fotója a Mantovani Srl hivatalos weboldaláról származik. A közvetlen gyártói cikk jelenleg 404-es; nem közöltünk nem ellenőrizhető műszaki adatot.',
    sourceEvidence: [
      { url: overview, note: 'A hivatalos Mantovani nyitóoldal termékajánlója azonosítja a típust és rövid megnevezését.' },
      { url: assets.find((asset) => asset.key === (item.image === media.idrojet ? 'idrojet' : item.image === media.sprayer1400 ? 'sprayer1400' : 'fm156c'))!.url, note: 'A Mantovani hivatalos weboldalán közölt, a termékhez közvetlenül rendelt fotó.', media: item.image.id },
    ],
    reviewNote: 'A típus és kép azonosított; az egyedi gyártói oldal nem elérhető, ezért műszaki specifikáció nincs feltöltve.',
  }
  const previous: any = (await payload.find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const saved = previous
    ? await payload.update({ collection: 'products', id: previous.id, overrideAccess: true, data: data as any })
    : await payload.create({ collection: 'products', overrideAccess: true, data: data as any })
  console.log(`Mantovani ${item.code}: ${saved.id}`)
}
await payload.destroy()
