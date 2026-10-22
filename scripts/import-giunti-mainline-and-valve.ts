import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })
const legacy = 'https://www.rmhungary.hu/index.php?alkat=13'
const assets = [
  { key: 'pipes', url: 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image12(1).jpeg', file: 'public/images/giunti/galvanized-pipes.jpg', alt: 'Giunti horganyzott acélcsövek öntözőrendszer gerincvezetékéhez' },
  { key: 'couplings', url: 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image13(1).jpeg', file: 'public/images/giunti/galvanized-pipe-couplings.jpg', alt: 'Giunti öntözőcsövek gyorscsatlakozói' },
  { key: 'valve', url: 'https://www.rmhungary.hu/tartalom/feltoltott_kepek/kepek/image17(1).jpeg', file: 'public/images/giunti/gate-valve-fitting.jpg', alt: 'Giunti tolózáras idom' },
] as const
const mediaByKey = new Map<string, any>()
for (const item of assets) {
  let doc: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: item.url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  const data = { sourceUrl: item.url, alt: item.alt, credit: 'RM Hungary Giunti termékkategória' }
  doc = doc ? await payload.update({ collection: 'media', id: doc.id, overrideAccess: true, data: data as any }) : await payload.create({ collection: 'media', overrideAccess: true, data: data as any, filePath: path.join(root, item.file) } as any)
  mediaByKey.set(item.key, doc)
}
const findProduct = async (slug: string) => (await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map(text => ({ type: 'paragraph', format: '', indent: 0, version: 1, children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })

const pipeline: any = await findProduct('horganyzott-gerincvezetek')
const gate: any = await findProduct('tolozar')
if (!pipeline || !gate) throw new Error('Nem található a Giunti gerincvezeték vagy tolózár rekord.')
await payload.update({ collection: 'products', id: pipeline.id, overrideAccess: true, data: {
  summary: 'Horganyzott acélcsőrendszer öntözőhálózatok gerincvezetékének kialakításához, gyorscsatlakozós kivitelekkel.',
  description: richText(['A horganyzott acélcsövek öntözőrendszerek gerincvezetékének kiépítésére szolgálnak. A csőrendszer gyorscsatlakozós elemekkel állítható össze; a korábbi hazai kínálat Mellini és Bauer csatlakozású csöveket is bemutatott.']),
  image: mediaByKey.get('pipes').id,
  gallery: [mediaByKey.get('pipes').id, mediaByKey.get('couplings').id],
  sourceDetails: 'A magyar terméktípus és két hozzá közvetlenül kapcsolt kép a korábbi RM Hungary Giunti-oldalról származik. A Giunti jelenlegi hivatalos kínálatában külön Bauer, Robur/Mellini, Anfor és Ferrari gyorscsatlakozós horganyzott csőoldalak szerepelnek; ezek az egyedi csövek, méretek és csatlakozások nem lettek összevonva vagy feltételezésből a helyi generikus rekordhoz rendelve.',
  sourceEvidence: [
    { url: legacy, note: 'A kategória horganyzott gerincvezetékeket és Mellini/Bauer csatlakozású csöveket nevez meg; a két galériakép ehhez a blokkhoz tartozik.', media: mediaByKey.get('pipes').id },
    { url: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-tipo-bauer/', note: 'Giunti hivatalos Bauer gyorscsatlakozós horganyzott csőoldal; pontos helyi modellméret nem igazolt.' },
    { url: 'https://www.giuntispa.com/product/tubo-acciaio-galvanizzato-con-giunti-rapidi-robur/', note: 'Giunti hivatalos Robur/Mellini gyorscsatlakozós horganyzott csőoldal; pontos helyi modellméret nem igazolt.' },
  ],
  reviewState: 'specs-missing',
  reviewNote: 'A kategória és képek egyeznek; egyedi csőméretet, falvastagságot és nyomást a helyi rekord nem azonosít.'
} } as any)
await payload.update({ collection: 'products', id: gate.id, overrideAccess: true, data: {
  summary: 'Tolózáras idom a Giunti öntözőrendszerek szerelvényei között.',
  description: richText(['A tolózáras idom a Giunti öntözőrendszerek szerelvénykínálatának része.']),
  image: mediaByKey.get('valve').id,
  gallery: [mediaByKey.get('valve').id],
  sourceDetails: 'A terméknév és a hozzá közvetlenül feliratozott termékkép a korábbi RM Hungary Giunti kategóriaoldalról származik. A pontos méretet, anyagot, nyomásfokozatot és aktuális gyártói megfeleltetést az elérhető források nem igazolják.',
  sourceEvidence: [{ url: legacy, note: 'A forrásoldal külön „Tolózáras idom” felirattal közli a kapcsolt képet.', media: mediaByKey.get('valve').id }],
  reviewState: 'specs-missing',
  reviewNote: 'Az eredeti kép és terméktípus egyezik. Nem rendeltem hozzá feltételezett műszaki adatot.'
} } as any)
console.log('Giunti: horganyzott gerincvezeték és tolózáras idom leírása/képei hozzáadva, műszaki specifikációk nélkül.')
await payload.destroy()
