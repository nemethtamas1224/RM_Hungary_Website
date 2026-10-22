import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const sourceUrl = 'https://www.rmirrigation.com/public/cataloghi2021/Gx2021_Inglese_Cod203.pdf'
const fileName = 'RM-GX-2021-catalogue.pdf'
const productSlug = 'rm-1100-gx'
const table = {
  title: '1100 GX – tömlőméret- és teljesítményadatok (gyártói katalógus, 2021)',
  column1: 'Tömlő külső átmérője (mm)',
  column2: 'Ajánlott tömlőhossz (m)',
  column3: 'Maximális tömlőhossz (m)',
  column4: 'Vízhozam (m³/h)',
  column5: 'Ajánlott fúvóka (mm)',
  rows: [
    ['110', '730', '760', '29–90', '20–28'],
    ['120', '700', '730', '40–130', '24–34'],
    ['125', '670', '700', '44–140', '24–36'],
    ['135', '570', '600', '44–160', '24–40'],
    ['140', '550', '580', '52–175', '26–42'],
  ].map(([cell1, cell2, cell3, cell4, cell5]) => ({ cell1, cell2, cell3, cell4, cell5 })),
}

const payload = await getPayload({ config })
let tempFile: string | undefined
try {
  const product = (await payload.find({ collection: 'products', where: { slug: { equals: productSlug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (!product) throw new Error(`A termék nem található: ${productSlug}`)

  const existingPdf = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  let pdfMedia = existingPdf
  if (apply && !pdfMedia) {
    const response = await fetch(sourceUrl, { headers: { 'User-Agent': 'RM-Hungary product catalogue updater' } })
    if (!response.ok) throw new Error(`A gyártói katalógus letöltése sikertelen: HTTP ${response.status}`)
    const data = Buffer.from(await response.arrayBuffer())
    if (data.subarray(0, 5).toString() !== '%PDF-') throw new Error('A gyártói URL nem PDF fájlt adott vissza.')
    tempFile = path.join(os.tmpdir(), `rm-1100-gx-${process.pid}.pdf`)
    await fs.writeFile(tempFile, data)
    pdfMedia = await payload.create({
      collection: 'media',
      overrideAccess: true,
      data: { alt: 'RM GX termékcsalád 2021-es gyártói katalógusa – 1100 GX műszaki adatai', sourceUrl, credit: 'RM Irrigation hivatalos gyártói katalógus, 2021' } as any,
      filePath: tempFile,
    } as any)
  }

  const currentTables = (product.technicalTables || []).map((item: any) => ({
    title: item.title || '', column1: item.column1 || '', column2: item.column2 || '', column3: item.column3 || '', column4: item.column4 || '', column5: item.column5 || '', column6: item.column6 || '',
    rows: (item.rows || []).map((row: any) => ({ cell1: row.cell1 || '', cell2: row.cell2 || '', cell3: row.cell3 || '', cell4: row.cell4 || '', cell5: row.cell5 || '', cell6: row.cell6 || '' })),
  }))
  const expectedTable = [{
    title: table.title,
    column1: table.column1,
    column2: table.column2,
    column3: table.column3,
    column4: table.column4,
    column5: table.column5,
    column6: '',
    rows: table.rows.map((row) => ({ ...row, cell6: '' })),
  }]
  const existingDocuments = (product.documents || []).map((item: any) => typeof item === 'object' ? item.id : item)
  const documentIds = pdfMedia?.id ? [...new Set([...existingDocuments, pdfMedia.id])] : existingDocuments
  const sourceEvidence = [...(product.sourceEvidence || [])].filter((item: any) => item.url !== sourceUrl)
  if (pdfMedia?.id) sourceEvidence.push({ url: sourceUrl, note: 'Az RM GX 2021-es gyártói katalógusa; az 1100 GX modelltáblázata a 21. oldalon található.', media: pdfMedia.id })

  const contentMatches = JSON.stringify(currentTables) === JSON.stringify(expectedTable)
  const documentMatches = !apply || (Boolean(pdfMedia?.id) && documentIds.includes(pdfMedia.id))
  if (!apply) {
    console.log(`Előnézet: ${product.name}; 1 gyártói műszaki táblázat (5 méretváltozat); gyártói katalógus=${existingPdf ? 'már betöltve' : 'letöltés szükséges'}; táblázat egyezik=${contentMatches}`)
    console.log('Alkalmazás: -- --apply')
  } else if (contentMatches && documentMatches && product.reviewState === 'ready') {
    console.log(`${product.name}: már egyezik, nincs módosítás.`)
  } else {
    await payload.update({
      collection: 'products',
      id: product.id,
      overrideAccess: true,
      data: {
        technicalTables: [table],
        documents: documentIds,
        sourceEvidence,
        sourceDetails: 'A termékoldali képek, méretrajzok és standard felszerelés a 1100 GX gyártói adatlapról származnak. Az 1100 GX tömlőméret- és teljesítménytáblázatát, valamint a letölthető GX katalógust az RM 2021-es gyártói katalógusa tartalmazza (21. oldal). A gyártói modelloldal videógalériája üres; modellspecifikus külön brosúra nem szerepel rajta.',
        reviewState: 'ready',
        reviewNote: 'A 1100 GX modelladatlapját, méretrajzait és felszerelését az RM hivatalos modelloldala, a tömlőméret- és teljesítményadatokat az RM GX 2021 katalógusának 21. oldala igazolja. A gyártói oldalon nincs videó és külön modellbrosúra.',
      } as any,
    })
    console.log(`Frissítve: ${product.name}; katalógus médiája ${pdfMedia?.id}; 5 táblázatsor; termékellenőrzés=ready`)
  }
} finally {
  if (tempFile) await fs.rm(tempFile, { force: true })
  await payload.destroy()
}
