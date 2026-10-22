import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const sourceUrl = 'https://www.rmirrigation.com/hu/modell/professzionális-öntöző-gépek/forgó-torony-szerkezetű/'
const payload = await getPayload({ config })
try {
  const category: any = (await payload.find({
    collection: 'categories', where: { slug: { equals: 'ontozesi-automatika' }, catalogRole: { equals: 'catalog' } },
    limit: 1, depth: 1, overrideAccess: true,
  })).docs[0]
  const image: any = (await payload.find({
    collection: 'media', where: { filename: { equals: 'programmatore.png' } },
    limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  if (!category || !image) throw new Error('Az aktív automatika-kategória vagy az RM RainMaster gyártói kép hiányzik.')
  if (category.id !== 55 || image.filename !== 'programmatore.png' || Number(image.width) < 500 || Number(image.height) < 500) {
    throw new Error('A várt kategória vagy legalább 500×500-as RainMaster fotó nem egyezik; nincs módosítás.')
  }
  const old = category.image && typeof category.image === 'object' ? category.image : null
  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    category: { id: category.id, name: category.name, oldImage: old?.filename, oldSize: old ? `${old.width}×${old.height}` : null },
    replacement: { id: image.id, filename: image.filename, size: `${image.width}×${image.height}`, alt: 'RM RainMaster 2.6 elektronikus öntözésvezérlő', source: sourceUrl, credit: 'RM Irrigation hivatalos GX termékcsaládoldal' },
  }, null, 2))
  if (apply) {
    await payload.update({ collection: 'media', id: image.id, overrideAccess: true, data: {
      alt: 'RM RainMaster 2.6 elektronikus öntözésvezérlő', sourceUrl,
      credit: 'RM Irrigation hivatalos GX termékcsaládoldal',
    } as any })
    await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { image: image.id } as any })
    const saved: any = await payload.findByID({ collection: 'categories', id: category.id, depth: 1, overrideAccess: true })
    const savedId = typeof saved.image === 'object' && saved.image ? saved.image.id : saved.image
    if (String(savedId) !== String(image.id)) throw new Error('A kategóriakép-visszaolvasás nem egyezik.')
    console.log('Az öntözési automatika kategória a 550×519-es RM RainMaster 2.6 vezérlőfotót használja; a régi média megmaradt.')
  }
} finally {
  await payload.destroy()
}
