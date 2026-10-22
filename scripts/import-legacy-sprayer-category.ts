import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const product: any = await payload.findByID({ collection: 'products', id: 103, depth: 0, overrideAccess: true })
const category: any = await payload.findByID({ collection: 'categories', id: 60, depth: 0, overrideAccess: true })
if (!product || product.slug !== 'permetezogepek' || !category || category.slug !== 'permetezogepek') throw new Error('A permetező kategória vagy terméktípus rekordja nem egyezik.')

const pageUrl = 'https://www.rmhungary.hu/index.php?alkat=7'
const imageBase = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/'
const files = ['image12(2).jpeg', 'image13(2).jpeg', 'image14(2).jpeg', 'image15(1).jpeg']
const mainFile = 'image14(2).jpeg'
const media: any[] = []
for (const file of files) {
  const sourceUrl = `${imageBase}${encodeURIComponent(file).replaceAll('%28', '(').replaceAll('%29', ')')}`
  let item: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const alt = 'De Cloet és Mantovani önjáró permetezőgép – bemutatófotó'
  if (apply) {
    item = item
      ? await payload.update({ collection: 'media', id: item.id, overrideAccess: true, data: { alt, credit: 'RM Hungary korábbi permetezőgép-kategóriája' } as any })
      : await payload.create({ collection: 'media', overrideAccess: true, data: { alt, sourceUrl, credit: 'RM Hungary korábbi permetezőgép-kategóriája' }, filePath: path.join(root, 'public/images/legacy-sprayers', file) } as any)
  } else item = item ?? { id: `new:${file}` }
  media.push(item)
}
const main = media[files.indexOf(mainFile)]
const summary = 'Önjáró permetezőgépek és hidraulikus emelőrendszerrel szerelt gépegységek De Cloet és Mantovani gyártmányban.'
const description = {
  root: { type: 'root', format: '', indent: 0, version: 1, children: [{
    type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'A kínálat De Cloet és Mantovani gyártmányú permetezőket, valamint hidraulikus emelőrendszerrel szerelt önjáró gépegységeket foglal magában.', version: 1 }],
  }] },
}
const previousEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const evidence = [
  ...previousEvidence.filter((entry: any) => entry?.url !== pageUrl),
  { url: pageUrl, note: 'A korábbi RM Hungary kategória De Cloet és Mantovani permetezőgépeket, valamint hidraulikus emelőrendszerű önjáró gépegységeket említ; négy képet közvetlenül ehhez a csoporthoz közöl.', media: main.id },
  ...files.map((file, index) => ({ url: `${imageBase}${encodeURIComponent(file).replaceAll('%28', '(').replaceAll('%29', ')')}`, note: 'A régi RM Hungary permetezőgép-kategória közvetlen bemutatófotója.', media: media[index].id })),
]

if (apply) {
  await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
    brand: 'De Cloet / Mantovani', summary, cardDescription: summary, description,
    image: main.id, cardImage: main.id, gallery: media.map(item => item.id),
    originalUrl: pageUrl,
    sourceDetails: 'A leírás és a négy galériafotó a korábbi RM Hungary Permetezők kategóriaoldaláról származik. A forrás De Cloet és Mantovani gyártmányokat említ, de nem rendeli az egyes képeket konkrét modellhez.',
    sourceEvidence: evidence,
    reviewState: 'specs-missing',
    reviewNote: 'A közös terméktípushoz a régi kategória közvetlen képei kerültek. A képek egyedi modellhez és a két gyártó valamelyikéhez való pontos párosítása nem minden fotónál igazolt; modellspecifikus adatot nem vettünk át.',
  } as any })
  await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: main.id, description: summary } as any })
  console.log(`Permetezőgépek termék- és kategóriaképe frissítve; ${media.length} fotó a galériában.`)
} else console.log(`Előnézet: Permetezőgépek (${media.length} közvetlen régi kategóriafotó); nincs adatbázis-módosítás. Alkalmazás: pnpm import:legacy-sprayer-category -- --apply`)

await payload.destroy()
