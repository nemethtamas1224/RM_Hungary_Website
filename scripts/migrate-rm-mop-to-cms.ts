import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { photos, features, options, pumpRows } from '../src/app/(frontend)/termekek/[...segments]/rm-mop-overview'

const apply = process.argv.includes('--apply')
const root = process.cwd()
const payload = await getPayload({ config })
const dir = path.join(root, 'public/images/rm-mop')
try {
  const files = [...photos, 'SistemaCWM.jpg', 'Pompe.png', 'MOP2015.pdf']
  const all = (await payload.find({ collection: 'media', limit: 2000, depth: 0, overrideAccess: true })).docs as any[]
  const media = new Map(all.map((item) => [item.filename, item]))
  const missing = files.filter((filename) => !media.has(filename))
  if (apply) for (const filename of missing) {
    const filePath = path.join(dir, filename)
    if (!fs.existsSync(filePath)) throw new Error(`MOP médiafájl hiányzik: ${filename}`)
    media.set(filename, await payload.create({ collection: 'media', overrideAccess: true, data: {
      alt: filename.endsWith('.pdf') ? 'RM MOP általános katalógus' : `RM MOP motoros szivattyúegység – ${filename}`,
      sourceUrl: 'https://www.rmirrigation.com/hu/modell/motopompe.html', credit: 'RM Irrigation hivatalos MOP termékoldala',
    }, filePath } as any))
  }
  const product = (await payload.find({ collection: 'products', where: { slug: { equals: 'rm-motoros-szivattyuegyseg' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!product) throw new Error('Az RM MOP termékrekord nem található.')
  const paragraphs = [
    'A MOP sorozat motoros szivattyúegységei új gyári motorokkal készülnek, többek között FPT (Iveco), JCB, Deutz, John Deere és Perkins motorokkal. A szivattyúk RM, Rovatti vagy Caprari nagy teljesítményű kivitelek.',
    'Az opcionális, szabadalmaztatott hőcserélő 304-es rozsdamentes acélból készül, és a szivattyú bemenetéhez csatlakozik. A zárt motorhűtő kör hőjét az öntözővíznek adja át, a motor eredeti termosztatikus szelepe által szabályozva. A ventilátor és a hagyományos hűtő elhagyásával körülbelül 8% motorteljesítmény takarítható meg; a zajszint is csökken. A rendszer intercooleres motorokhoz két hőcserélővel készülhet. Zajszint: kb. 77,5 dB 8 méteres távolságból, 1 650 1/perc motorfordulaton.',
    'Az RM szivattyúk vízszintes tengelyű, többfokozatú centrifugálszivattyúk. Közvetlenül csatlakoztathatók SAE3 karimás dízelmotorhoz vagy csupasz tengelyű villanymotorhoz. A túlméretezett, nagy igénybevételre tervezett alkatrészek a korszerű dízelmotorok mechanikai terhelésére készültek; a gyártó az alkatrészek olaszországi gyártását és minősített anyagok használatát jelzi.',
  ]
  const sections = [
    { heading: 'RM MOP motoros szivattyúegységek', body: paragraphs[0] },
    { heading: 'RM „hideg vizes” motorhűtő rendszer', body: paragraphs[1], image: media.get('SistemaCWM.jpg')?.id, imageAlt: 'Az RM motorhűtő hőcserélő rendszer ábrája' },
    { heading: 'RM nagy teljesítményű szivattyúk', body: `${paragraphs[2]}\n\n${['Nagyobb méretű tengelytámasz és A osztályú, olajkenésű főcsapágyak.','Nagy szilárdságú, edzett és megeresztett rozsdamentes acél tengely; védőpersely a tömítés környezetében.','A járókerekek és a rugalmas tengelykapcsoló rögzítése szabadalmaztatott, nagy torziós merevségű FGP nyomatékátvitellel.','Tömítőzsinóros vagy igény szerint mechanikus tengelytömítés.'].join('\n\n')}`, image: media.get('Pompe.png')?.id, imageAlt: 'RM többfokozatú szivattyú' },
    { heading: 'Választható felszerelések', body: options.join('\n\n') },
  ]
  const table = { title: 'RM szivattyúmodellek műszaki adatai', column1: 'Szivattyúmodell', column2: 'Max. szállítás (l/perc)', column3: 'Max. nyomás (bar)', column4: 'Járókerekek száma', column5: 'Max. hatásfok (%)', rows: pumpRows.map((r) => ({ cell1:r[0],cell2:r[1],cell3:r[2],cell4:r[3],cell5:r[4] })) }
  const urls = photos.map((name) => media.get(name)?.id).filter(Boolean)
  const doc = media.get('MOP2015.pdf')?.id
  if (apply && (sections.some((s) => !s.image && (s.heading.includes('hűtő') || s.heading.includes('szivattyúk'))) || urls.length !== photos.length || !doc)) throw new Error('MOP média hivatkozás nem oldható fel.')
  const videos = [{ title: 'RM MOP videógaléria', url: 'https://www.youtube.com/channel/UCcvpX7aOXLTcyrJ8G_iJQYQ?view_as=subscriber' }]
  const data = { technicalSections: sections, technicalTables: [table], videos, ...(urls.length && !product.gallery?.length ? { gallery: urls } : {}), ...(doc && !product.documents?.length ? { documents: [doc] } : {}) }
  const normalizedSections = (product.technicalSections || []).map((section: any) => ({ heading: section.heading || '', body: section.body || '', hasImage: Boolean(section.image), imageAlt: section.imageAlt || '' }))
  const normalizedTable = (product.technicalTables || []).map((item: any) => ({ title: item.title || '', column1:item.column1||'',column2:item.column2||'',column3:item.column3||'',column4:item.column4||'',column5:item.column5||'',column6:item.column6||'',rows:(item.rows||[]).map((r:any)=>({cell1:r.cell1||'',cell2:r.cell2||'',cell3:r.cell3||'',cell4:r.cell4||'',cell5:r.cell5||'',cell6:r.cell6||''})) }))
  const expectedTable = [{ title:table.title, column1:table.column1,column2:table.column2,column3:table.column3,column4:table.column4,column5:table.column5,column6:'', rows:table.rows.map((r:any)=>({...r,cell6:''})) }]
  const same = JSON.stringify(normalizedSections) === JSON.stringify(sections.map((section:any)=>({heading:section.heading,body:section.body,hasImage:Boolean(section.image),imageAlt:section.imageAlt||''})))
    && JSON.stringify(normalizedTable) === JSON.stringify(expectedTable)
    && JSON.stringify((product.videos||[]).map((v:any)=>({title:v.title||'',url:v.url||''}))) === JSON.stringify(videos)
  const hasContent = Boolean(product.technicalSections?.length || product.technicalTables?.length || product.videos?.length)
  if (same) console.log(`Előnézet: RM MOP CMS-adatok egyeznek; ${photos.length} galériakép, 1 PDF.`)
  else if (hasContent) throw new Error('MOP termék már tartalmaz eltérő CMS műszaki adatot; felülírás megtagadva.')
  else if (!apply) console.log(`Előnézet: RM MOP – ${sections.length} leíró szakasz, ${features.length} alapjellemző, ${table.rows.length} táblázatsor, ${photos.length} galériakép, 1 PDF. ${missing.length} fájl médiarekord nélkül.`)
  else { await payload.update({ collection:'products', id: product.id, data, depth:0, overrideAccess:true } as any); console.log('RM MOP terméktartalom CMS mezőkbe importálva.') }
} finally { await payload.destroy() }
