import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

const source = {
  electric: 'https://www.starpower.it/gruppi_elettropompe.asp',
  clutch: 'https://www.starpower.it/gruppi_motofrizione.asp',
  apollo: 'https://www.starpower.it/apollo.asp',
}
const mediaItems = [
  { file: 'electric-pump-set.jpg', url: 'https://www.starpower.it/images/prodotti/gruppi_elettropompe/foto_elettropompe01.jpg', alt: 'Starpower elektromos szivattyúegység', credit: 'Starpower hivatalos elektromos szivattyúegység-oldala' },
  { file: 'electric-pump-range.jpg', url: 'https://www.starpower.it/images/prodotti/gruppi_elettropompe/gruppi_elettropompe01.jpg', alt: 'Starpower elektromos szivattyúegységek', credit: 'Starpower hivatalos elektromos szivattyúegység-oldala' },
  { file: 'motor-clutch-set-01.jpg', url: 'https://www.starpower.it/images/prodotti/gruppi_motofrizione/foto_motofrizione01.jpg', alt: 'Starpower motoros kuplungegység', credit: 'Starpower hivatalos motoros kuplungegység-oldala' },
  { file: 'motor-clutch-set-02.jpg', url: 'https://www.starpower.it/images/prodotti/gruppi_motofrizione/foto_motofrizione02.jpg', alt: 'Starpower motoros kuplungegység másik kivitelben', credit: 'Starpower hivatalos motoros kuplungegység-oldala' },
  { file: 'motor-clutch-range.jpg', url: 'https://www.starpower.it/images/prodotti/gruppi_motofrizione/gruppi_motofrizione01.jpg', alt: 'Starpower motoros kuplungegység alkalmazási példa', credit: 'Starpower hivatalos motoros kuplungegység-oldala' },
] as const
const families = [
  {
    slug: 'starpower-elektromos-szivattyuegysegek', name: 'Starpower elektromos szivattyúegységek', categorySlug: 'egyeb-szivattyuk', order: 30,
    productSlug: 'starpower-elektromos-szivattyuegysegek', productName: 'Starpower elektromos szivattyúegységek',
    summary: 'Elektromos szivattyúegységek mezőgazdasági öntözési és ipari feladatokra.', cardDescription: 'Elektromos szivattyúegységek 600–6500 l/perc közötti gyártói szállítási tartománnyal.', imageKey: 'electric-pump-range.jpg', sourceUrl: source.electric,
    overviewTitle: 'Elektromos szivattyúegységek öntözéshez és ipari felhasználásra',
    overviewIntro: 'A Starpower elektromos szivattyúegységeit öntözési és ipari alkalmazásokhoz kínálja. A gyártó 600 és 6500 liter/perc közötti szállítási tartományt közöl.',
    overviewSections: [{ heading: 'A feladathoz választható megoldás', body: 'A gyártó széles választékként mutatja be az elektromos szivattyúegységeket; a konkrét kivitel kiválasztásához az alkalmazás és a szükséges üzemi adatok egyeztetése szükséges.', imageKey: 'electric-pump-set.jpg' }],
  },
  {
    slug: 'starpower-motoros-kuplungegysegek', name: 'Starpower motoros kuplungegységek', categorySlug: 'motoros-szivattyuegysegek', order: 30,
    productSlug: 'starpower-motoros-kuplungegysegek', productName: 'Starpower motoros kuplungegységek',
    summary: 'Egyedi motoros kuplungegységek olyan alkalmazásokhoz, ahol nincs elérhető hálózati energia.', cardDescription: 'Egyedi összeállítású motoros kuplungegységek öntözési és ipari feladatokra.', imageKey: 'motor-clutch-set-01.jpg', sourceUrl: source.clutch,
    overviewTitle: 'Motoros kuplungegységek egyedi alkalmazásokhoz',
    overviewIntro: 'A Starpower a motoros kuplungegységeket a megrendelővel közösen tervezi olyan helyzetekre, ahol energia és hajtóerő szükséges, de nincs elérhető villamos hálózat.',
    overviewSections: [
      { heading: 'Változatos felhasználás', body: 'A gyártó példaként függőleges szivattyús öntözőrendszereket, szénaszárítókat, recirkulációs ventilátorokat, valamint közös motorra szerelt generátor- és szivattyúegységeket említ.', imageKey: 'motor-clutch-set-02.jpg' },
      { heading: 'Az alkalmazáshoz igazított kivitel', body: 'A lehetséges változatok között léghűtéses vagy vízhűtéses dízelmotor, kézi vagy automatizált vezérlés, holtpontos kuplung kezelőkarral, illetve olajfürdős fordulatszám-csökkentő szerepel. Készülhet fix alapra vagy kocsira, festett vagy tűzihorganyzott kivitelben, nyitottan, védőtetővel vagy hangszigetelt burkolattal. A gyártó helyszíni próbaüzemet, valamint értékesítés előtti és utáni támogatást is kínál.', imageKey: 'motor-clutch-range.jpg' },
    ],
  },
  {
    slug: 'starpower-apollo', name: 'Starpower Apollo napelemes szivattyúrendszer', categorySlug: 'napelemes-rendszerek', order: 30,
    productSlug: 'apollo-napelemes-vizszivattyu', productName: 'Apollo napelemes vízszivattyúrendszer',
    summary: 'Napelemmel működtetett elektromos szivattyúrendszer vízkiemeléshez, tartálytöltéshez és öntözéshez.', cardDescription: 'Napelemes szivattyúrendszer mezőgazdasági vízellátási feladatokra.', imageKey: 'apollo.jpg', sourceUrl: source.apollo,
    overviewTitle: 'Apollo napelemes vízszivattyú-rendszer',
    overviewIntro: 'Az Apollo napelemekből nyert energiával működtet elektromos szivattyút. Alkalmazható mély kútból történő vízemelésre, tárolótartály feltöltésére, mezőgazdasági öntözésre és ivóvízellátásra.',
    overviewSections: [{ heading: 'A rendszer fő elemei', body: 'A rendszer elektromos szivattyúból, vezérlő- és átalakítóegységből, valamint a szükséges teljesítményhez méretezett napelemmodulokból áll. A gyártó szerint hálózati áram vagy áramfejlesztő is csatlakoztatható kiegészítő energiaforrásként.', imageKey: 'apollo.jpg' }],
  },
] as const

const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })
try {
  const manufacturer = (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'starpower' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const logo = (await payload.find({ collection: 'media', where: { id: { equals: 9 } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!manufacturer || !logo) throw new Error('Starpower gyártó vagy logó hiányzik')
  const media = new Map<string, any>()
  for (const item of mediaItems) {
    let doc: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: item.url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (!doc && apply) doc = await payload.create({ collection: 'media', overrideAccess: true, data: { alt: item.alt, sourceUrl: item.url, credit: item.credit }, filePath: path.join(root, 'public/images/starpower', item.file) } as any)
    media.set(item.file, doc)
  }
  const apolloImage: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: source.apollo } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    ?? (await payload.find({ collection: 'media', where: { filename: { equals: 'apollo.jpg' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!apolloImage) throw new Error('Apollo hivatalos képe hiányzik')
  media.set('apollo.jpg', apolloImage)

  for (const item of families) {
    const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: item.categorySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (!category) throw new Error(`Hiányzó alkategória: ${item.categorySlug}`)
    let family: any = (await payload.find({ collection: 'product-families', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    const existingProduct: any = (await payload.find({ collection: 'products', where: { slug: { equals: item.productSlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (!apply) {
      console.log(`${family ? 'UPDATE' : 'CREATE'} family ${item.slug}; ${existingProduct ? 'UPDATE' : 'CREATE'} product ${item.productSlug}; category=${item.categorySlug}; image=${media.get(item.imageKey)?.id ?? 'new-media'}`)
      continue
    }
    const familyImage = media.get(item.imageKey)
    if (!familyImage) throw new Error(`Hiányzó média: ${item.imageKey}`)
    const familyData: any = {
      manufacturer: manufacturer.id, category: category.id, name: item.name, slug: item.slug, sortOrder: item.order, status: 'published',
      summary: item.summary, image: familyImage.id, cardLogo: logo.id, cardTitle: item.name, cardDescription: item.cardDescription,
      overviewTitle: item.overviewTitle, overviewIntro: item.overviewIntro,
      overviewSections: item.overviewSections.map((section) => ({ heading: section.heading, body: section.body, image: media.get(section.imageKey)?.id, imageAlt: media.get(section.imageKey)?.alt })),
      sourceDetails: 'A termékcsalád bemutatója és képei a Starpower hivatalos oldaláról származnak.', sourceUrl: item.sourceUrl,
      reviewNote: 'A család neve, felhasználása, kártyaképe és bemutatója a hivatalos Starpower-oldallal ellenőrizve.',
    }
    family = family
      ? await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: familyData })
      : await payload.create({ collection: 'product-families', overrideAccess: true, data: familyData })

    const productData: any = {
      manufacturer: manufacturer.id, category: category.id, family: family.id, name: item.productName, slug: item.productSlug,
      productKind: 'type', sortOrder: 0, showInFamily: true, status: 'published', reviewState: 'ready',
      summary: item.summary, cardDescription: item.cardDescription,
      description: richText([item.overviewIntro, ...item.overviewSections.map((section) => section.body)]),
      image: familyImage.id, gallery: item.overviewSections.map((section) => media.get(section.imageKey)?.id).filter(Boolean),
      originalUrl: item.sourceUrl, sourceDetails: item.overviewIntro,
      sourceEvidence: [{ url: item.sourceUrl, note: 'Hivatalos termékcsalád-oldal és a rajta szereplő képek.', media: familyImage.id }],
      reviewNote: 'Termékcsalád-szintű gyártói leírás; nem önálló modellszám. Modellspecifikus adatok nincsenek feltételezve.',
    }
    if (item.slug === 'starpower-elektromos-szivattyuegysegek') productData.specifications = [{ label: 'Gyártó által közölt szállítási tartomány', value: '600–6500 l/perc' }]
    if (item.slug === 'starpower-apollo') {
      productData.specifications = [
        { label: 'Fő elemek', value: 'Elektromos szivattyú, vezérlőegység és napelemmodul(ok)' },
        { label: 'Kiegészítő energiaforrás', value: 'Hálózat vagy áramfejlesztő csatlakoztatható' },
      ]
    }
    if (existingProduct) await payload.update({ collection: 'products', id: existingProduct.id, overrideAccess: true, data: productData })
    else await payload.create({ collection: 'products', overrideAccess: true, data: productData })
    console.log(`READY ${item.slug}: family=${family.id}; category=${category.id}`)
  }
} finally {
  await payload.destroy()
}
