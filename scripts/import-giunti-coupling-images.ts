import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })

const items = [
  {
    slug: 'bauer-fejes-idom',
    file: 'public/images/giunti/coupling-bauer-female.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Tubo-acciaio-galvanizzato-giunti-rapidi-Bauer-BAU-female-coupling-3d.jpg',
    productUrl: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-tipo-bauer/',
    alt: 'Giunti Bauer gyorscsatlakozó idom, gyártói műszaki ábra',
    note: 'A Giunti hivatalos Bauer gyorscsatlakozós csőtermékoldalához tartozó, Bauer-kivitelű csatlakozó ábrája.',
  },
  {
    slug: 'anfor-fejes-idom',
    file: 'public/images/giunti/coupling-anfor-female.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Tubo-acciaio-galvanizzato-con-giunti-anfor-female-coupling-hooks-3d.jpg',
    productUrl: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-anfor/',
    alt: 'Giunti Anfor gyorscsatlakozó kampós idom, gyártói műszaki ábra',
    note: 'A Giunti hivatalos Anfor gyorscsatlakozós csőtermékoldalához tartozó, Anfor-kivitelű csatlakozó ábrája.',
  },
  {
    slug: 'ferrari-gombcsatlakozo',
    file: 'public/images/giunti/pipe-ferrari.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Tubo-acciaio-galvanizzato-giunti-rapidi-sferici-Ferrari-S2F-2-giunti-spa.jpg',
    productUrl: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-sferici-ferrari/',
    alt: 'Giunti Ferrari gömbcsatlakozós horganyzott öntözőcső',
    note: 'A Giunti hivatalos Ferrari gömbcsatlakozós csőtermékoldalának termékfotója; a fotó a komplett csőváltozatot mutatja.',
  },
  {
    slug: 'mellini-fejes-idom',
    file: 'public/images/giunti/pipe-robur.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Tubo-acciaio-galvanizzato-giunti-rapidi-Robur-ROB-1-giunti-spa.jpg',
    productUrl: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-robur/',
    alt: 'Giunti Robur gyorscsatlakozós horganyzott öntözőcső, a korábbi Mellini rendszer mai neve',
    note: 'A Giunti hivatalos oldala szerint a korábbi Mellini gyorscsatlakozó tulajdonjogát megszerezte, és Robur néven viszi tovább; a kép a mai Robur csőváltozatot mutatja.',
  },
] as const

for (const item of items) {
  let media: any = (await payload.find({
    collection: 'media', where: { sourceUrl: { equals: item.url } }, limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  const mediaData = { alt: item.alt, sourceUrl: item.url, credit: 'Giunti S.p.A. hivatalos termékoldala' }
  media = media
    ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: mediaData as any })
    : await payload.create({ collection: 'media', overrideAccess: true, data: mediaData as any, filePath: path.join(root, item.file) } as any)

  const product: any = (await payload.find({
    collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  if (!product) throw new Error(`Nem található a Giunti termékrekord: ${item.slug}`)
  if (product.image && product.image !== media.id) throw new Error(`A(z) ${item.slug} terméknek már van másik főképe; felülírás megszakítva.`)

  const gallery = Array.isArray(product.gallery) ? product.gallery.map((entry: any) => typeof entry === 'object' ? entry.id : entry) : []
  const evidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
  const nextEvidence = evidence.filter((entry: any) => entry?.url !== item.productUrl)
  nextEvidence.push({ url: item.productUrl, note: item.note, media: media.id })

  await payload.update({
    collection: 'products', id: product.id, overrideAccess: true,
    data: {
      image: media.id,
      gallery: [...new Set([...gallery, media.id])],
      sourceEvidence: nextEvidence,
      sourceDetails: [product.sourceDetails, item.note].filter(Boolean).filter((value: string, index: number, all: string[]) => all.indexOf(value) === index).join('\n\n'),
      reviewState: 'specs-missing',
      reviewNote: 'A gyártói termékoldalhoz illő termékkép kapcsolódik az adatlaphoz. A helyi konkrét méretváltozat és további műszaki adatok nincsenek igazolva.',
    } as any,
  })
}

console.log('Giunti Bauer, Anfor, Ferrari és Mellini/Robur termékadatlapok a típusazonos gyártói képeket kapták; méretadat nem került be.')
await payload.destroy()
