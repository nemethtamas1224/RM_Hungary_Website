import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const product: any = (await payload.find({
  collection: 'products', where: { slug: { equals: 'szetszerelheto-csepegtetogomba' } }, limit: 1, depth: 0, overrideAccess: true,
})).docs[0]
if (!product) throw new Error('A Giunti szétszerelhető csepegtetőgomba rekord nem található.')

const imageUrl = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image32.jpeg'
const imageData = {
  alt: 'Szétszerelhető csepegtetőgomba működés közben, csepegtetőszalagra szerelve',
  sourceUrl: imageUrl,
  credit: 'RM Hungary korábbi Giunti termékoldala',
}
let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: imageUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
media = media
  ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: imageData as any })
  : await payload.create({ collection: 'media', overrideAccess: true, data: imageData as any, filePath: path.join(root, 'public/images/giunti/dripper-in-use.jpeg') } as any)

const previousGallery = Array.isArray(product.gallery) ? product.gallery.map((entry: any) => typeof entry === 'object' ? entry.id : entry) : []
const gallery = previousGallery.filter((id: number) => id !== media.id)
const previousEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const sourceEvidence = [
  ...previousEvidence.filter((entry: any) => entry?.url !== imageUrl),
  { url: imageUrl, note: 'A korábbi RM Hungary Giunti oldalon a szétszerelhető csepegtetőgomba leírása után közvetlenül közölt, használat közbeni fotó.', media: media.id },
]

await payload.update({
  collection: 'products', id: product.id, overrideAccess: true,
  data: {
    image: media.id,
    gallery,
    sourceDetails: 'A termékleíráshoz közvetlenül kapcsolódó használati fotó a korábbi RM Hungary Giunti termékoldalról származik. A fotó 274×184 px-es; kis méretben, a teljes kép megőrzésével jelenik meg. A 90×90 px-es bélyegképet és a nem azonosított gyártói fotót nem használtam.',
    sourceEvidence,
    reviewState: 'source-check',
    reviewNote: 'A korábbi RM Hungary oldal a fotót közvetlenül a csepegtetőgomba szövege után közli. A kép alacsony felbontású, ezért a helyi oldalon nem szabad felnagyítani vagy megvágni. Gyártói adatlap továbbra sincs igazolva.',
  } as any,
})

console.log(`Giunti szétszerelhető csepegtetőgomba: a közvetlenül kapcsolt, alacsony felbontású fotó főképként került be; természetes méretben jelenik meg (media ${media.id}).`)
await payload.destroy()
