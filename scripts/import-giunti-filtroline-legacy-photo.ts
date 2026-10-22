import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const sourceUrl = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image24.png'
const product: any = (await payload.find({
  collection: 'products',
  where: { slug: { equals: 'acelbetetes-halos-szuro' } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})).docs[0]
const photo: any = (await payload.find({
  collection: 'media',
  where: { sourceUrl: { equals: sourceUrl } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})).docs[0]

if (!product || !photo) throw new Error('A FILTROLINE termék vagy a korábbi RM-kép nem található.')

await payload.update({
  collection: 'media',
  id: photo.id,
  overrideAccess: true,
  data: {
    alt: 'Giunti acélbetétes hálós szűrő – a korábbi RM Hungary oldalon megnevezett termékfotó',
    credit: 'RM Hungary korábbi Giunti kategóriaoldala; a képaláírás acélbetétes hálós szűrőként azonosítja',
  } as any,
})

const ids = (value: unknown): number[] => Array.isArray(value)
  ? value.map((entry: any) => typeof entry === 'number' ? entry : entry?.id).filter(Number.isInteger)
  : []
const gallery = [...new Set([...ids(product.gallery), photo.id])]
const evidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const nextEvidence = evidence.some((item: any) => item?.url === sourceUrl)
  ? evidence
  : [...evidence, { url: sourceUrl, note: 'A korábbi RM Hungary oldalon a kép közvetlenül az acélbetétes hálós szűrő megnevezésével szerepel.', media: photo.id }]

await payload.update({
  collection: 'products',
  id: product.id,
  overrideAccess: true,
  data: { gallery, sourceEvidence: nextEvidence } as any,
})

console.log(`Giunti FILTROLINE galéria kiegészítve az egyértelműen feliratozott RM fotóval (media ${photo.id}).`)
await payload.destroy()
