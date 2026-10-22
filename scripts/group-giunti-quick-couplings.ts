import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const familySlug = 'giunti-gyorscsatlakozok'
const productSlugs = ['bauer-fejes-idom', 'mellini-fejes-idom', 'anfor-fejes-idom', 'ferrari-gombcsatlakozo']
const sourceUrl = 'https://www.giuntispa.com/product-category/tubazioni-in-acciaio-zincato/'
const payload = await getPayload({ config })

try {
  const [manufacturerResult, categoryResult, familyResult, mediaResult, productsResult] = await Promise.all([
    payload.find({ collection: 'manufacturers', where: { slug: { equals: 'giunti' } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'categories', where: { slug: { equals: 'gyorscsatlakozok-idomok' } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'media', where: { filename: { equals: 'pipe-robur.jpg' } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'products', where: { slug: { in: productSlugs } }, limit: 20, depth: 1, overrideAccess: true }),
  ])
  const manufacturer = manufacturerResult.docs[0]
  const category = categoryResult.docs[0]
  const family = familyResult.docs[0]
  const image = mediaResult.docs[0]
  const products = productsResult.docs as any[]
  if (!manufacturer || !category || !image || products.length !== productSlugs.length) {
    throw new Error('A Giunti gyártó, kategória, családkép vagy a négy ellenőrzött csatlakozótermék hiányzik.')
  }
  if (products.some((product) => product.category?.id !== category.id || product.manufacturer?.id !== manufacturer.id)) {
    throw new Error('A kiválasztott termékek márka- vagy kategóriakapcsolata eltér a várt értéktől.')
  }
  if (products.some((product) => product.family?.id && product.family.id !== family?.id)) {
    throw new Error('Legalább egy termék már másik családhoz tartozik; az automatikus átsorolást megszakítottam.')
  }

  const familyData = {
    name: 'Giunti gyorscsatlakozók',
    slug: familySlug,
    manufacturer: manufacturer.id,
    category: category.id,
    sortOrder: 20,
    status: 'published',
    summary: 'Bauer, Ferrari, Anfor és Robur gyorscsatlakozós csőrendszerek öntözési és vízszállítási felhasználásra.',
    image: image.id,
    cardTitle: 'Giunti gyorscsatlakozók',
    cardDescription: 'Többféle gyorscsatlakozó a horganyzott acélcsőhálózatokhoz.',
    overviewTitle: 'Giunti gyorscsatlakozós csőrendszerek',
    overviewIntro: 'A Giunti horganyzott acélcső-kínálata többféle gyorscsatlakozóval készül. A csatlakozás kiválasztását a felhasználás és az üzemi nyomás határozza meg.',
    overviewSections: [{
      heading: 'Eltérő csatlakozási megoldások',
      body: 'A gyártó Anfor, Robur, Ferrari és Bauer típusú csatlakozású csöveket mutat be. A korábbi Mellini megnevezés a mai Robur rendszer elődjére utal. A helyi termékoldalakon a meglévő elnevezések megmaradtak.',
      image: image.id,
      imageAlt: 'Giunti Robur gyorscsatlakozós horganyzott acélcső',
    }],
    sourceDetails: 'A családkártya a Giunti horganyzott acélcsövekről szóló hivatalos kategóriaoldal és a Robur termékoldal alapján készült. A gyártó Anfor, Robur, Ferrari és Bauer csatlakozású csöveket sorol fel; a Mellini név történeti kapcsolatát a Robur termékoldala írja le. A helyi termékneveket, adatlapokat és URL-eket nem módosítjuk.',
    sourceUrl,
  }
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    family: family?.id ? { id: family.id, slug: familySlug, action: 'update' } : { slug: familySlug, action: 'create' },
    category: { id: category.id, name: category.name },
    image: { id: image.id, filename: image.filename },
    products: products.map((product) => ({ id: product.id, name: product.name, previousFamily: product.family?.name ?? null, previousSlug: product.slug })),
    sourceUrl,
  }, null, 2))
  if (apply) {
    const savedFamily = family
      ? await payload.update({ collection: 'product-families', id: family.id, data: familyData as any, overrideAccess: true })
      : await payload.create({ collection: 'product-families', data: familyData as any, overrideAccess: true })
    for (const product of products) {
      await payload.update({ collection: 'products', id: product.id, data: { family: savedFamily.id, showInFamily: true } as any, overrideAccess: true })
    }
    console.log(`Kész: ${savedFamily.name}; ${products.length} termék a családhoz kapcsolva.`)
  }
} finally {
  await payload.destroy()
}
