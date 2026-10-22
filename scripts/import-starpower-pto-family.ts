import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
try {
  const sourceUrl = 'https://starpower.it/gruppi_cardano.asp'
  const category = (await payload.find({ collection: 'categories', where: { slug: { equals: 'traktorhajtasu-aramfejlesztok' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'starpower' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const image = (await payload.find({ collection: 'media', where: { id: { equals: 585 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const logo = (await payload.find({ collection: 'media', where: { id: { equals: 9 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!category || !manufacturer || !image || !logo) throw new Error('Required Starpower category or media is missing')

  const familyData = {
    name: 'Starpower kardánhajtású áramfejlesztők',
    slug: 'starpower-pto-generators',
    category: category.id,
    sortOrder: 20,
    summary: 'Traktorhoz kapcsolható Starpower áramfejlesztők mezőgazdasági, hálózattól független vagy tartalék energiaellátáshoz.',
    image: image.id,
    cardLogo: logo.id,
    cardTitle: 'Starpower kardánhajtású generátorok',
    cardDescription: 'GTS és GTE traktorhoz kapcsolható áramfejlesztők mezőgazdasági használatra.',
    manufacturer: manufacturer.id,
    status: 'published',
    sourceDetails: 'A Starpower hivatalos oldala a GTS és GTE sorozatot traktor kardánhajtásához készült mezőgazdasági generátorként mutatja be.',
    sourceUrl,
    reviewNote: 'A GTS és GTE családkapcsolat, a 10–80 kVA közös teljesítménytartomány és a 400/230 V, háromfázisú, 50 Hz kimenet a gyártói oldalon ellenőrizve.',
  }

  let family = (await payload.find({ collection: 'product-families', where: { slug: { equals: familyData.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (family) {
    family = await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData as any })
  } else {
    family = await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData as any })
  }

  for (const slug of ['starpower-gts', 'starpower-gte']) {
    const product = (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
    if (!product) throw new Error(`Missing Starpower series: ${slug}`)
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { family: family.id, category: category.id, status: 'published' } as any })
  }
  console.log(`Starpower GTS/GTE family ready: ${family.id}`)
} finally {
  await payload.destroy()
}
