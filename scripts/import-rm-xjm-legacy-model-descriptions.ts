import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const sourceUrl = 'https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/con-motore-incorporato/'
const content: Record<string, { description: string[]; sourceDetails: string }> = {
  'rm-600-xjm': {
    description: [
      'Az RM 600 XJM az RM beépített motoros szivattyúegységgel szerelt XJM családjába tartozik. A gyártó a tömlő visszatekercseléséhez nagy hatásfokú RM turbó-reduktort alkalmaz; így a feltekerés szükség esetén a beépített dízelmotor működtetése nélkül is elvégezhető.',
      'Az XJM család gépei teljes hidraulikus rendszert használnak a gép és a szívócső munkapozícióba állításához. A konkrét motor, szivattyú, csőméret és felszereltség ehhez a rekordhoz külön modelladatként nincs megadva.',
    ],
    sourceDetails: 'Az RM hivatalos XJM családoldalán közölt, családszintű jellemzők: beépített motoros szivattyúegység, RM turbó-reduktoros feltekerés, valamint a gép és a szívócső pozicionálására szolgáló teljes hidraulikus rendszer. A 600 XJM modellhez külön gyártói termékoldal vagy modellspecifikus műszaki táblázat nem szerepel a jelenlegi XJM oldalon; egyedi specifikációt nem rendeltünk hozzá.',
  },
  'rm-800-xjm': {
    description: [
      'Az RM 800 XJM az RM beépített motoros szivattyúegységgel szerelt XJM családjába tartozik. A gyártó a tömlő visszatekercseléséhez nagy hatásfokú RM turbó-reduktort alkalmaz; így a feltekerés szükség esetén a beépített dízelmotor működtetése nélkül is elvégezhető.',
      'Az XJM család gépei teljes hidraulikus rendszert használnak a gép és a szívócső munkapozícióba állításához. A konkrét motor, szivattyú, csőméret és felszereltség ehhez a rekordhoz külön modelladatként nincs megadva.',
    ],
    sourceDetails: 'Az RM hivatalos XJM családoldalán közölt, családszintű jellemzők: beépített motoros szivattyúegység, RM turbó-reduktoros feltekerés, valamint a gép és a szívócső pozicionálására szolgáló teljes hidraulikus rendszer. A 800 XJM modellhez külön gyártói termékoldal vagy modellspecifikus műszaki táblázat nem szerepel a jelenlegi XJM oldalon; egyedi specifikációt nem rendeltünk hozzá.',
  },
  'rm-magnum-xjm': {
    description: [
      'Az RM Magnum XJM az RM beépített motoros szivattyúegységgel szerelt XJM családjába tartozik. A gyártó a tömlő visszatekercseléséhez nagy hatásfokú RM turbó-reduktort alkalmaz; így a feltekerés szükség esetén a beépített dízelmotor működtetése nélkül is elvégezhető.',
      'Az XJM család gépei teljes hidraulikus rendszert használnak a gép és a szívócső munkapozícióba állításához. A gyártó az üzemanyagtartályt a Magnum XJM modelleken hátul helyezi el. A konkrét motor, szivattyú, csőméret és felszereltség ehhez a rekordhoz külön modelladatként nincs megadva.',
    ],
    sourceDetails: 'Az RM hivatalos XJM családoldalán közölt, családszintű jellemzők: beépített motoros szivattyúegység, RM turbó-reduktoros feltekerés, teljes hidraulikus pozicionálórendszer. A gyártói oldal külön megjegyzi, hogy a Magnum XJM üzemanyagtartálya hátul helyezkedik el. Külön aktuális Magnum XJM termékoldal vagy modellspecifikus műszaki táblázat nem szerepel a jelenlegi XJM oldalon; más modell adatait nem rendeltük hozzá.',
  },
}

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
})

const payload = await getPayload({ config })
try {
  const familyResult = await payload.find({
    collection: 'product-families', limit: 1, depth: 0, overrideAccess: true,
    where: { slug: { equals: 'rm-xjm' } },
  })
  const familyId = (familyResult.docs[0] as any)?.id
  if (!familyId) throw new Error('Az RM XJM termékcsalád nem található.')

  const result = await payload.find({
    collection: 'products', limit: 10, depth: 0, overrideAccess: true,
    where: { slug: { in: Object.keys(content) } },
  })
  const records = result.docs as any[]
  if (records.length !== Object.keys(content).length) throw new Error(`A várt 3 XJM-termékből ${records.length} található.`)
  const pending: any[] = []
  for (const product of records) {
    const actualFamily = typeof product.family === 'object' ? product.family?.id : product.family
    if (actualFamily !== familyId) throw new Error(`${product.slug} nem az RM XJM családhoz tartozik.`)
    const currentParagraphs = (product.description?.root?.children || []).map((paragraph: any) =>
      (paragraph.children || []).map((node: any) => node.text || '').join(''),
    )
    const isAlreadyImported = JSON.stringify(currentParagraphs) === JSON.stringify(content[product.slug].description)
      && product.sourceDetails === content[product.slug].sourceDetails
    if (isAlreadyImported) continue
    if (product.description || product.sourceDetails) throw new Error(`${product.slug} tartalma eltér a várt állapottól; felülírás nélkül megszakítva.`)
    pending.push(product)
  }

  if (!apply) {
    console.log(pending.length
      ? `Előnézet: ${pending.length} XJM termékoldal kap szerkeszthető, családszintű leírást; modelladatot nem módosítok. Forrás: ${sourceUrl}`
      : 'A három XJM leírás már a várt állapotban van; nincs módosítás.')
  } else {
    for (const product of pending) {
      const item = content[product.slug]
      await payload.update({
        collection: 'products', id: product.id, overrideAccess: true,
        data: {
          description: richText(item.description),
          sourceDetails: item.sourceDetails,
          sourceEvidence: [{ url: sourceUrl, note: 'Hivatalos XJM termékcsalád-oldal; kizárólag családszintű jellemzők.' }],
        },
      } as any)
    }
    console.log(pending.length
      ? `Kitöltve: ${pending.length} RM XJM termékleírás a termékcsalád hivatalos leírása alapján.`
      : 'A három XJM leírás már a várt állapotban van; nincs módosítás.')
  }
} finally {
  await payload.destroy()
}
