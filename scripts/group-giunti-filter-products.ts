import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const familySlug = 'giunti-szuro-rendszerek'
const productSlugs = [
  'automata-szuroallomas',
  'kvarchomokos-kozegszuro',
  'acelbetetes-halos-szuro',
  'homokszuro-hidrociklon',
]
const sourceUrl = 'https://www.giuntispa.com/product-category/filtering-stations/'
const payload = await getPayload({ config })

try {
  const [manufacturerResult, categoryResult, familyResult, productsResult] = await Promise.all([
    payload.find({ collection: 'manufacturers', where: { slug: { equals: 'giunti' } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'categories', where: { slug: { equals: 'vizszurok' } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'products', where: { slug: { in: productSlugs } }, limit: 20, depth: 1, overrideAccess: true }),
  ])
  const manufacturer = manufacturerResult.docs[0]
  const category = categoryResult.docs[0]
  const family = familyResult.docs[0]
  const products = productsResult.docs as any[]
  if (!manufacturer || !category || products.length !== productSlugs.length) {
    throw new Error('A Giunti gyártó, vízszűrő kategória vagy a négy ellenőrzött szűrőtermék hiányzik.')
  }
  if (products.some((product) => product.category?.id !== category.id || product.manufacturer?.id !== manufacturer.id)) {
    throw new Error('A termékek márka- vagy kategóriakapcsolata eltér a várt értéktől.')
  }
  const representative = products.find((product) => product.slug === 'kvarchomokos-kozegszuro')
  if (!representative?.image?.id) throw new Error('A családkártyához nem található hiteles szűrőkép.')

  const familyData = {
    name: 'Giunti szűrőrendszerek',
    slug: familySlug,
    manufacturer: manufacturer.id,
    category: category.id,
    sortOrder: 20,
    status: 'published',
    summary: 'Hálós, kvarchomokos és hidrociklonos megoldások az öntözővíz szűrésére.',
    image: representative.image.id,
    cardTitle: 'Giunti szűrőrendszerek',
    cardDescription: 'Hálós, kvarchomokos és hidrociklonos öntözővíz-szűrés.',
    overviewTitle: 'Giunti öntözővíz-szűrő rendszerek',
    overviewIntro: 'A megfelelő szűrő kiválasztásánál a vízforrást, az öntözéshez szükséges vízmennyiséget és az üzemi nyomást kell figyelembe venni. A szűrési kapacitás a választott modelltől függ.',
    overviewSections: [{
      heading: 'Többféle szűrési technológia',
      body: 'A kínálatban hálós és kvarchomokos szűrők, hidrociklonos homokleválasztók, valamint kézi és automatikus visszamosású berendezések szerepelnek. Egyes szűrőrendszerek tápoldatozással is használhatók.',
      image: representative.image.id,
      imageAlt: 'Giunti kvarchomokos öntözővíz-szűrő',
    }],
    sourceDetails: 'A család a Giunti hivatalos szűrőállomás-kategóriájában bemutatott öntözővíz-szűrési megoldásokat fogja össze. A négy meglévő helyi rekord megnevezése és modellazonossága változatlan.',
    sourceUrl,
  }
  const existing = Boolean(family)
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    family: family?.id ? { id: family.id, slug: familySlug, action: 'update' } : { slug: familySlug, action: 'create' },
    category: { id: category.id, name: category.name },
    products: products.map((product) => ({ id: product.id, name: product.name, previousFamily: product.family?.name ?? null })),
    sourceUrl,
  }, null, 2))
  if (apply) {
    const savedFamily = existing
      ? await payload.update({ collection: 'product-families', id: family!.id, data: familyData as any, overrideAccess: true })
      : await payload.create({ collection: 'product-families', data: familyData as any, overrideAccess: true })
    for (const product of products) {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: { family: savedFamily.id, showInFamily: true } as any,
        overrideAccess: true,
      })
    }
    console.log(`Kész: ${savedFamily.name}; ${products.length} termék a családhoz kapcsolva.`)
  }
} finally {
  await payload.destroy()
}
