import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const product: any = (await payload.find({
  collection: 'products',
  where: { slug: { equals: 'hydrog-csepegtetoszalag' } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})).docs[0]
if (!product) throw new Error('A HydroG termékrekord nem található.')

const legacyUrl = 'https://www.rmhungary.hu/index.php?alkat=13'
const officialCategoryUrl = 'https://www.giuntispa.com/product-category/manichetta-gocciolante/'
const description = {
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: [
      'A HydroG megnevezésű Giunti termék csepegtetőszalagként szerepel. A csepegtető öntözőrendszer a vizet kis vízhozammal, közvetlenül a növények gyökérzónájához juttatja.',
    ].map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
}

const previousEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const sourceEvidence = [
  ...previousEvidence.filter((item: any) => item?.url !== legacyUrl && item?.url !== officialCategoryUrl),
  { url: legacyUrl, note: 'Az RM Hungary korábbi Giunti kategória a HydroG nevet a csepegtetőszalagok között sorolja fel.' },
  { url: officialCategoryUrl, note: 'A gyártó aktuális csepegtetőszalag-kategóriája HydroG2 terméket mutat; a HydroG azonosság nem igazolt.' },
]

await payload.update({
  collection: 'products',
  id: product.id,
  overrideAccess: true,
  data: {
    summary: 'Giunti csepegtetőszalag célzott vízadagolású öntözőrendszerhez.',
    description,
    sourceDetails: 'A HydroG név és a terméktípus a korábbi RM Hungary Giunti kategóriájából származik. A jelenlegi gyártói kategória HydroG2 terméket mutat, de a névazonosság és a műszaki megfelelés nem igazolt. Képet vagy HydroG2-specifikációt nem rendeltünk ehhez a rekordhoz.',
    sourceEvidence,
    reviewState: 'source-check',
    reviewNote: 'A helyi HydroG és a jelenlegi gyártói HydroG2 azonosságát ellenőrizni kell; termékfotó és modelladat nem párosítható biztosan.',
  } as any,
})

console.log('Giunti HydroG kapott forrásalapú alapleírást; HydroG2-specifikációt és képet nem rendeltünk hozzá.')
await payload.destroy()
