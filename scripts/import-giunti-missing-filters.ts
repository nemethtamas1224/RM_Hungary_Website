import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const familySlug = 'giunti-szuro-rendszerek'
const manufacturerSlug = 'giunti'
const categorySlug = 'vizszurok'
const credit = 'Giunti S.p.A. hivatalos termékoldala'

const mediaFiles = {
  wire: ['wire-lock.jpg', 'https://www.giuntispa.com/wp-content/uploads/2018/10/render-wire-lock-600x424.jpg', 'Giunti Wire Lock gyorsnyitó szűrőfedél'],
  wireExtract: ['wire-lock-extract.png', 'https://www.giuntispa.com/wp-content/uploads/2018/10/giunti-spa-wire-lock-2-pull-to-extract.png', 'Wire Lock fedél nyitási művelete'],
  wireLift: ['wire-lock-lift.png', 'https://www.giuntispa.com/wp-content/uploads/2018/10/giunti-spa-wire-lock-3-lift-the-closure.png', 'Wire Lock fedél kiemelése'],
  wireInside: ['wire-lock-inside.png', 'https://www.giuntispa.com/wp-content/uploads/2018/10/giunti-spa-wire-lock-4-working-inside.png', 'Wire Lock fedél belső működése'],
  auto2c: ['filtroquarz-2c-auto.jpg', 'https://www.giuntispa.com/wp-content/uploads/2017/11/stazione-filtraggio-filtroquarz2c-filtering-station-giunti-spa-m-600x600.jpg', 'Giunti FILTROQUARZ 2C automatikus visszamosással'],
  auto2cA: ['filtroquarz-2c-auto-murphy.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-2c-lavaggio-murphy.png', 'FILTROQUARZ 2C automatikus visszamosás – részlet'],
  auto2cB: ['filtroquarz-2c-auto-tappo.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-2c-lavaggio-tappo.png', 'FILTROQUARZ 2C automatikus visszamosás – záróelem'],
  auto2cTable: ['filtroquarz-2c-auto-table.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-2c-con-lavaggio-tabella.png', 'FILTROQUARZ 2C automatikus visszamosás konfigurációs táblája'],
  auto2cScheme: ['filtroquarz-2c-auto-scheme.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-2c-con-lavaggio-schema.png', 'FILTROQUARZ 2C automatikus visszamosás működési ábrája'],
  manual2c: ['filtroquarz-2c-manual.jpg', 'https://www.giuntispa.com/wp-content/uploads/2019/03/stazione-filtraggio-filtroquarz2-lavaggio-manuale-filtering-station-giunti-spa-m-600x600.jpg', 'Giunti FILTROQUARZ 2C kézi visszamosással'],
  battery1cA: ['filtroquarz-1c-battery-2.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-1C-20lt-600x525.png', 'FILTROQUARZ 1C automatikus mosótelep – összeállítás'],
  battery1cB: ['filtroquarz-1c-battery-3.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-1C-20lt-6-600x451.png', 'FILTROQUARZ 1C automatikus mosótelep – részlet'],
  battery1cCap: ['filtroquarz-1c-battery-cap.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-1C-tappo.png', 'FILTROQUARZ 1C záróelem'],
  battery1cTable: ['filtroquarz-1c-battery-table.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtroquarz-1C-batteria-TABELLA.png', 'FILTROQUARZ 1C automatikus mosótelep konfigurációs táblája'],
  battery1cScheme: ['filtroquarz-1c-battery-scheme.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROQUARZ-1-batteria-schema.png', 'FILTROQUARZ 1C automatikus mosótelep működési ábrája'],
  fly: ['filtrofly.jpg', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROFLY_MEDIA-giunti-spa-600x600.jpg', 'Giunti FILTROFLY hálós szűrő'],
  flyDetail: ['filtrofly-detail.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROFLY_MEDIA.png', 'Giunti FILTROFLY részletrajz'],
  flyTable: ['filtrofly-table.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROFLY_hidrofly-tabella.png', 'Giunti FILTROFLY konfigurációs táblázat'],
  sfer: ['filtrosfer.jpg', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROSFER_MEDIA-giunti-spa-600x600.jpg', 'Giunti FILTROSFER hálós szűrő'],
  sferDetail: ['filtrosfer-detail.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROSFER.png', 'Giunti FILTROSFER részletrajz'],
  sferTable: ['filtrosfer-table.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROSFER-TABELLA.png', 'Giunti FILTROSFER konfigurációs táblázat'],
  sferScheme: ['filtrosfer-filtroline.png', 'https://www.giuntispa.com/wp-content/uploads/2017/11/Filtrosfer_foto_filtroline.png', 'Giunti FILTROSFER és FILTROLINE működési részlet'],
} as const

type MediaKey = keyof typeof mediaFiles
const mediaFor: Record<string, { image: MediaKey; gallery: MediaKey[]; docs: MediaKey[] }> = {
  'giunti-wire-lock': { image: 'wire', gallery: ['wire', 'wireExtract', 'wireLift', 'wireInside'], docs: [] },
  'giunti-filtroquarz-2c-auto': { image: 'auto2c', gallery: ['auto2c', 'auto2cA', 'auto2cB', 'auto2cTable', 'auto2cScheme'], docs: ['auto2cTable'] },
  'giunti-filtroquarz-2c-manual': { image: 'manual2c', gallery: ['manual2c'], docs: [] },
  'giunti-filtroquarz-1c-auto': { image: 'battery1cA', gallery: ['battery1cA', 'battery1cB', 'battery1cCap', 'battery1cTable', 'battery1cScheme'], docs: ['battery1cTable'] },
  'giunti-filtrofly': { image: 'fly', gallery: ['fly', 'flyDetail', 'flyTable'], docs: ['flyTable'] },
  'giunti-filtrosfer': { image: 'sfer', gallery: ['sfer', 'sferDetail', 'sferTable', 'sferScheme'], docs: ['sferTable'] },
}

const products = [
  {
    slug: 'giunti-wire-lock', name: 'Wire Lock gyorsnyitó szűrőfedél', modelCode: null, productKind: 'accessory', sortOrder: 10,
    source: 'https://www.giuntispa.com/product/wire-lock/',
    summary: 'Gyorsan nyitható, nyomás alatt nem bontható fedél öntözőszűrőkhöz.',
    paragraphs: [
      'A Wire Lock gyorsnyitó fedél műanyagból készül. A gyártó leírása szerint könnyű, ellenáll a fénynek, vegyi anyagoknak és műtrágyáknak, valamint újrahasznosítható.',
      'A fedél nyitása és zárása kis erőt igényel. A kialakítás megakadályozza a nyitást nyomás alatt; a gyártó 16 bar névleges üzemi nyomást közöl.',
    ],
    specs: [['Anyag','Műanyag'],['Tulajdonságok','Könnyű, fény-, vegyszer- és műtrágyaálló, újrahasznosítható'],['Nyitás','Nyomás alatt nem nyitható'],['Névleges üzemi nyomás','PN 16 bar']],
  },
  {
    slug: 'giunti-filtroquarz-2c-auto', name: 'FILTROQUARZ 2C automatikus visszamosással', modelCode: null, productKind: 'model', sortOrder: 20,
    source: 'https://www.giuntispa.com/product/automatic-back-flush-filtroquarz-2c/',
    summary: 'Kétkamrás kvarchomokszűrő automatikus visszamosó szelepekkel és vezérlőegységgel.',
    paragraphs: [
      'A kétkamrás FILTROQUARZ 2C a folyók, csatornák, tározók és tavak vizének előszűrésére készült. A kvarchomok visszatartja az algákat, szerves anyagokat és a mikroöntöző-rendszerek eltömődését okozó apró részecskéket. A kvarchomok nem része az alapfelszereltségnek.',
      'A szűrő tűzihorganyzott acélból készül, 0,5 mm-es résekkel ellátott polipropilén vízelosztókkal. A gyártó négy ellenőrző nyílást említ a kvarchomok betöltéséhez és eltávolításához.',
      'Az automatikus visszamosó rendszer két háromjáratú hidropneumatikus szelepet, négyállású elektromechanikus TIC vezérlőegységet, differenciálnyomás-kapcsolót és karimás gyűjtőcsöveket tartalmaz. A visszamosást úgy kell beállítani, hogy a szűrő bemenete és kimenete közötti nyomáskülönbség legfeljebb 1,5 bar legyen.',
    ],
    specs: [['Kamrák száma','2'],['Tartály','Tűzihorganyzott acél'],['Vízelosztók','Polipropilén, 0,5 mm-es résekkel'],['Ellenőrző nyílások','4'],['Automatikus visszamosás','2 háromjáratú hidropneumatikus szelep; 4 állású TIC vezérlő; differenciálnyomás-kapcsoló; karimás gyűjtőcsövek'],['Visszamosási nyomáskülönbség','Legfeljebb 1,5 bar'],['Szűrőközeg','Kvarchomok, nem tartozék']],
  },
  {
    slug: 'giunti-filtroquarz-2c-manual', name: 'FILTROQUARZ 2C kézi visszamosással', modelCode: null, productKind: 'model', sortOrder: 30,
    source: 'https://www.giuntispa.com/product/manual-back-flush-filtroquarz-2c/',
    summary: 'Kétkamrás kvarchomokszűrő kézi visszamosáshoz, felszíni vizek előszűrésére.',
    paragraphs: [
      'A kézi visszamosású FILTROQUARZ 2C folyókból, csatornákból, tározókból és tavakból származó víz első szűrésére szolgál. A kvarchomok megköti a mikroöntöző-rendszerek eltömődését okozó apró algákat, szerves anyagokat és mikroorganizmusokat.',
      'A kétkamrás szűrő tűzihorganyzott acélból, 0,5 mm-es résekkel kialakított polipropilén vízelosztókkal készül. Négy nyílás szolgál a kvarchomok betöltésére és eltávolítására. A visszamosás automatizálásához külön hidropneumatikus szelepek és vezérlőegység alkalmazható; a nyomáskülönbség legfeljebb 1,5 bar lehet.',
    ],
    specs: [['Kamrák száma','2'],['Tartály','Tűzihorganyzott acél'],['Vízelosztók','Polipropilén, 0,5 mm-es résekkel'],['Ellenőrző nyílások','4'],['Visszamosás','Kézi; automatizálás külön hidropneumatikus szelepekkel és vezérlővel lehetséges'],['Visszamosási nyomáskülönbség','Legfeljebb 1,5 bar'],['Szűrőközeg','Kvarchomok']],
  },
  {
    slug: 'giunti-filtroquarz-1c-auto', name: 'FILTROQUARZ 1C automatikus mosóteleppel', modelCode: null, productKind: 'model', sortOrder: 40,
    source: 'https://www.giuntispa.com/product/filtroquarz-1c-with-automatic-washing-battery/',
    summary: 'Egykamrás kvarchomokszűrő automatikus visszamosó szelepekkel és vezérlőegységgel.',
    paragraphs: [
      'A FILTROQUARZ 1C felszíni víz első szűrésére készült; a gyártó folyókat, csatornákat, tározókat és tavakat nevez meg. A kvarchomok visszatartja a mikroöntözést eltömítő algákat, szerves anyagokat és mikroorganizmusokat. Megfelelő szűrőrendszerhez a gyártó legalább két kvarchomokszűrő telepítését ajánlja.',
      'A szűrő tűzihorganyzott acélból, 0,5 mm-es résekkel ellátott polipropilén vízelosztókkal készül. Az automatikus mosótelep két háromjáratú hidropneumatikus szelepet, négyállású TIC elektromechanikus vezérlőegységet, differenciálnyomás-kapcsolót és karimás gyűjtőcsöveket tartalmaz. A kvarchomok nem része az alapfelszereltségnek.',
      'A visszamosást úgy kell beállítani, hogy a szűrő bemenete és kimenete közötti nyomáskülönbség legfeljebb 1,5 bar legyen.',
    ],
    specs: [['Kamrák száma','1'],['Tartály','Tűzihorganyzott acél'],['Vízelosztók','Polipropilén, 0,5 mm-es résekkel'],['Automatikus visszamosás','2 háromjáratú hidropneumatikus szelep; 4 állású TIC vezérlő; differenciálnyomás-kapcsoló; karimás gyűjtőcsövek'],['Visszamosási nyomáskülönbség','Legfeljebb 1,5 bar'],['Szűrőközeg','Kvarchomok, nem tartozék'],['Gyártói ajánlás','Legalább 2 kvarchomokszűrő a szűrőrendszerben']],
  },
  {
    slug: 'giunti-filtrofly', name: 'FILTROFLY hálós szűrő', modelCode: null, productKind: 'model', sortOrder: 50,
    source: 'https://www.giuntispa.com/product/filtrofly/',
    summary: 'Belső/külső működésű, horganyzott acélházas hálós szűrő poliészter hálóval.',
    paragraphs: [
      'A FILTROFLY teljes egészében horganyzott acélból készül. Belső/külső működésű szűrőháza acélfedéllel, poliészter szűrőhálóval és AISI 304 rozsdamentes acél tartóbetéttel készül.',
      'Az alapfelszereltség menetes vagy Ferrari gömbcsatlakozásos bekötést, 150 mesh szűrőhálót, leeresztőcsapot, két nyomásmérőt és használati-karbantartási útmutatót tartalmaz. A gyártó az EU nyomástartó berendezésekre vonatkozó irányelvének való megfelelést jelzi.',
    ],
    specs: [['Szűrőház','Horganyzott acél; belső/külső működés'],['Fedél','Acél'],['Szűrőháló','Poliészter, 150 mesh'],['Tartóbetét','AISI 304 rozsdamentes acél'],['Csatlakozás','Menetes vagy Ferrari gömbcsatlakozás'],['Alapfelszereltség','Leeresztőcsap, 2 nyomásmérő, használati-karbantartási útmutató']],
  },
  {
    slug: 'giunti-filtrosfer', name: 'FILTROSFER hálós szűrő', modelCode: null, productKind: 'model', sortOrder: 60,
    source: 'https://www.giuntispa.com/product/filtrosfer/',
    summary: 'Horganyzott acélházas hálós szűrő csepegtető és mikroöntözési rendszerekhez.',
    paragraphs: [
      'A FILTROSFER hálós szűrő teljes egészében galvanizált acélból készül. A gyártó leírása szerint a szűrő belső/külső működésű; acélfedéllel, poliészter hálóval és AISI 304 rozsdamentes acél tartóbetéttel készül.',
      'Az alapfelszereltség menetes vagy Ferrari gömbcsatlakozásos bekötést, 150 mesh szűrőhálót, leeresztőcsapot, két nyomásmérőt és használati-karbantartási útmutatót tartalmaz. A gyártó az EU nyomástartó berendezésekre vonatkozó irányelvének való megfelelést jelzi.',
    ],
    specs: [['Szűrőház','Horganyzott acél; belső/külső működés'],['Fedél','Acél'],['Szűrőháló','Poliészter, 150 mesh'],['Tartóbetét','AISI 304 rozsdamentes acél'],['Csatlakozás','Menetes vagy Ferrari gömbcsatlakozás'],['Alapfelszereltség','Leeresztőcsap, 2 nyomásmérő, használati-karbantartási útmutató']],
  },
]

const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })
const payload = await getPayload({ config })

try {
  const [manufacturerResult, categoryResult, familyResult] = await Promise.all([
    payload.find({ collection: 'manufacturers', where: { slug: { equals: manufacturerSlug } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'categories', where: { slug: { equals: categorySlug } }, limit: 1, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'product-families', where: { slug: { equals: familySlug } }, limit: 1, depth: 0, overrideAccess: true }),
  ])
  const manufacturer = manufacturerResult.docs[0]
  const category = categoryResult.docs[0]
  const family = familyResult.docs[0]
  if (!manufacturer || !category || !family) throw new Error('Giunti márka, vízszűrő kategória vagy szűrőrendszer család hiányzik.')
  if (Number(family.category) !== Number(category.id) || Number(family.manufacturer) !== Number(manufacturer.id)) throw new Error('A Giunti szűrőcsalád besorolása nem egyezik a várt kategóriával/márkával.')

  const existing = await payload.find({ collection: 'products', where: { slug: { in: products.map((p) => p.slug) } }, limit: 50, depth: 0, overrideAccess: true })
  const existingSlugs = new Set((existing.docs as any[]).map((p) => p.slug))
  const missingAssets = Object.values(mediaFiles).filter(([file]) => !existsSync(path.join(root, 'public/images/giunti', file)))
  if (missingAssets.length) throw new Error(`Hiányzó előkészített forrásfájl: ${missingAssets.map(([file]) => file).join(', ')}`)

  const plan = products.map((p) => {
    const media = mediaFor[p.slug]
    return { ...p, existing: existingSlugs.has(p.slug), mainImage: mediaFiles[media.image][0], gallery: media.gallery.map((key) => mediaFiles[key][0]), documents: media.docs.map((key) => mediaFiles[key][0]) }
  })
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', manufacturer: { id: manufacturer.id, name: manufacturer.name }, category: { id: category.id, name: category.name }, family: { id: family.id, name: family.name }, products: plan.map(({ slug, name, existing, mainImage, gallery, documents }) => ({ slug, name, action: existing ? 'update' : 'create', mainImage, gallery, documents })) }, null, 2))
  if (apply) {
    const mediaIds = new Map<MediaKey, number | string>()
    for (const [key, [file, sourceUrl, alt]] of Object.entries(mediaFiles) as [MediaKey, (typeof mediaFiles)[MediaKey]][]) {
      let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
      const data = { alt, sourceUrl, credit }
      media = media
        ? await payload.update({ collection: 'media', id: media.id, data, overrideAccess: true })
        : await payload.create({ collection: 'media', data, filePath: path.join(root, 'public/images/giunti', file), overrideAccess: true } as any)
      mediaIds.set(key, media.id)
    }

    for (const p of products) {
      const media = mediaFor[p.slug]
      const data: any = {
        name: p.name, slug: p.slug, modelCode: p.modelCode, productKind: p.productKind, sortOrder: p.sortOrder,
        status: 'published', reviewState: 'ready', reviewNote: 'A termékazonosság, leírás és média a Giunti hivatalos termékoldalához ellenőrizve.',
        manufacturer: manufacturer.id, category: category.id, family: family.id, showInFamily: true,
        summary: p.summary, cardDescription: p.summary, description: richText(p.paragraphs),
        specifications: p.specs.map(([label, value]) => ({ label, value })),
        image: mediaIds.get(media.image), gallery: media.gallery.map((key) => mediaIds.get(key)), documents: media.docs.map((key) => mediaIds.get(key)),
        originalUrl: p.source, sourceDetails: 'A Giunti S.p.A. hivatalos termékoldalán közölt termékleírás, kivitel, alapfelszereltség, képek és elérhető műszaki ábrák.',
        sourceEvidence: [{ url: p.source, note: 'Termékazonosság, magyar leírás, műszaki jellemzők és a kapcsolt képek/táblázatok forrása.', media: mediaIds.get(media.image) }],
      }
      const found = (existing.docs as any[]).find((item) => item.slug === p.slug)
      if (found) await payload.update({ collection: 'products', id: found.id, data, overrideAccess: true })
      else await payload.create({ collection: 'products', data, overrideAccess: true })
    }
    console.log(`Kész: ${products.length} Giunti szűrő/tartozéktermék, ${Object.keys(mediaFiles).length} hivatalos médiaelem.`)
  }
} finally {
  await payload.destroy()
}
