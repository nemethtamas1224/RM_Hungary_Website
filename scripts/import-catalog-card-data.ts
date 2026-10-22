import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const idOf = (value: any) => String(typeof value === 'object' && value ? value.id : value || '')
const mediaDocs = (await payload.find({ collection: 'media', limit: 2000, depth: 0, overrideAccess: true })).docs as any[]
const mediaByBasename = new Map<string, any>()
for (const doc of mediaDocs) {
  const filename = String(doc.filename || '').replace(/^.*?-/, '')
  if (filename && !mediaByBasename.has(filename)) mediaByBasename.set(filename, doc)
}

async function media(file: string, alt: string, credit = 'RM Hajdú Hungary termékkatalógusa') {
  const normalized = file.replace(/^public\//, '')
  const basename = path.basename(file)
  let doc = mediaByBasename.get(basename)
  if (doc) return doc
  const sourceUrl = `local:catalog-card:${normalized}`
  doc = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!doc) {
    doc = await payload.create({
      collection: 'media', overrideAccess: true,
      data: { alt, sourceUrl, credit },
      filePath: path.join(root, file),
    } as any)
  }
  mediaByBasename.set(basename, doc)
  return doc
}

const families = (await payload.find({ collection: 'product-families', limit: 200, depth: 1, overrideAccess: true })).docs as any[]
const familyBySlug = new Map(families.map(item => [item.slug, item]))
const familyCards: Record<string, { image?: string; logo: string; alt: string; title: string; description: string }> = {
  'rm-gx': { image: 'public/images/rm-families/gx.png', logo: 'public/images/rm-families/gx-logo.png', alt: 'RM GX forgó tornyos csévélődob', title: 'RM GX', description: 'Forgó torony szerkezetű dob' },
  'rm-xj': { image: 'public/images/rm-families/xj.png', logo: 'public/images/rm-families/xj-logo.png', alt: 'RM JX talajra támaszkodó csévélődob', title: 'RM JX', description: 'Földre támaszkodó dob' },
  'rm-xjm': { image: 'public/images/rm-families/xjm.png', logo: 'public/images/rm-families/xjm-logo.png', alt: 'RM XJM beépített motoros csévélődob', title: 'RM XJM', description: 'Beépített motorral rendelkező dob' },
  'rm-magnum': { image: 'public/images/rm-families/fx.png', logo: 'public/images/rm-families/fx-logo-current.png', alt: 'RM FX fix vázas csévélődob', title: 'RM FX', description: 'Fix vázas dob' },
  'rm-szivattyuegysegek': { logo: 'public/images/rm-mop/LogoMOP.png', alt: 'RM MOP motoros szivattyúegységek', title: 'RM Motoros szivattyúegységek', description: 'Motoros szivattyúegységek' },
  'starpower-szivattyuegysegek': { logo: 'public/images/manufacturers/starpower.png', alt: 'Starpower motoros szivattyúegységek', title: 'Starpower motoros szivattyúegységek', description: 'Motoros szivattyúegységek' },
}
const familySortOrder: Record<string, number> = { 'rm-gx': 10, 'rm-xj': 20, 'rm-xjm': 30, 'rm-magnum': 40, 'rm-szivattyuegysegek': 10, 'starpower-szivattyuegysegek': 20 }
let familyCount = 0
for (const [slug, card] of Object.entries(familyCards)) {
  const family = familyBySlug.get(slug)
  if (!family) throw new Error(`Missing product family: ${slug}`)
  const image = card.image ? await media(card.image, card.alt) : undefined
  const logo = await media(card.logo, `${card.title} logó`)
  await payload.update({
    collection: 'product-families', id: family.id, overrideAccess: true,
    data: {
      ...(image ? { image: image.id } : {}),
      cardLogo: logo.id,
      cardTitle: card.title,
      cardDescription: card.description,
      sortOrder: familySortOrder[slug],
    } as any,
  })
  familyCount++
}

const products = (await payload.find({ collection: 'products', limit: 1000, depth: 1, overrideAccess: true })).docs as any[]
const productBySlug = new Map(products.map(item => [item.slug, item]))
const wingCards: Record<string, { photo: string; description: string }> = {
  albatros: { photo: 'albatros_1_2_853x387.jpg', description: 'Kíméletes öntözés alacsony nyomáson.\nSzárnyhossz: 72 és 95 m.' },
  falcon: { photo: 'falcon_1_2_853x387.jpg', description: 'Önszintező szárny alacsony és közepes kultúrákhoz.\nSzárnyhossz: 55, 60 és 65 m.' },
  boom: { photo: 'boom_1_2_853x387.jpg', description: 'Egyenletes öntözés változatos terepviszonyok között.\nSzárnyhossz: 60 m, 360°-os elfordulással.' },
  liquo: { photo: 'liqu_1_2_853x387.jpg', description: 'Hígtrágya és digestátum elosztásához.\nSzárnyhossz: 30 m, alacsony nyomáson.' },
  condor: { photo: 'condor_1_2_853x387.jpg', description: 'RM Condor öntözőszárny.' },
}
let wingCount = 0
for (const [slug, card] of Object.entries(wingCards)) {
  const product = productBySlug.get(slug)
  if (!product) throw new Error(`Missing wing product: ${slug}`)
  const cardImage = await media(`public/images/rm-products/${card.photo}`, `${product.name} öntözőszárny termékkép`)
  const cardLogo = product.image && typeof product.image === 'object' ? product.image : undefined
  await payload.update({
    collection: 'products', id: product.id, overrideAccess: true,
    data: { cardImage: cardImage.id, ...(cardLogo ? { cardLogo: cardLogo.id } : {}), cardDescription: card.description, sortOrder: ['albatros', 'falcon', 'boom', 'liquo', 'condor'].indexOf(slug) * 10 + 10 } as any,
  })
  wingCount++
}

const pumpProducts: Record<string, { image: string; description: string }> = {
  'rm-motoros-szivattyuegyseg': { image: 'public/images/rm-motor-pump.jpeg', description: 'RM MOP motoros szivattyúegység.' },
  'starpower-motoros-szivattyuegyseg': { image: 'public/images/starpower/motor-pump.jpg', description: 'Starpower motoros szivattyúegység.' },
}
for (const [slug, card] of Object.entries(pumpProducts)) {
  const product = productBySlug.get(slug)
  if (!product) throw new Error(`Missing pump product: ${slug}`)
  const cardImage = await media(card.image, `${product.name} termékkép`)
  await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { cardImage: cardImage.id, cardDescription: card.description } as any })
}

const cardSizes: Record<string, string> = {
  'rm-magnum-giant':'125/900, 135/730, 140/700, 150/660, 160/500, 180/400',
  'rm-major-evo':'120/730, 125/650, 135/550, 140/530, 150/490, 160/380',
  'rm-900-xj-evo':'110/700, 120/600, 125/580, 135/550, 140/520, 150/400, 160/380',
  'rm-840-xj':'100/680, 110/600, 120/540, 125/520, 135/480, 140/390, 150/350',
  'rm-800-xj':'100/600, 110/570, 120/440, 125/420, 135/390, 140/300, 150/280',
  'rm-700-xj':'100/500, 110/480, 120/370, 125/350',
  'rm-600-xj':'90/520, 100/470, 110/380, 120/320, 125/300',
  'rm-giant-xjm':'125/900, 135/730, 140/700, 150/660, 160/500, 180/400',
  'rm-major-xjm':'120/730, 125/650, 135/550, 140/530, 150/490, 160/380',
  'rm-900-xjm':'110/700, 120/600, 125/580, 135/550, 140/520, 150/400, 160/380',
  'rm-840-xjm':'110/600, 120/540, 125/520, 135/470, 140/450, 150/350',
  'rm-700-xjm':'100/500, 110/480, 120/370, 125/350',
  'rm-magnum-fx':'120/800, 125/750, 135/630, 140/600, 150/530, 160/430',
  'rm-900-fx':'120/770, 125/720, 135/600, 140/580, 150/500, 160/400',
}
const sourceForSlug = (slug: string) => slug.endsWith('-xjm') || slug.includes('xjm')
  ? 'https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/con-motore-incorporato/'
  : slug.endsWith('-fx') || slug.includes('-fx')
    ? 'https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/a-telaio-fisso/'
    : 'https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/appoggiati-a-terra-mod.-xj/'
let variantsCount = 0
for (const [slug, value] of Object.entries(cardSizes)) {
  const product = productBySlug.get(slug)
  if (!product) throw new Error(`Missing size card product: ${slug}`)
  const hoseSizes = value.split(', ').map(pair => {
    const [diameterMm, lengthM] = pair.split('/').map(Number)
    return { diameterMm, lengthM }
  })
  const existing = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
  const url = sourceForSlug(slug)
  const sourceEvidence = existing.some((entry: any) => entry.url === url)
    ? existing
    : [...existing, { url, note: 'A gyártói családkategória termékkártyáján közölt csőátmérő és maximális tömlőhossz. Külön kártyaadatként kezelendő.' }]
  await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { cardHoseSizes: hoseSizes, sourceEvidence } as any })
  variantsCount++
}

const reelFamilies = ['rm-gx', 'rm-xj', 'rm-xjm', 'rm-magnum']
const visibleReelModels: Record<string, string[]> = {
  'rm-gx': ['rm-540-gx', 'rm-560-gx', 'rm-570-gx-evo', 'rm-581-gx-evo', 'rm-690-gx-evo', 'rm-790-gx', 'rm-890-gx', 'rm-990-gx', 'rm-1100-gx'],
  'rm-xj': ['rm-magnum-giant', 'rm-major-evo', 'rm-900-xj-evo', 'rm-840-xj', 'rm-800-xj', 'rm-700-xj', 'rm-600-xj'],
  'rm-xjm': ['rm-giant-xjm', 'rm-major-xjm', 'rm-900-xjm', 'rm-840-xjm', 'rm-700-xjm'],
  'rm-magnum': ['rm-magnum-fx', 'rm-900-fx'],
}
for (const slug of reelFamilies) {
  const family = familyBySlug.get(slug)
  const models = products.filter(product => product.status === 'published' && idOf(product.family) === String(family?.id))
  for (const product of models) {
    const cardHoseSizes = cardSizes[product.slug]
      ? cardSizes[product.slug].split(', ').map(pair => { const [diameterMm, lengthM] = pair.split('/').map(Number); return { diameterMm, lengthM } })
      : Array.isArray(product.hoseSizes) ? product.hoseSizes.map((size: any) => ({ diameterMm: size.diameterMm, lengthM: size.lengthM })) : []
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { cardHoseSizes, showInFamily: visibleReelModels[slug].includes(product.slug) } as any })
  }
  models.sort((a, b) => {
    const num = (item: any) => Number(String(item.name).match(/\d+/)?.[0] || Infinity)
    const diff = num(a) - num(b)
    return Number.isFinite(diff) && diff !== 0 ? diff : String(a.name).localeCompare(String(b.name), 'hu')
  })
  for (let index = 0; index < models.length; index++) {
    await payload.update({ collection: 'products', id: models[index].id, overrideAccess: true, data: { sortOrder: (index + 1) * 10 } as any })
  }
}

console.log(JSON.stringify({ familyCards: familyCount, wingCards: wingCount, pumpCards: Object.keys(pumpProducts).length, cardVariantLists: variantsCount }, null, 2))
await payload.destroy()
