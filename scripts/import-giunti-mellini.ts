import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const product: any = (await payload.find({
  collection: 'products',
  where: { slug: { equals: 'mellini-fejes-idom' } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})).docs[0]

if (!product) throw new Error('A Mellini fejes idom termékrekord nem található.')

const text = 'A Mellini gyorscsatlakozó történeti elődje a Giunti S.p.A. által ma Robur néven kínált rendszernek.'
const description = {
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: [{
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    }],
  },
}

await payload.update({
  collection: 'products',
  id: product.id,
  overrideAccess: true,
  data: {
    summary: 'A Mellini gyorscsatlakozó történeti megnevezése a Giunti mai Robur rendszeréhez kapcsolódik.',
    description,
    sourceDetails: 'A Giunti hivatalos Robur csőtermékoldala szerint a korábbi Mellini és Martignoni cég által forgalmazott gyorscsatlakozó tulajdonjogát a Giunti S.p.A. megszerezte, majd Robur néven vitte tovább. A hivatalos oldal a mai Robur csatlakozást elsősorban öntözőgépes rendszerekkel és azok üzemi nyomásával hozza összefüggésbe. Az oldal komplett gyorscsatlakozós acélcsövet mutat, nem önálló fejidomot; ezért képet és modellszintű műszaki adatot nem rendeltünk a helyi rekordhoz.',
    sourceEvidence: [
      { url: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-robur/', note: 'A Giunti hivatalos oldala rögzíti, hogy a korábbi Mellini gyorscsatlakozó jogait megszerezte, majd Robur néven folytatta; a termékoldal komplett csőrendszerre vonatkozik.' },
      { url: 'https://www.rmhungary.hu/index.php?alkat=13', note: 'A korábbi RM Hungary Giunti kínálatban Mellini fejes idomként szerepel a helyi terméktípus.' },
    ],
    reviewState: 'source-check',
    reviewNote: 'A Mellini–Robur gyártói kapcsolat igazolt, de a helyi önálló idom és a gyártói komplett csőtermék pontos megfeleltetése nem; fotó és specifikáció nem került hozzárendelésre.',
  } as any,
})

console.log('A Giunti Mellini termékrekord kapott igazolt történeti megnevezést és forrásjegyzetet; képet és specifikációt nem rendeltünk hozzá.')
await payload.destroy()
