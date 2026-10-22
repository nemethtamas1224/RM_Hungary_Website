import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const source = 'https://www.rmhungary.hu/index.php?alkat=13'
const imageUrl = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image27.jpeg'
const data = { sourceUrl: imageUrl, alt: 'Labirintusos kialakítású öntözőcső csepegtetőjárata', credit: 'RM Hungary Giunti termékkategória' }
let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: imageUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
media = media ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: data as any }) : await payload.create({ collection: 'media', overrideAccess: true, data: data as any, filePath: path.join(root, 'public/images/giunti/drip-tube-labyrinth-diagram.jpeg') } as any)
const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'csepegteto-csovek' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!product) throw new Error('Giunti csepegtetőcső termékrekord nem található.')
await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
  image: media.id, gallery: [media.id],
  sourceDetails: 'A leírás és a labirintusos csepegtetőjárat ábrája a korábbi RM Hungary Giunti-oldal azonos termékblokkja mellett szerepel. A helyi terméknév általános csepegtetőcső-típus; az ábra nem egy konkrét csőmodell méretadatlapja.',
  sourceEvidence: [{ url: source, note: 'A „Csepegtető csövek” leírás mellett közölt labirintusos járat-ábra.', media: media.id }],
  reviewNote: 'A forrásábra közvetlenül a csepegtetőcső ismertetőblokkjához tartozik; nem tartalmaz modellhez rendelhető méretadatot.'
} } as any)
console.log('Giunti csepegtetőcső: a forrásblokkhoz tartozó labirintusábra hozzáadva.')
await payload.destroy()
