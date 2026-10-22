import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

try {
  const result: any = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'rm-major-xj-evo' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const product = result.docs[0]
  if (!product || String(product.id) !== '112') throw new Error('A várt RM Major XJ EVO (112) rekord nem található.')

  const reviewNote = 'A helyi „RM Major XJ EVO” modellnév nem egyezik közvetlenül a gyártó jelenlegi XJ termékoldalán szereplő „Major EVO” vagy a 2021-es katalógusban található „Major XJ” névvel. A gyártói források nem igazolják külön e helyi rekord azonosságát. A külön RM Major EVO rekord képeit és adatait ne másold át; pontos SKU vagy forgalmazói modellazonosító szükséges.'
  console.log(`${apply ? 'Alkalmazás' : 'Előnézet'}: ${product.name} | reviewState ${product.reviewState} → source-check`)
  if (!apply) console.log(reviewNote)

  if (apply && (product.reviewState !== 'source-check' || product.reviewNote !== reviewNote)) {
    await payload.update({
      collection: 'products',
      id: product.id,
      overrideAccess: true,
      data: { reviewState: 'source-check', reviewNote } as any,
    })
    const updated: any = await payload.findByID({ collection: 'products', id: product.id, depth: 0, overrideAccess: true })
    if (updated.reviewState !== 'source-check' || updated.reviewNote !== reviewNote) throw new Error('A felülvizsgálati megjegyzés visszaellenőrzése sikertelen.')
    console.log(`Frissítve és visszaolvasva: ${updated.slug}; státusz ${updated.reviewState}.`)
  }
} finally {
  await payload.destroy()
}
