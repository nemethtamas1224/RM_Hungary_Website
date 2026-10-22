import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const imageBase = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/'
const pageBase = 'https://www.rmhungary.hu/index.php?alkat='

const products = [
  {
    id: 104, slug: 'dohanytetejezo-gepek', categoryId: 61, categoryKey: '6',
    summary: 'Mantovani és De Cloet gyártmányú dohánytetejező gépek.',
    description: 'A dohánytetejező gépek a dohánynövények tetejezésére szolgálnak. A korábbi RM Hungary kínálati oldala Mantovani és De Cloet gyártmányokat nevez meg.',
    files: ['image16(3).jpeg', 'image17(2).jpeg'], main: 'image16(3).jpeg',
    note: 'A korábbi RM Hungary kategóriaoldal dohánytetejező gépet mutat, és Mantovani, valamint De Cloet gyártmányt nevez meg. Konkrét modell nincs feltüntetve.',
  },
  {
    id: 105, slug: 'dohanytoro-kombajnok', categoryId: 62, categoryKey: '38',
    summary: 'Vontatott egysoros és önjáró dohánytörő kombájnok, De Cloet és Mantovani gyártmányban.',
    description: 'A kategóriában vontatott, egysoros és önjáró dohánytörő kombájnok szerepelnek. A korábbi RM Hungary oldal De Cloet és Mantovani gyártmányokat nevez meg.',
    files: ['image18(2).jpeg', 'image19(2).jpeg', 'image20(1).jpeg', 'image21(2).jpeg'], main: 'image20(1).jpeg',
    note: 'A korábbi RM Hungary kategóriaoldal közvetlenül a dohánytörő kombájnok alatt közli az öt bemutatófotót; a gyártókat De Cloetként és Mantovaniként nevezi meg. Konkrét modell nincs feltüntetve.',
  },
  {
    id: 106, slug: 'dohany-szarito-kamrak', categoryId: 63, categoryKey: '39',
    summary: 'Keretes vagy konténeres dohányszárító kamrák, 12–18 konténeres kivitelben; számítógépes vezérlésű központok gáz-, pellet- vagy aprítékfűtéssel.',
    description: 'A korábbi RM Hungary kínálati oldal keretes vagy konténeres dohányszárító kamrákat említ, 12–18 konténeres rendszerrel és számítógépes vezérléssel. A komplett szárítóközpontokhoz gáz-, pellet- vagy aprítékfűtést sorol fel.',
    files: ['image22(2).jpeg', 'image23(3).jpeg', 'image24.jpeg'], main: 'image22(2).jpeg',
    note: 'A korábbi RM Hungary kategóriaoldal közvetlenül a dohányszárító-kamrák leírása mellett közli a három bemutatófotót. Konkrét gyártó vagy modell nincs feltüntetve.',
  },
  {
    id: 107, slug: 'zold-dohany-feldolgozo-gepek', categoryId: 64, categoryKey: '40',
    summary: 'Gépek zölddohány anyagmozgatásához, szállításához, válogatásához, méréséhez és csomagolásához.',
    description: 'A zölddohány-feldolgozó gépek az anyagmozgatást, szállítást, válogatást, mérést és csomagolást támogatják. A korábbi RM Hungary kategóriaoldal ezt a gépcsoportot sorolja fel.',
    files: ['image25(1).jpeg', 'image26(1).jpeg'], main: 'image25(1).jpeg',
    note: 'A korábbi RM Hungary kategóriaoldal közvetlenül a zölddohány-feldolgozási gépcsoport alatt közli a két bemutatófotót. Konkrét gyártó vagy modell nincs feltüntetve.',
  },
]

const richText = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: [{
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    }],
  },
})

const productsBySlug = new Map<string, any>()
const mediaByFile = new Map<string, any>()
for (const item of products) {
  const product: any = await payload.findByID({ collection: 'products', id: item.id, depth: 0, overrideAccess: true })
  const category: any = await payload.findByID({ collection: 'categories', id: item.categoryId, depth: 0, overrideAccess: true })
  if (!product || !category || product.slug !== item.slug) throw new Error(`Nem egyező termék/kategória rekord: ${item.id}/${item.categoryId}`)
  productsBySlug.set(item.slug, product)
  for (const file of item.files) {
    if (mediaByFile.has(file)) continue
    const sourceUrl = `${imageBase}${encodeURIComponent(file).replaceAll('%28', '(').replaceAll('%29', ')')}`
    let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (apply) {
      media = media
        ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: { alt: `${item.slug} – korábbi RM Hungary bemutatófotó`, credit: 'RM Hungary korábbi termékoldala' } as any })
        : await payload.create({
          collection: 'media', overrideAccess: true,
          data: { alt: `${item.slug} – korábbi RM Hungary bemutatófotó`, sourceUrl, credit: 'RM Hungary korábbi termékoldala' },
          filePath: path.join(root, 'public/images/tobacco-machinery', file),
        } as any)
      mediaByFile.set(file, media)
    } else mediaByFile.set(file, media ?? { id: `new:${file}` })
  }
}

for (const item of products) {
  const product = productsBySlug.get(item.slug)
  const category: any = await payload.findByID({ collection: 'categories', id: item.categoryId, depth: 0, overrideAccess: true })
  const photos = item.files.map(file => mediaByFile.get(file))
  const main = mediaByFile.get(item.main)
  const pageUrl = `${pageBase}${item.categoryKey}`
  const oldEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
  const sourceEvidence = [
    ...oldEvidence.filter((entry: any) => entry?.url !== pageUrl),
    { url: pageUrl, note: item.note, media: main.id },
    ...item.files.map(file => ({ url: `${imageBase}${encodeURIComponent(file).replaceAll('%28', '(').replaceAll('%29', ')')}`, note: 'A korábbi RM Hungary kategóriaoldalról közvetlenül átvett bemutatófotó.', media: mediaByFile.get(file).id })),
  ]

  if (apply) {
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
      summary: item.summary, cardDescription: item.summary, description: richText(item.description),
      image: main.id, cardImage: main.id, gallery: photos.map(photo => photo.id),
      originalUrl: pageUrl, sourceDetails: item.note,
      sourceEvidence, reviewState: 'specs-missing',
      reviewNote: 'A gépcsoport és a korábbi RM Hungary oldalon közölt képek azonosíthatók. Konkrét modell, gyártói megfeleltetésen túli konfiguráció és műszaki táblázat nincs igazolva.',
    } as any })
    await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: main.id, description: item.summary } as any })
  }
  console.log(`${apply ? 'Frissítve' : 'Előnézet'}: ${product.name}; ${photos.length} kép; ${pageUrl}`)
}

await payload.destroy()
console.log(apply ? 'A dohánygépes tartalmak importja elkészült.' : 'Nincs adatbázis-módosítás. Alkalmazáshoz add meg a -- --apply kapcsolót.')
