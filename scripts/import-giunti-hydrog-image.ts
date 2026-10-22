import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const product: any = (await payload.find({
  collection: 'products', where: { slug: { equals: 'hydrog-csepegtetoszalag' } }, limit: 1, depth: 0, overrideAccess: true,
})).docs[0]
if (!product) throw new Error('A HydroG termékrekord nem található.')

const sourceUrl = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image29.png'
const existing: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
const media = existing
  ? await payload.update({ collection: 'media', id: existing.id, overrideAccess: true, data: {
      alt: 'Csepegtetőszalaggal öntözött szántóföldi növényállomány', sourceUrl, credit: 'RM Hungary korábbi Giunti kategóriaoldala',
    } as any })
  : await payload.create({ collection: 'media', overrideAccess: true, data: {
      alt: 'Csepegtetőszalaggal öntözött szántóföldi növényállomány', sourceUrl, credit: 'RM Hungary korábbi Giunti kategóriaoldala',
    } as any, filePath: path.join(root, 'public/images/giunti/drip-tape-field.png') } as any)

const previousEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const sourceEvidence = [
  ...previousEvidence.filter((entry: any) => entry?.url !== sourceUrl),
  { url: sourceUrl, note: 'A korábbi RM Hungary Giunti kategóriaoldal csepegtetőszalagos öntözési bemutatójához tartozó, általános alkalmazási fotó; nem HydroG-modellazonosító kép.', media: media.id },
]
await payload.update({
  collection: 'products', id: product.id, overrideAccess: true,
  data: {
    image: media.id,
    cardImage: media.id,
    sourceDetails: 'A fő- és kártyakép a korábbi RM Hungary Giunti kategóriaoldal csepegtetőszalagos öntözési részéből származó, általános alkalmazási fotó. A kép 228×152 px; a terméklap kis felbontású képként jeleníti meg. Nem azonosítja a HydroG modellt. A jelenlegi Giunti HydroG2 terméket mutat; a két elnevezés azonossága nem igazolt.',
    sourceEvidence,
    reviewState: 'source-check',
    reviewNote: 'A kép csepegtetőszalagos öntözést mutat, de nem azonosít konkrét szalagmodellt. A HydroG/HydroG2 megfeleltetés nyitott; a kép ne legyen HydroG2-specifikáció bizonyítékaként használva.',
  } as any,
})
console.log(JSON.stringify({ product: product.name, mediaId: media.id, image: (media as any).url, width: (media as any).width, height: (media as any).height }))
await payload.destroy()
