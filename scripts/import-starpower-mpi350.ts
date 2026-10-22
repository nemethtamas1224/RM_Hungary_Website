import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const source = 'https://www.rmhungary.hu/index.php?alkat=15'
const imageUrl = 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image4.png'
const text = 'Az MPI 350 központi vezérlőegység a dízelmotoros vízszivattyú működését felügyeli. Elektronikus kártyája figyeli az olajnyomást, a motor hőmérsékletét, a töltőgenerátort, a vízszivattyú nyomását, az üzemanyagszintet, a motor fordulatszámát és – opcionálisan – az alacsony üzemanyagnyomást. Riasztás esetén a rendszer a motor leállításával védi a gépegységet. GSM távvezérlés opcionálisan kapcsolható hozzá.'
const description = { root: { type: 'root', format: '', indent: 0, version: 1, children: [{ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] }] } }
const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'mpi-350' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!product) throw new Error('MPI 350 rekord nem található.')
let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: imageUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
media = media
  ? await payload.update({ collection: 'media', id: media.id, overrideAccess: true, data: { alt: 'Starpower MPI 350 motoros szivattyú központi vezérlőpanel', sourceUrl: imageUrl, credit: 'RM Hungary korábbi MPI 350 termékoldala' } as any })
  : await payload.create({ collection: 'media', overrideAccess: true, data: { alt: 'Starpower MPI 350 motoros szivattyú központi vezérlőpanel', sourceUrl: imageUrl, credit: 'RM Hungary korábbi MPI 350 termékoldala' }, filePath: path.join(root, 'public/images/starpower/mpi-350-control-panel.png') } as any)
await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
  summary: 'Központi vezérlőegység dízelmotoros vízszivattyúk felügyeletéhez, opcionális GSM távvezérléssel.',
  description,
  specifications: [
    { label: 'Motorfelügyelet', value: 'Olajnyomás, hőmérséklet, fordulatszám és töltőgenerátor' },
    { label: 'Szivattyúfelügyelet', value: 'Vízszivattyú nyomása' },
    { label: 'Üzemanyag-felügyelet', value: 'Üzemanyagszint; alacsony üzemanyagnyomás opcionálisan' },
    { label: 'Védelmi működés', value: 'Riasztás esetén a motor leállítása' },
  ],
  configurations: [{ name: 'GSM távvezérlés', value: 'Opcionális kiegészítő.' }],
  image: media.id,
  originalUrl: source,
  sourceDetails: 'Az MPI 350 megnevezést, a vezérlő működését és a GSM opciót a korábbi RM Hungary motoros szivattyúegység-oldal igazolja. A termékfotón a vezérlőpanelen olvasható az MPI350 jelölés; a fotó közvetlenül a vezérlő leírása alatt szerepel.',
  sourceEvidence: [
    { url: source, note: 'MPI 350-ként azonosított központi vezérlő leírása, felügyelt motor- és szivattyúadatok, védelmi riasztások és opcionális GSM.' },
    { url: imageUrl, note: 'A korábbi RM Hungary termékoldal MPI 350 leírása alatt megjelenő fotó; a vezérlőpanelen MPI350 felirat olvasható.', media: media.id },
  ],
  reviewState: 'specs-missing',
  reviewNote: 'A kép és a leírás a korábbi RM Hungary termékoldal alapján azonosított; külön aktuális Starpower MPI 350 adatlap nem került elő.'
} as any })
console.log('Starpower MPI 350: magyar leírás, igazolt felügyeleti funkciók, opcionális GSM és azonosított termékfotó hozzáadva.')
await payload.destroy()
