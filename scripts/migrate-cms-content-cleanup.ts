import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const tasks = [
  { slug: 'cosmeco-arokmaro', title: 'Egyrotoros Cosmeco árokmaró munka közben', videoId: 'c13vYRrC0po' },
  { slug: 'cosmeco-csatornatisztito', title: 'Kétrotoros Cosmeco árokmaró munka közben', videoId: 'lBoRkUE_eZo' },
]

try {
  for (const task of tasks) {
    const result = await payload.find({ collection: 'products', where: { slug: { equals: task.slug } }, limit: 1, depth: 0, overrideAccess: true })
    const product = result.docs[0] as any
    if (!product) throw new Error(`Missing product: ${task.slug}`)
    const expected = { title: task.title, url: `https://www.youtube.com/watch?v=${task.videoId}` }
    const current = (product.videos || []).map(({ title, url }: any) => ({ title, url }))
    if (current.length && JSON.stringify(current) !== JSON.stringify([expected])) throw new Error(`Existing CMS videos differ for ${task.slug}; refusing to overwrite.`)
    if (JSON.stringify(current) === JSON.stringify([expected])) {
      console.log(`${task.slug}: CMS video already matches.`)
      continue
    }
    if (apply) await payload.update({ collection: 'products', id: product.id, data: { videos: [expected] }, depth: 0, overrideAccess: true } as any)
    console.log(`${task.slug}: ${apply ? 'added' : 'ready to add'} verified official YouTube video ${task.videoId}.`)
  }
  const familyResult = await payload.find({ collection: 'product-families', where: { slug: { equals: 'rm-ontozoszarnyak' } }, limit: 1, depth: 0, overrideAccess: true })
  const family = familyResult.docs[0] as any
  if (!family) throw new Error('Missing RM irrigation-wings family.')
  const overviewIntro = 'Az RM esőztető szárnyai kíméletes, egyenletes vízelosztásra készülnek. Válaszd ki a feladathoz illő modellt és szárnyhosszt.'
  const cardDescription = 'Esőztető szárnyak és konzolok egyenletes vízelosztáshoz.'
  if (family.overviewIntro && family.overviewIntro !== overviewIntro) throw new Error('Existing RM wings intro differs; refusing to overwrite.')
  if (family.cardDescription && family.cardDescription !== cardDescription) throw new Error('Existing RM wings card description differs; refusing to overwrite.')
  if (family.overviewIntro === overviewIntro) console.log('RM wings family intro already matches CMS.')
  else {
    if (apply) await payload.update({ collection: 'product-families', id: family.id, data: { overviewTitle: 'Az RM öntözőszárnyak bemutatása', overviewIntro }, depth: 0, overrideAccess: true } as any)
    console.log(`RM wings family intro: ${apply ? 'added' : 'ready to add'} to CMS.`)
  }
  if (family.cardDescription === cardDescription) console.log('RM wings family card description already matches CMS.')
  else {
    if (apply) await payload.update({ collection: 'product-families', id: family.id, data: { cardDescription }, depth: 0, overrideAccess: true } as any)
    console.log(`RM wings family card description: ${apply ? 'added' : 'ready to add'} to CMS.`)
  }
} finally {
  await payload.destroy()
}
