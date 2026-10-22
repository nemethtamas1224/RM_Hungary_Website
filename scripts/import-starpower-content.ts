import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })

const sources = {
  manufacturer: 'https://starpower.it/',
  pumps: 'https://starpower.it/gruppi_motopompa.asp',
  generators: 'https://starpower.it/gruppi_elettrogeni.asp',
  pto: 'https://starpower.it/gruppi_cardano.asp',
  apollo: 'https://starpower.it/apollo.asp',
}
const mediaSpecs = [
  ['motor-pump.jpg', 'https://starpower.it/images/prodotti/gruppi_motopompa/gruppi_motopompa01.jpg', 'Starpower motoros szivattyúegység'],
  ['diesel-generator.jpg', 'https://starpower.it/images/prodotti/gruppi_elettrogeni/gruppi_elettrogeni01.jpg', 'Starpower dízelmotoros áramfejlesztő'],
  ['pto-generator.jpg', 'https://starpower.it/images/prodotti/gruppi_cardano/gruppi_cardano01.jpg', 'Starpower traktor kardánhajtású áramfejlesztő'],
  ['apollo.jpg', 'https://starpower.it/images/prodotti/apollo/apollo01.jpg', 'Starpower Apollo napelemes szivattyúrendszer'],
] as const
const media: Record<string, any> = {}
for (const [file, sourceUrl, alt] of mediaSpecs) {
  let item: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!item) item = await payload.create({
    collection: 'media', overrideAccess: true,
    data: { alt, sourceUrl, credit: 'Starpower S.r.l. hivatalos termékoldala' },
    filePath: path.join(root, 'public/images/starpower', file),
  } as any)
  media[file] = item
}
const richText = (paragraphs: string[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({
    type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
  })) },
})

const productContent = [
  {
    slug: 'starpower-motoros-szivattyuegyseg', image: media['motor-pump.jpg'], source: sources.pumps,
    summary: 'Mezőgazdasági és ipari feladatokra konfigurálható Starpower motoros szivattyúegységek.',
    paragraphs: [
      'A Starpower motoros szivattyúegységeket mezőgazdasági és ipari alkalmazásokra tervezi. A gyártó példaként az esőztető, csepegtető és pivot öntözést, valamint tűzoltó rendszereket, szennyvízátemelést és speciális folyadékok szivattyúzását említi.',
      'A konfiguráció a feladathoz igazítható: választható léghűtéses vagy vízhűtéses dízelmotor, kézi vagy automatizált vezérlés, vízszintes centrifugálszivattyú vagy önfelszívó kivitel, illetve tiszta vízhez, szennyezett vízhez vagy különleges folyadékokhoz illő szivattyú. A kivitel lehet fix alapkeretes vagy utánfutó kocsira szerelt; a gyártó festett vagy tűzihorganyzott változatot is kínál.',
      'A pontos egységet a szükséges teljesítmény, vízhozam, nyomás és felhasználás alapján kell kiválasztani. A gyártó egyedi tervezést, helyszíni próbát és értékesítés előtti, illetve utáni támogatást is jelez.',
    ], specs: [['Rögzítés','Fix alapkeret vagy kocsira szerelt kivitel'],['Motor','Léghűtéses vagy vízhűtéses dízelmotor'],['Szivattyú','Vízszintes centrifugál vagy önfelszívó kivitel; feladathoz választva'],['Vezérlés','Kézi indítású vagy automatizált kivitel']],
  },
  {
    slug: 'starpower-dizel-aramfejlesztok', image: media['diesel-generator.jpg'], source: sources.generators,
    summary: 'Starpower dízelmotoros áramfejlesztők hálózattól távoli, ideiglenes vagy tartalék áramellátáshoz.',
    paragraphs: [
      'A Starpower áramfejlesztőket a gyártó olaszországi telephelyén tervezi és gyártja. A kínálatban a szabványosított ECO sorozat 8–60 kVA tartományban szerepel; az ECO gépek egy- vagy háromfázisú kivitelben is elérhetők, kompakt méretük miatt kisebb telephelyekre, építkezésekre, bérbeadásra és hálózattól távoli használatra is alkalmasak.',
      'A gyártó leírása szerint a vezérlő kézi vagy automatikus üzemre készül, az egységek pedig a megrendelési feladat szerint módosíthatók. A lehetséges változatok között nyitott vagy hangszigetelt burkolat, fix alap, illetve utánfutó kocsi szerepel. Egyedi méretezéshez az adott terhelés és üzemelési mód alapján kell kiválasztani a teljes konfigurációt.',
    ], specs: [['ECO sorozat','8–60 kVA'],['Fázis','Egyfázisú vagy háromfázisú kivitel'],['Motorok','Kohler Engine vagy FPT Iveco dízelmotorok a gyártói leírás szerint'],['Vezérlés','Kézi vagy automatikus kivitel'],['Elhelyezés','Nyitott vagy hangszigetelt; fix alap vagy kocsi']],
  },
  {
    slug: 'starpower-eco', image: media['diesel-generator.jpg'], source: sources.generators,
    summary: 'Kompakt, egy- vagy háromfázisú Starpower ECO áramfejlesztők 8–60 kVA teljesítménytartományban.',
    paragraphs: [
      'Az ECO sorozat 8–60 kVA közötti Starpower áramfejlesztőket foglal magában. A gyártó kompakt, szabványosított kialakítást, egy- és háromfázisú változatokat, valamint kézi és automatikus vezérlést ismertet.',
      'A sorozatot magánépületek, kisebb vállalkozások, informatikai helyiségek, építkezések, bérbeadás és olyan helyszínek számára kínálják, ahol korlátozott a rendelkezésre álló hely. A motort, a generátort, a burkolatot és a csatlakozásokat a választott változat adatlapja szerint kell egyeztetni.',
    ], specs: [['Teljesítménytartomány','8–60 kVA'],['Fázis','Egy- vagy háromfázisú változat'],['Vezérlés','Kézi és/vagy automatikus kivitel']],
  },
  {
    slug: 'starpower-gts', image: media['pto-generator.jpg'], source: sources.pto,
    summary: 'GTS kardánhajtású áramfejlesztő traktorhoz; mezőgazdasági tartalék energiaellátáshoz.',
    paragraphs: [
      'A Starpower GTS kardánhajtású áramfejlesztő traktorhoz kapcsolható, mezőgazdasági felhasználásra. A gyártó a GTS-t a GTE sorozattal együtt 10–80 kVA közötti kínálatként ismerteti; a kimenet 400/230 V, háromfázisú, 50 Hz-es.',
      'A GTS szinkrongenerátora kefés, kétpólusú és 3000 fordulat/perc névleges fordulatszámú. A gyártói leírás compound feszültségszabályozást, hárompontos traktorfüggesztésű, tűzihorganyzott tartószerkezetet, valamint elektronikus kijelzővel és állítható differenciálvédelemmel ellátott vezérlőt ismertet.',
    ], specs: [['Sorozat','GTS'],['Kimenet','400/230 V, háromfázisú, 50 Hz'],['Teljesítménytartomány','A GTS/GTE család együtt: 10–80 kVA'],['Generátor','Kefés, szinkron, kétpólusú'],['Fordulatszám','3000 ford./perc'],['Szabályozás','Compound, ±5% a gyártói oldal szerint'],['Csatlakozás','Traktor hárompontos függesztése']],
  },
  {
    slug: 'starpower-gte', image: media['pto-generator.jpg'], source: sources.pto,
    summary: 'GTE kardánhajtású áramfejlesztő traktorhoz, elektronikus feszültségszabályozással.',
    paragraphs: [
      'A Starpower GTE kardánhajtású áramfejlesztő traktorhoz kapcsolható, mezőgazdasági felhasználásra. A gyártó a GTE-t a GTS sorozattal együtt 10–80 kVA közötti kínálatként ismerteti; a kimenet 400/230 V, háromfázisú, 50 Hz-es.',
      'A GTE szinkrongenerátora kefe nélküli, négypólusú és 1500 fordulat/perc névleges fordulatszámú. A gyártói leírás elektronikus feszültségszabályozást, hárompontos traktorfüggesztésű, tűzihorganyzott tartószerkezetet, valamint kijelzős vezérlőt és állítható differenciálvédelmet ismertet.',
    ], specs: [['Sorozat','GTE'],['Kimenet','400/230 V, háromfázisú, 50 Hz'],['Teljesítménytartomány','A GTS/GTE család együtt: 10–80 kVA'],['Generátor','Kefe nélküli, szinkron, négypólusú'],['Fordulatszám','1500 ford./perc'],['Szabályozás','Elektronikus, ±1% a gyártói oldal szerint'],['Csatlakozás','Traktor hárompontos függesztése']],
  },
  {
    slug: 'apollo-napelemes-vizszivattyu', image: media['apollo.jpg'], source: sources.apollo,
    summary: 'Apollo napelemes rendszer elektromos szivattyú működtetésére, vízkiemeléshez és öntözéshez.',
    paragraphs: [
      'Az Apollo a Starpower napelemes vízszivattyú-rendszere. Napelemmodulok és energiaátalakító, illetve vezérlőegység segítségével működtet elektromos szivattyút. A gyártó példaként mély kutakból történő vízemelést, tárolótartályok feltöltését, mezőgazdasági öntözést és ivóvízellátást sorol fel.',
      'A rendszer fő elemei a szivattyú, a vezérlőegység és a szükséges teljesítményhez méretezett napelemmodulok. A gyártó szerint hálózati áramforrás vagy áramfejlesztő is csatlakoztatható kiegészítő energiaforrásként, így gyenge napsütésnél és éjszaka is kialakítható folyamatosabb üzem.',
      'Az Apollo vizet tárol, nem villamos energiát; a gyártói leírás alapján ezért a rendszer nem igényel akkumulátoros energiatárolást. A konkrét összeállítást a szivattyú igénye és a helyszín adottságai alapján kell méretezni.',
    ], specs: [['Energiaforrás','Napelemmodulok; hálózat vagy áramfejlesztő kiegészítőként csatlakoztatható'],['Fő egységek','Elektromos szivattyú, vezérlő és napelemmodulok'],['Felhasználás','Kútvízkiemelés, tartályfeltöltés, mezőgazdasági öntözés, vízellátás'],['Energiatárolás','A rendszer a vizet tárolja; akkumulátor nem szükséges a gyártói leírás szerint']],
  },
]

for (const item of productContent) {
  const product = (await payload.find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!product) throw new Error(`Missing Starpower product: ${item.slug}`)
  await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
    summary: item.summary, description: richText(item.paragraphs), specifications: item.specs.map(([label, value]) => ({ label, value })),
    image: item.image.id, gallery: [item.image.id], originalUrl: item.source,
    sourceDetails: `A termékcsalád szintű leírás és kép a Starpower hivatalos oldaláról származik. A gyártó konfigurációhoz kötött részletes adatokat az online konfigurátorral egyezteti.`,
    sourceEvidence: [{ url: item.source, note: 'Hivatalos termékcsaládoldal és a rajta szereplő termékkép.', media: item.image.id }],
    reviewState: 'ready', reviewNote: 'A családszintű leírás és a fő kép hivatalos Starpower-oldallal egyezik; az egyedi konfigurációs adatok nem kerültek kitalálásra.',
  } as any })
}

await payload.update({ collection: 'manufacturers', id: (await payload.find({ collection: 'manufacturers', where: { slug: { equals: 'starpower' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]!.id, overrideAccess: true, data: {
  description: 'Az olasz Starpower 1999 óta tervez és gyárt áramfejlesztőket, motoros szivattyúegységeket, kardánhajtású generátorokat és napelemes vízszivattyú-rendszereket. Termékeit saját tesztüzemében ellenőrzi, és egyedi konfigurációkat is készít.',
  sourceUrl: sources.manufacturer, reviewNote: 'A termékkör, az alapítás éve és a gyártói tevékenység a Starpower hivatalos oldalán ellenőrizve.',
} as any })

const categoryDescriptions: [string, string][] = [
  ['motoros-szivattyuegysegek', 'Starpower motoros szivattyúegységek mezőgazdasági öntözési és ipari feladatokra. A konfiguráció motor, szivattyú, vezérlés és rögzítési mód szerint választható.'],
  ['dizel-aramfejlesztok', 'Starpower dízelmotoros áramfejlesztők tartalék és hálózattól távoli energiaellátáshoz; az ECO sorozat 8–60 kVA tartományban szerepel.'],
  ['traktorhajtasu-aramfejlesztok', 'Starpower GTS és GTE kardánhajtású generátorok mezőgazdasági energiaellátáshoz, traktorhoz kapcsolható kivitelben.'],
  ['napelemes-rendszerek', 'Az Apollo napelemes rendszer elektromos szivattyút működtet vízkiemeléshez, tárolótartály-töltéshez és mezőgazdasági öntözéshez.'],
]
for (const [slug, description] of categoryDescriptions) {
  const category = (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (category) await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { description } as any })
}

for (const item of [
  { slug: 'starpower-aramfejlesztok', image: media['diesel-generator.jpg'], summary: 'Dízelmotoros áramfejlesztők tartalék vagy hálózattól távoli energiaellátáshoz; a Starpower ECO sorozat 8–60 kVA tartományban érhető el.' },
  { slug: 'starpower-szivattyuegysegek', image: media['motor-pump.jpg'], summary: 'Mezőgazdasági és ipari motoros szivattyúegységek, a szükséges motorhoz, szivattyúhoz és telepítési módhoz konfigurálva.' },
]) {
  const family = (await payload.find({ collection: 'product-families', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (family) await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: {
    summary: item.summary, image: item.image.id, sourceUrl: item.slug === 'starpower-aramfejlesztok' ? sources.generators : sources.pumps,
    sourceDetails: 'A termékcsalád leírása és bemutatóképe a Starpower hivatalos gyártói oldaláról származik.',
    reviewNote: 'Hivatalos Starpower termékcsaládoldallal ellenőrizve.', status: 'published',
  } as any })
}

await payload.destroy()
console.log(`Starpower: ${productContent.length} termékoldal és ${categoryDescriptions.length} kategórialeírás frissítve.`)
