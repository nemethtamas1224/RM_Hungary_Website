import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const product: any = (await payload.find({
  collection: 'products',
  where: { slug: { equals: 'automata-szuroallomas' } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})).docs[0]

if (!product) throw new Error('A Giunti automata szűrőállomás termékrekord nem található.')

const imageUrl = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image8(2).jpeg'
const mediaData = {
  alt: 'Giunti szűrőkamra az öntözővíz-szűrési kínálatból',
  sourceUrl: imageUrl,
  credit: 'RM Hungary korábbi Giunti kategóriaoldala; a kép „Szűrőkamra” felirattal szerepel',
}
let media: any = (await payload.find({
  collection: 'media', where: { sourceUrl: { equals: imageUrl } }, limit: 1, depth: 0, overrideAccess: true,
})).docs[0]
media = media
  ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: mediaData as any })
  : await payload.create({
      collection: 'media', overrideAccess: true, data: mediaData as any,
      filePath: path.join(root, 'public/images/giunti/filter-chamber.jpg'),
    } as any)

const paragraphs = [
  'A Giunti szűrőállomásai az öntözővíz szennyeződéseinek eltávolítására szolgálnak. A gyártó a berendezéseket felületkezelt vagy tűzihorganyzott fém kivitelben mutatja be; a szűrési kapacitás modelltől függ.',
  'A megfelelő szűrési megoldás kiválasztásánál a vízforrást, az öntözőrendszer igényeit és az üzemi körülményeket kell figyelembe venni. A kínálatban kvarchomokos és hálós szűrők, hidrociklonok, valamint automatikus visszamosású rendszerek is szerepelnek.',
  'A gyártói kategórialeírás a tápoldatozással való kompatibilitást is megadja. Az egyes szűrők műszaki adatai és felszereltsége a kiválasztott típustól függ.',
]
const description = {
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
}

await payload.update({
  collection: 'products', id: product.id, overrideAccess: true,
  data: {
    summary: 'Giunti öntözővíz-szűrő állomások többféle szűrési technológiával és modellfüggő kapacitással.',
    description,
    image: media.id,
    sourceDetails: 'Általános bemutató a Giunti hivatalos szűrőállomás-kategóriájából. A helyi általános rekordhoz nem párosítottunk konkrét modellt. A főképen a korábbi RM Hungary Giunti-kategóriaoldalán „Szűrőkamra” felirattal közölt, ehhez a termékcsoporthoz tartozó berendezés látható.',
    sourceEvidence: [{
      url: 'https://www.giuntispa.com/product-category/stazioni-di-filtraggio/',
      note: 'A gyártó általános felhasználást, kiválasztási szempontokat, modellfüggő szűrési kapacitást és tápoldatozási kompatibilitást ír le; többek között kézi és automatikus szűrőmegoldásokat listáz.',
    }, {
      url: imageUrl,
      note: 'A korábbi RM Hungary Giunti-kategóriaoldal szűrőállomásokról szóló blokkjában, közvetlenül a „Szűrőkamra” felirat mellett szereplő kép; illusztrációként használva, pontos modellazonosítás nélkül.',
      media: media.id,
    }],
    reviewState: 'specs-missing',
    reviewNote: 'A családszintű leírás és a kategóriához tartozó szűrőkamra-fotó ellenőrzött. A helyi rekordhoz tartozó konkrét szűrőállomás-típus és modellspecifikáció nem azonosítható.',
  } as any,
})

console.log(`Giunti automata szűrőállomás: magyar leírás és kapcsolt szűrőkamra-fotó hozzáadva (media ${media.id}); konkrét modell továbbra sincs feltételezve.`)
await payload.destroy()
