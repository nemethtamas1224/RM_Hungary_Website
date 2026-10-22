import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const legacyBase = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/'
const legacyCategoryBase = 'https://www.rmhungary.hu/index.php?alkat='

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
})

const items = [
  {
    slug: 'bakhathuzo-gepek',
    categoryKey: '5',
    summary: 'Talaj-előkészítő eszközök sík és bakhátas termesztéshez: bakháthúzók, bakhátművelők és műtrágyaszóró adapterek.',
    paragraphs: [
      'A kínálat a sík és bakhátas termesztési mód talaj-előkészítéséhez kapcsolódik. A bemutatott géptípusok között bakháthúzó és bakhátművelő eszközök, valamint műtrágyaszóró adapterek szerepelnek.',
      'Bakhátművelő eszközök és műtrágyaszóró adapterek De Cloet, Oliver Agro és Mantovani gyártmányai között is megtalálhatók.',
    ],
    main: 'image5(5).jpeg',
    gallery: ['image3(5).jpeg', 'image4(5).jpeg', 'image5(5).jpeg', 'image6(4).jpeg', 'image7(2).jpeg', 'image8(4).jpeg'],
    alt: 'Bakhátképző és talajművelő gép',
    note: 'A terméktípus, a kapcsolódó gépcsoportok és a gyártónevek a korábbi RM Hungary alkategória-oldalon szerepelnek. A galériaképek ugyanazon az oldalon voltak közölve; konkrét modellhez nem rendeltük őket.',
    sourceDetails: 'A szöveg és a képek a korábbi RM Hungary bakháthúzó és bakhátművelő kategóriaoldaláról származnak. A forrás De Cloet, Oliver Agro és Mantovani gyártmányokat nevez meg, de nem ad meg konkrét modelljelölést vagy műszaki táblázatot.',
    reviewNote: 'A terméktípus és a kategóriaoldalon közölt fotók azonosítottak. Konkrét gépmodell és modellszintű műszaki adatok nem szerepeltek a forrásban.',
  },
  {
    slug: 'palantaulteto-gepek',
    categoryKey: '8',
    summary: 'Négy soros palántaültető gép víz- és műtrágya-adagolóval, gépi betakarításra tervezett termesztéshez.',
    paragraphs: [
      'A négy sorban dolgozó palántaültető víz- és műtrágya-adagolóval támogatja a gépi betakarításra alkalmas termesztést.',
    ],
    main: 'image10(2).jpeg',
    gallery: ['image9(2).jpeg', 'image10(2).jpeg'],
    alt: 'Négy sorban dolgozó palántaültető gép',
    note: 'A négy soros kialakítás, a víz- és műtrágya-adagoló, valamint a gépi betakarításhoz való használat a korábbi RM Hungary alkategória-oldalon szerepel. Mindkét galériakép ugyanazon az oldalon volt közölve.',
    sourceDetails: 'A leírás és a képek a korábbi RM Hungary palántaültetőgép-oldaláról származnak. A forrás négy soros, víz- és műtrágya-adagolós gépet említ, de nem közöl gyártót, konkrét modellt vagy műszaki táblázatot.',
    reviewNote: 'A négy soros, víz- és műtrágya-adagolós terméktípus és a hozzá tartozó korábbi RM Hungary fotók azonosítottak. Gyártó és konkrét modell nincs megadva.',
  },
]

const mediaBySource = new Map<string, any>()
for (const item of items) {
  const product = (await payload.find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!product) throw new Error(`Hiányzó termékrekord: ${item.slug}`)

  const gallery: any[] = []
  for (const filename of item.gallery) {
    const sourceUrl = `${legacyBase}${encodeURIComponent(filename).replaceAll('%28', '(').replaceAll('%29', ')')}`
    let media = mediaBySource.get(sourceUrl)
    if (!media) {
      media = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
      if (!media) throw new Error(`Hiányzó, előre importált forráskép: ${sourceUrl}`)
      mediaBySource.set(sourceUrl, media)
    }
    const alt = filename === item.main ? item.alt : `${product.name} – kapcsolódó bemutatófotó`
    if (apply && media.alt !== alt) {
      media = await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: { alt, credit: 'RM Hungary korábbi termékoldala' } as any })
      mediaBySource.set(sourceUrl, media)
    }
    gallery.push(media)
  }

  const mainUrl = `${legacyBase}${encodeURIComponent(item.main).replaceAll('%28', '(').replaceAll('%29', ')')}`
  const main = mediaBySource.get(mainUrl)
  const pageUrl = `${legacyCategoryBase}${item.categoryKey}`
  const existingEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
  const sourceEvidence = [
    ...existingEvidence.filter((entry: any) => entry?.url !== pageUrl),
    { url: pageUrl, note: item.note, media: main.id },
  ]

  if (apply) {
    await payload.update({
      collection: 'products', id: product.id, overrideAccess: true,
      data: {
        summary: item.summary,
        cardDescription: item.summary,
        description: richText(item.paragraphs),
        image: main.id,
        cardImage: main.id,
        gallery: gallery.map((entry) => entry.id),
        originalUrl: pageUrl,
        sourceDetails: item.sourceDetails,
        sourceEvidence,
        reviewState: 'specs-missing',
        reviewNote: item.reviewNote,
      } as any,
    })
  }
  console.log(`${apply ? 'Frissítve' : 'Előnézet'}: ${product.name} — ${gallery.length} kép; ${pageUrl}`)
}

await payload.destroy()
console.log(apply ? 'Az import kész.' : 'Nincs adatbázis-módosítás. Alkalmazáshoz add meg a --apply kapcsolót.')
