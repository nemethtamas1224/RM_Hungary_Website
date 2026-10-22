import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const productSlug = 'mezogazdasagi-ivsator-termek'
const categorySlug = 'ivsatrak'
const pageUrl = 'https://www.rmhungary.hu/index.php?alkat=47'
const baseUrl = 'https://www.rmhungary.hu/tartalom/ivsator/'
const fileNames = Array.from({ length: 12 }, (_, i) => `legacy-${i + 1}.jpeg`)

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
})

const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: productSlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const category: any = (await payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!product || !category) throw new Error('Az ívsátor termék vagy kategória rekordja nem található.')

const photos: any[] = []
for (const [index, fileName] of fileNames.entries()) {
  const sourceUrl = `${baseUrl}image${index + 1}.jpeg`
  let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const alt = `Mezőgazdasági ívsátor – ${index + 1}. bemutatófotó`
  if (apply) {
    media = media
      ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: { alt, credit: 'RM Hungary korábbi termékoldala' } as any })
      : await payload.create({
        collection: 'media', overrideAccess: true,
        data: { alt, sourceUrl, credit: 'RM Hungary korábbi termékoldala' },
        filePath: path.join(root, 'public/images/agricultural-tunnel', fileName),
      } as any)
    photos.push(media)
  } else {
    photos.push(media ?? { id: `new:${index + 1}` })
  }
}

const summary = 'Könnyűszerkezetes, moduláris mezőgazdasági ívsátrak gépek, termények, széna és szalma tárolására.'
const paragraphs = [
  'A könnyűszerkezetes, moduláris, zártszelvényekből épített ívsátor különböző talajtípusokon felállítható, előzetes építési munkálatok nélkül. Mezőgazdasági gépek, termények, széna és szalma tárolására használható.',
  'A függőleges oszlopokkal magasított változat nyílásának zárása az igényekhez alakítható. Az ívszerkezetet nagy teherbírású, ipari PVC ponyva borítja; a közölt anyagsúly körülbelül 700 g/m². A ponyva időjárás-, szél- és hóterhelésnek ellenálló, állattartó telepek, istállók és hígtrágyatárolók fedésére is alkalmazható.',
  'A sátor áttelepíthető és bővíthető. Magassága, szélessége és hosszúsága többféle kivitelben alakítható.',
]
const evidence = [
  { url: pageUrl, note: 'A korábbi RM Hungary ívsátor-oldal közli a termékleírást, és közvetlenül ehhez az oldalhoz tartozik a 12 bemutatófotó.', media: photos[0].id },
  ...fileNames.map((_, index) => ({ url: `${baseUrl}image${index + 1}.jpeg`, note: 'A korábbi RM Hungary ívsátor-oldal galériájának képe.', media: photos[index].id })),
]

if (apply) {
  await payload.update({
    collection: 'products', id: product.id, overrideAccess: true,
    data: {
      summary, cardDescription: summary, description: richText(paragraphs),
      image: photos[0].id, cardImage: photos[0].id, gallery: photos.map((photo) => photo.id),
      originalUrl: pageUrl,
      sourceDetails: 'A termékleírás és a galéria a korábbi RM Hungary ívsátor-oldaláról származik. Az oldalon közölt körülbelüli 700 g/m² ponyvasúly megőrizve; további méret- és terhelhetőségi adat nem szerepelt.',
      sourceEvidence: evidence,
      reviewState: 'specs-missing',
      reviewNote: 'A terméktípus, leírás és 12 kapcsolódó bemutatófotó azonosított. Konkrét méretváltozat, méretezés és terhelhetőségi táblázat nincs forrásolva.',
    } as any,
  })
  await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: photos[0].id } as any })
  console.log(`Ívsátor termék és kategória frissítve: ${photos.length} kép.`)
} else {
  console.log(`Előnézet: ${product.name} és ${category.name}; ${photos.length} forráskép, 3 leíró bekezdés; nincs adatbázis-módosítás. Alkalmazás: pnpm import:agricultural-tunnel -- --apply`)
}

await payload.destroy()
