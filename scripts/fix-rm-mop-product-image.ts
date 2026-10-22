import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const product: any = (await payload.find({ collection: 'products', where: { slug: { equals: 'rm-motoros-szivattyuegyseg' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!product) throw new Error('Az RM MOP motoros szivattyúegység rekordja nem található.')

const mediaId = typeof product.cardImage === 'object' ? product.cardImage?.id : product.cardImage
if (!mediaId) throw new Error('A már használt MOP termékkártya-kép nem található.')
const family: any = (await payload.find({ collection: 'product-families', where: { slug: { equals: 'rm-szivattyuegysegek' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
if (!family) throw new Error('Az RM MOP termékcsalád rekordja nem található.')

const summary = 'RM MOP motoros szivattyúegység új gyári dízelmotorral és RM, Rovatti vagy Caprari szivattyúval.'
const legacyUrl = 'https://www.rmhungary.hu/index.php?alkat=15'
const previousEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
const sourceEvidence = [
  ...previousEvidence.filter((item: any) => item?.url !== legacyUrl),
  { url: legacyUrl, note: 'A korábbi RM Hungary oldal az RM motoros szivattyúegységet MOP sorozatként sorolja fel; a helyi, MOP 700 feliratú fotó ehhez a gépcsoporthoz kapcsolódik.', media: mediaId },
]

if (apply) {
  await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
    image: mediaId,
    cardImage: mediaId,
    gallery: [mediaId],
    summary,
    cardDescription: summary,
    sourceDetails: 'A fő- és kártyakép a helyi RM MOP 700 bemutatófotója; a gépen az MOP 700 jelölés látható. A családbemutatóban szereplő motor- és szivattyúgyártók megnevezése megmaradt. Egyedi modelladatot ehhez az általános terméktípushoz nem társítottunk.',
    sourceEvidence,
    reviewState: 'specs-missing',
    reviewNote: 'A MOP termékcsoport és a MOP 700 fotó azonosított. A fotó nem igazolja az RM MOP terméktípus összes modelljét vagy azok műszaki adatait.',
  } as any })
  await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: {
    image: mediaId,
    summary: 'RM MOP motoros szivattyúegységek gyári dízelmotorokkal és RM, Rovatti vagy Caprari szivattyúkkal.',
  } as any })
  console.log(`RM MOP termékkép bekötve: product ${product.id}, family ${family.id}, media ${mediaId}.`)
} else {
  console.log(`Előnézet: a meglévő MOP termékkártya-kép (${mediaId}) főképként/galériaképként és családképként használva; nincs adatbázis-módosítás. Alkalmazás: pnpm import:rm-mop-image -- --apply`)
}

await payload.destroy()
