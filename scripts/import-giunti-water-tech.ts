import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payload = await getPayload({ config })

const mediaFiles = {
  hydrocyclone: { file: 'public/images/giunti/hydrocyclone.jpg', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Separatore-sabbia-IDROCICLONE-giunti-spa-600x600.jpg', alt: 'Giunti homokleválasztó hidrociklon' },
  hydroTable: { file: 'public/images/giunti/hydrocyclone-table.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Separatore-sabbia-IDROCICLONE-TABELLA.png', alt: 'Giunti hidrociklon műszaki konfigurációs táblázat' },
  hydroScheme: { file: 'public/images/giunti/hydrocyclone-scheme.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Separatore-sabbia-IDROCICLONE-schema.png', alt: 'Giunti hidrociklon működési vázlata' },
  filtroline: { file: 'public/images/giunti/filtroline.jpg', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/stazione-filtraggio-filtroline-filtering-station-giunti-spa-m-1-600x600.jpg', alt: 'Giunti FILTROLINE hálós szűrő' },
  filtrolineScheme: { file: 'public/images/giunti/filtroline-scheme.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Prod-510-Filtroline_FILTROLINE-SCHEMA.png', alt: 'Giunti FILTROLINE működési vázlata' },
  quartz1: { file: 'public/images/giunti/filtroquarz-1c.jpg', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/stazione-filtraggio-filtroquarz1c-filtering-station-giunti-spa-m-600x600.jpg', alt: 'Giunti FILTROQUARZ 1C eg kamrás kvarchomok-szűrő' },
  quartz2: { file: 'public/images/giunti/filtroquarz-2c.jpg', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROQUARZ-2-giunti-spa-600x600.jpg', alt: 'Giunti FILTROQUARZ 2C kétkamrás kvarchomok-szűrő' },
  quartzTable1: { file: 'public/images/giunti/filtroquarz-table.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROQUARZ-TABELLA.png', alt: 'Giunti FILTROQUARZ 1C mérettáblázat' },
  quartzTable2: { file: 'public/images/giunti/filtroquarz-2c-table.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/FILTROQUARZ-2-TABELLA.png', alt: 'Giunti FILTROQUARZ 2C mérettáblázat' },
  quartzScheme: { file: 'public/images/giunti/filtroquarz-scheme.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/filtroquarz-1-schema.png', alt: 'Giunti FILTROQUARZ szűrő működési vázlata' },
  fertilizer: { file: 'public/images/giunti/fertilizer.jpg', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/FERTILIZZATORE-1-giunti-spa-600x600.jpg', alt: 'Giunti tápoldatozó berendezés' },
  fertilizerTable: { file: 'public/images/giunti/fertilizer-table.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/FERTILIZZATORE-TABELLA.png', alt: 'Giunti tápoldatozó konfigurációs táblázat' },
  fertilizerScheme: { file: 'public/images/giunti/fertilizer-scheme.png', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/FRTILIZZATORE-SCHEMA.png', alt: 'Giunti tápoldatozó működési vázlata' },
  layflat: { file: 'public/images/giunti/sunnyhose.jpg', url: 'https://www.giuntispa.com/wp-content/uploads/2017/11/Sunnyhose-layflat-ico-giunti-spa-600x600.jpg', alt: 'Giunti Sunnyhose lapos tömlő' },
}

const media = {} as Record<keyof typeof mediaFiles, any>
for (const [key, item] of Object.entries(mediaFiles) as [keyof typeof mediaFiles, (typeof mediaFiles)[keyof typeof mediaFiles]][]) {
  media[key] = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: item.url } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!media[key]) media[key] = await payload.create({ collection: 'media', overrideAccess: true, data: { alt: item.alt, sourceUrl: item.url, credit: 'Giunti S.p.A. hivatalos termékoldala' }, filePath: path.join(root, item.file) } as any)
}

const richText = (paragraphs: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, children: paragraphs.map((text) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }] })) } })

const pages = [
  {
    slug: 'homokszuro-hidrociklon', source: 'https://www.giuntispa.com/product/separatore-di-sabbia-ad-idrociclone/', image: media.hydrocyclone,
    gallery: [media.hydrocyclone, media.hydroTable, media.hydroScheme], docs: [media.hydroTable],
    summary: 'Centrifugális homokleválasztó, amely a vízből folyamatosan választja le a nehezebb homokszemcséket és szervetlen részecskéket.',
    paragraphs: [
      'A hidrociklon a belépő víz örvénylését és a centrifugális erőt használja a homok és más nehéz, szervetlen részecskék leválasztására. Működés közben nincs mozgó alkatrésze, a víz továbbhaladása folyamatos.',
      'A kiválasztott szilárd részecskék a gyűjtőedénybe ülepednek, amelynek nyílásán keresztül a lerakódás eltávolítható.',
      'A konstrukció tűzihorganyzott acélból készül, központi csavarral rögzített acélfedéllel. Az alapfelszereltség leeresztőszelepet és használati-karbantartási útmutatót tartalmaz.',
    ],
    specs: [['Kivitel','Centrifugális homok- és szervetlenrészecske-leválasztó'],['Működés','Folyamatos, mozgó alkatrész nélkül'],['Anyag','Tűzihorganyzott acél'],['Alapfelszereltség','Leeresztőszelep, használati és karbantartási útmutató']],
  },
  {
    slug: 'acelbetetes-halos-szuro', source: 'https://www.giuntispa.com/product/filtroline/', image: media.filtroline,
    gallery: [media.filtroline, media.filtrolineScheme], docs: [media.filtrolineScheme],
    summary: 'Hálós szűrő csepegtető és mikroöntözési rendszerekhez, horganyzott acél házzal és rozsdamentes acél tartóbetéttel.',
    paragraphs: [
      'A Giunti FILTROLINE belső/külső szűrésű hálós szűrő. Horganyzott acélháza, alumínium fedele, poliészter szűrőhálója és AISI 304 rozsdamentes acél tartóbetétje van.',
      'Az alapfelszereltség karimás csatlakozásokat, 150 mesh szűrőhálót, leeresztőcsapot, két nyomásmérőt és használati-karbantartási útmutatót tartalmaz. A gyártó további szűrési finomságokat is elérhetőként jelez.',
    ],
    specs: [['Szűrőház','Tűzihorganyzott acél'],['Fedél','Alumínium'],['Szűrőháló','Poliészter, alapváltozat 150 mesh'],['Tartóbetét','AISI 304 rozsdamentes acél'],['Csatlakozás','Karimás'],['Alapfelszereltség','Leeresztőcsap, 2 nyomásmérő, használati-karbantartási útmutató']],
    configs: [
      ['ACX26005','10 l/s; 600 l/perc; 36 m³/h; DN80; PN10; legnagyobb üzemi nyomás 10 bar; 150 mesh; 0,1 mm; 18 kg'],
      ['ACX26008','20 l/s; 1 200 l/perc; 72 m³/h; DN100; PN10; legnagyobb üzemi nyomás 10 bar; 150 mesh; 0,1 mm; 22 kg'],
      ['ACX26011','30 l/s; 1 800 l/perc; 108 m³/h; DN125; PN10; legnagyobb üzemi nyomás 10 bar; 150 mesh; 0,1 mm; 27 kg'],
      ['ACX26014','50 l/s; 3 000 l/perc; 180 m³/h; DN150; PN10; legnagyobb üzemi nyomás 10 bar; 150 mesh; 0,1 mm; 39 kg'],
    ],
  },
  {
    slug: 'kvarchomokos-kozegszuro', source: 'https://www.giuntispa.com/product/filtroquarz-1c/', image: media.quartz1,
    gallery: [media.quartz1, media.quartz2, media.quartzTable1, media.quartzTable2, media.quartzScheme], docs: [media.quartzTable1, media.quartzTable2],
    summary: 'Egy- és kétkamrás kvarchomokos szűrők felszíni vizek elsődleges tisztításához, csepegtető rendszerek védelmére.',
    paragraphs: [
      'A FILTROQUARZ szűrők folyókból, csatornákból, tározókból és tavakból származó víz előszűrésére készülnek. A kvarchomok megköti az algákat, a szerves anyagokat és azokat a mikroorganizmusokat, amelyek eltömíthetik a mikroöntöző-rendszereket.',
      'A tartály tűzihorganyzott acélból készül, 0,5 mm-es résekkel kialakított polipropilén vízelosztó elemekkel. Az alapfelszereltség manométert, leeresztő- és biztonsági szelepet, menetes csatlakozásokat és használati-karbantartási útmutatót tartalmaz. A kvarchomok nem része az alapfelszereltségnek.',
      'Az egykamrás FILTROQUARZ 1C mellett a gyártó kétkamrás FILTROQUARZ 2C változatot is bemutat. A kétkamrás kivitelben négy ellenőrző nyílás segíti a kvarchomok betöltését és eltávolítását.',
    ],
    specs: [['Szűrőközeg','Kvarchomok; a töltet nem része az alapfelszereltségnek'],['Tartály','Tűzihorganyzott acél'],['Vízelosztók','Polipropilén, 0,5 mm-es résekkel'],['Alapfelszereltség','Manométer, leeresztőszelep, biztonsági szelep, menetes csatlakozások, útmutató']],
    configs: [['FILTROQUARZ 1C','Egykamrás változat; termékazonosító: 540(5)'],['FILTROQUARZ 2C','Kétkamrás változat, négy ellenőrző nyílással; termékazonosító: 550']],
  },
  {
    slug: 'tapoldatozo-tartaly', source: 'https://www.giuntispa.com/product/fertilizzatore/', image: media.fertilizer,
    gallery: [media.fertilizer, media.fertilizerTable, media.fertilizerScheme], docs: [media.fertilizerTable],
    summary: 'Tápoldatozó berendezés esőztető, csepegtető és mikroöntözési rendszerekhez, függőleges vagy vízszintes kivitelben.',
    paragraphs: [
      'A Giunti tápoldatozó vízben oldódó vagy folyékony műtrágyák bejuttatására használható esőztető, csepegtető és mikroöntözési rendszerekben.',
      'A gyártói leírás szerint legalább 0,5 bar nyomáskülönbséggel működik, és legfeljebb 6 bar nyomást visel el. A beépített áramlásmérővel 1–25 liter/perc között szabályozható a rendszerbe juttatott folyadék mennyisége.',
      'Függőleges és vízszintes változatban készül. A konstrukció tűzihorganyzott acélból áll; a standard felszerelés nyitószelepeket, skálázott menetes áramlásmérőt, leeresztőszelepet és használati-karbantartási útmutatót tartalmaz.',
    ],
    specs: [['Felhasználás','Esőztető, csepegtető és mikroöntözési rendszerek'],['Használható anyag','Vízben oldódó és folyékony műtrágya'],['Működési nyomáskülönbség','Minimum 0,5 bar'],['Legnagyobb nyomás','6 bar'],['Szabályozható adagolás','1–25 l/perc, áramlásmérővel'],['Kivitel','Függőleges vagy vízszintes; tűzihorganyzott acél']],
    configs: [['Függőleges','Függőleges kivitel'],['Vízszintes','Vízszintes kivitel']],
  },
  {
    slug: 'layflat-szalagcso', source: 'https://www.giuntispa.com/product/sunnyhose-layflat/', image: media.layflat,
    gallery: [media.layflat], docs: [],
    summary: 'Rugalmas, textilhálóval erősített PVC lapostömlő öntözővíz szállítására, Layflat gyűjtővezetékek és tápvezetékek kialakításához.',
    paragraphs: [
      'A Sunnyhose egyrétegű PVC tömlőjét nagy szilárdságú, szőtt textilháló erősíti. A háló kialakítása a nyomásosztálytól függ; a cső rugalmas, jól kezelhető, könnyen fektethető és felszedhető.',
      'Mezőgazdasági öntözésben gyűjtővezetékként használható; közvetlenül csatlakoztathatók hozzá a csepegtetőszárnyak. A tömlő hajlékonysága megkönnyíti a csepegtetőszalag-idomok furatának elkészítését és felszerelését.',
      'A textilerősítés egyenletesen osztja el a terhelést. A felszínen fektetett tömlővel elkerülhetők lehetnek az elásást vagy útkeresztezést igénylő megoldások. A nyomáshatár a Sunnyhose kivitelétől függ.',
    ],
    specs: [['Csőanyag','Egyrétegű PVC'],['Erősítés','Nagy szilárdságú szőtt textilháló'],['Felhasználás','Öntözővíz-gyűjtővezeték és vízszállító tápvezeték'],['Nyomáshatár','Kivitelfüggő']],
  },
]

for (const item of pages) {
  const product = (await payload.find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!product) throw new Error(`Missing Giunti product: ${item.slug}`)
  await payload.update({
    collection: 'products', id: product.id, overrideAccess: true,
    data: {
      summary: item.summary, description: richText(item.paragraphs), specifications: item.specs.map(([label, value]) => ({ label, value })),
      configurations: (((item as (typeof pages)[number] & { configs?: string[][] }).configs) || []).map(([name, value]) => ({ name, value, sourceUrl: item.source })),
      image: item.image.id, gallery: item.gallery.map((entry: any) => entry.id), documents: item.docs.map((entry: any) => entry.id),
      originalUrl: item.source, sourceDetails: `A Giunti S.p.A. hivatalos termékoldalán közölt magyar/olasz leírás, műszaki adatok, változatok és képek.`,
      sourceEvidence: [{ url: item.source, note: 'Termékleírás, termékfotók, műszaki jellemzők, táblázat és működési ábra.' }],
      reviewState: 'ready', reviewNote: 'A fő termékkép és a terméktartalom a megadott hivatalos Giunti termékoldalhoz illeszkedik.',
    },
  } as any)
  console.log(`Updated Giunti ${item.slug}: media=${item.gallery.map((entry: any) => entry.id).join(',')}`)
}

const descriptions: Record<string, string> = {
  'csovek-vezetekek': 'Giunti Layflat lapostömlők és horganyzott acél gerincvezetékek vízszállításhoz, öntözőhálózatok kiépítéséhez.',
  'vizszurok': 'Csepegtető és öntözőrendszeri szűrők felszíni vizek tisztítására; a megfelelő kivitel a vízhozam, a vízforrás és az üzemi nyomás alapján választható.',
  'tapoldatozas': 'Tápoldatozó berendezések öntözőhálózatba illesztett, szabályozható folyékony tápanyag-kijuttatáshoz.',
}
for (const [slug, description] of Object.entries(descriptions)) {
  const category = (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (category) await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { description } } as any)
}

console.log('Giunti szűrő- és víztechnikai termékoldalak frissítve: 5')
await payload.destroy()
