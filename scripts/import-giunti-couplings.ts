import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
})

const items = [
  {
    slug: 'bauer-fejes-idom',
    summary: 'Bauer-kompatibilis gyorscsatlakozó a Giunti horganyzott csőválasztékában.',
    paragraphs: [
      'A Giunti horganyzott acélcső-kínálatában Bauer-kompatibilis gyorscsatlakozós kivitel is szerepel. A gyártó ezt a csőváltozatot öntözési, állattartási és általános építési folyadékszállítási felhasználásnál sorolja fel.',
    ],
    url: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-tipo-bauer/',
    note: 'A Giunti Bauer-kompatibilis gyorscsatlakozós horganyzott csőoldala; folyadékszállítási felhasználásokat sorol fel, de a helyi rekord önálló idomára nem közöl méretadatot.',
  },
  {
    slug: 'anfor-fejes-idom',
    summary: 'Anfor gyorscsatlakozó-típus a Giunti horganyzott csőrendszereinek kínálatában.',
    paragraphs: [
      'Az Anfor gyorscsatlakozótípus a Giunti horganyzott csőválasztékának egyik kivitele. A gyártó kategórialeírása szerint ez a csatlakozórendszer Európában és Kanadában is elterjedt, és ipari alkalmazásoknál használják nagyobb áteresztési igényű közegek továbbítására.',
    ],
    url: 'https://www.giuntispa.com/product-category/tubazioni-in-acciaio-zincato/',
    note: 'A Giunti hivatalos horganyzottcső-kategóriája ismerteti az Anfor csatlakozótípust és annak felhasználási körét; önálló idom méretadata nincs hozzárendelve.',
  },
  {
    slug: 'ferrari-gombcsatlakozo',
    summary: 'Ferrari gömbcsatlakozó gyorsan szerelhető, mobil esőztető öntözővezetékekhez.',
    paragraphs: [
      'A Ferrari gömbcsatlakozó mezőgazdasági öntözőcsövek gyors összekapcsolására szolgáló megoldás. A Giunti leírása kedvező ár és üzemi nyomással összefüggő teljesítmény közötti kompromisszumként, valamint mobil esőztető rendszerekhez alkalmas csatlakozásként mutatja be.',
      'A háromkampós gömbcsatlakozó-változat olyan alkalmazásokhoz készült, ahol a csővezeték rezgésnek vagy gyakori nyomásváltozásnak van kitéve.',
    ],
    url: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-sferici-ferrari/',
    note: 'A Giunti Ferrari-oldala közvetlenül ismerteti a gömbcsatlakozó felhasználását és a háromkampós változatot; konkrét helyi kivitel vagy méret nincs igazolva.',
  },
]

for (const item of items) {
  const product: any = (await payload.find({
    collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  if (!product) throw new Error(`Nem található a Giunti termékrekord: ${item.slug}`)
  await payload.update({
    collection: 'products', id: product.id, overrideAccess: true,
    data: {
      summary: item.summary,
      description: richText(item.paragraphs),
      sourceDetails: `A terméktípus rövid és részletes bemutatója a hivatalos Giunti oldalon szereplő csatlakozástípus alapján készült. A gyártói oldalak komplett csöveket ismertetnek, ezért képet és önálló idom-specifikációt nem rendeltünk hozzá.`,
      sourceEvidence: [{ url: item.url, note: item.note }],
      reviewState: 'specs-missing',
      reviewNote: 'A csatlakozótípus gyártói szövege ellenőrzött. A helyi önálló idom konkrét kivitele és főképe nem igazolt.',
    } as any,
  })
}

console.log('Giunti Bauer, Anfor és Ferrari csatlakozók: forrásolt magyar leírások hozzáadva, képek és méretadatok találgatás nélkül üresen maradtak.')
await payload.destroy()
