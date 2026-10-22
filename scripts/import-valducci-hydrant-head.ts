import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })

const mediaFiles = [
  {
    key: 'bayonet', file: 'public/images/valducci/hydrant-head-bayonet.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Testa-idrante-baionetta-giunti-spa.jpg',
    alt: 'Valducci hidránsfej, bajonettzáras változat',
  },
  {
    key: 'harpoon', file: 'public/images/valducci/hydrant-head-harpoon.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/testa-idrante-attacco-arpione-hydrant-head-harpoon-fitting-giunti-spa-m.jpg',
    alt: 'Valducci hidránsfej, szigonyos csatlakozású változat',
  },
  {
    key: 'compatibility', file: 'public/images/valducci/hydrant-head-compatibility-table.jpg',
    url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Teste-idrante-tabella-misura-compatibilita.jpg',
    alt: 'Valducci hidránsfejek kompatibilitási táblázata',
  },
]

const media: Record<string, any> = {}
for (const item of mediaFiles) {
  media[item.key] = (await payload.find({
    collection: 'media', where: { sourceUrl: { equals: item.url } }, limit: 1, depth: 0, overrideAccess: true,
  })).docs[0]
  if (!media[item.key]) {
    media[item.key] = await payload.create({
      collection: 'media', overrideAccess: true,
      data: { alt: item.alt, sourceUrl: item.url, credit: 'Valducci termékoldal, Giunti S.p.A. hivatalos weboldala' },
      filePath: path.join(root, item.file),
    } as any)
  }
}

const description = {
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: [
      'A Valducci hidránsfej mezőgazdasági öntözőrendszerek vízvételi pontjához készült. A gyártó két csatlakozási változatot mutat be: bajonettzáras és szigonyos kivitelben.',
      'A fej ENAB46100 alumíniumötvözetből készül. A záróelem tömítése NR-SBR, 70 Shore keménységű gumiból van. A gyártó rozsdamentes acél csavarral és visszahúzó rugóval rendelhető kiviteleket is jelez.',
      'A működés Johnson-elvű: a fej alaphelyzetben, víz jelenlétében zárt; a nyitáshoz a megfelelő hidránskulcs szükséges. A gyártó minden legyártott hidránsfejet levegős próbának vet alá. A kompatibilitási táblázat a különböző gyártók méreteinek egyeztetését segíti.',
    ].map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
}

const product = (await payload.find({
  collection: 'products', where: { slug: { equals: 'hidransfej' } }, limit: 1, depth: 0, overrideAccess: true,
})).docs[0] as any
const valducci = (await payload.find({
  collection: 'manufacturers', where: { slug: { equals: 'valducci' } }, limit: 1, depth: 0, overrideAccess: true,
})).docs[0] as any
if (!product || !valducci) throw new Error('Missing hydrant product or Valducci manufacturer record')

await payload.update({
  collection: 'manufacturers', id: valducci.id, overrideAccess: true,
  data: {
    description: 'A Valducci öntözéstechnikai márka 2004 óta a Giunti csoport része. Termékei között öntözőgépek, szűrőegységek, vezérlőelemek, valamint hidránsfejek és hozzájuk tartozó könyökök szerepelnek.',
    sourceUrl: 'https://www.giuntispa.com/valducci-brand/',
    reviewNote: 'A termékkör és a csoportkapcsolat a Giunti hivatalos Valducci márkaoldalán ellenőrizve.',
  } as any,
})

await payload.update({
  collection: 'products', id: product.id, overrideAccess: true,
  data: {
    manufacturer: valducci.id, brand: 'Valducci',
    summary: 'Bajonettzáras vagy szigonyos csatlakozású Valducci hidránsfej mezőgazdasági öntözőrendszerekhez.',
    description,
    specifications: [
      { label: 'Test anyaga', value: 'ENAB46100 alumíniumötvözet' },
      { label: 'Zárótömítés', value: 'NR-SBR gumi, 70 Shore' },
      { label: 'Működési elv', value: 'Johnson-elvű, alaphelyzetben zárt hidránsfej' },
      { label: 'Nyitás', value: 'Hidránskulccsal' },
      { label: 'Változatok', value: 'Bajonettzáras vagy szigonyos csatlakozás' },
      { label: 'Opcionális kivitel', value: 'Rozsdamentes acél csavar és visszahúzó rugó' },
      { label: 'Ellenőrzés', value: 'Minden gyártott hidránsfej levegős próbán esik át' },
    ],
    configurations: [
      { name: 'Bajonettzáras', value: "2. Testa d'idrante; kompatibilitás a gyártói táblázat szerint ellenőrizhető.", sourceUrl: 'https://www.giuntispa.com/product/testa-didrante-baionetta/' },
      { name: 'Szigonyos', value: "2. Testa d'idrante; kompatibilitás a gyártói táblázat szerint ellenőrizhető.", sourceUrl: 'https://www.giuntispa.com/product/testa-didrante-arpione/' },
    ],
    image: media.bayonet.id,
    gallery: [media.bayonet.id, media.harpoon.id],
    documents: [media.compatibility.id],
    originalUrl: 'https://www.giuntispa.com/product/testa-didrante-baionetta/',
    sourceDetails: 'A helyi rekord az eredeti magyar katalógusban általánosan Hidránsfejként szerepel. A Giunti hivatalos oldala a terméket Valducci márkanév alatt, két csatlakozási változattal kínálja; a helyi URL megmaradt, a márkakapcsolatot Valduccira javítottam.',
    sourceEvidence: [
      { url: 'https://www.giuntispa.com/product/testa-didrante-baionetta/', note: 'Bajonettzáras termékváltozat; közös műszaki leírás és kompatibilitási táblázat.' },
      { url: 'https://www.giuntispa.com/product/testa-didrante-arpione/', note: 'Szigonyos termékváltozat; közös műszaki leírás és kompatibilitási táblázat.' },
      { url: 'https://www.giuntispa.com/valducci-brand/', note: 'A Valducci márka a Giunti csoport része; a márka termékköre ellenőrizve.' },
    ],
    reviewState: 'ready',
    reviewNote: 'A helyi általános hidránsfej rekordot a gyártó két igazolt Valducci kivitelével töltöttem ki; a csatlakozási változatokat külön jelöltem, ismeretlen méret- vagy nyomásadatot nem adtam meg.',
  } as any,
})

console.log(`Updated Valducci hydrant head ${product.slug}; manufacturer relation corrected, route preserved.`)
await payload.destroy()
