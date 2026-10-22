import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { gxModelContent, gxCommonEquipment } from '../src/app/(frontend)/termekek/[...segments]/gx-model-technical'
import { rmSeriesContent, rmSeriesEquipment } from '../src/app/(frontend)/termekek/[...segments]/rm-series-technical'

const apply = process.argv.includes('--apply')
const root = process.cwd()
const sourceUrl = 'https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/'
const input: Record<string, { sections: any[]; legacySections: any[]; tables: any[]; videos: Array<{ title: string; url: string }> }> = {}

for (const [slug, model] of Object.entries(gxModelContent)) {
  const prefix = model.model.replaceAll(' ', '').replace('EVO', '')
  const rows = model.table.map((row) => `Tömlő külső átmérője: ${row[0]} mm; ajánlott hossz: ${row[1]} m; maximális hossz: ${row[2]} m; vízhozam: ${row[3]} m³/h; ajánlott fúvóka: ${row[4]} mm.`)
  const legacySections: any[] = [
    { heading: `${model.model} méretrajza`, body: model.note || '', imageFile: model.dimensions || `${prefix}_Dimensioni.jpg`, imageAlt: `${model.model} méretrajza` },
  ]
  if (rows.length) legacySections.push({ heading: 'Csőméret- és teljesítményadatok', body: rows.join('\n\n') })
  legacySections.push({ heading: 'Összméretek', body: 'Általános GX méretrajz.', imageFile: 'DimensioniGX.jpg', imageAlt: 'GX csévélődob általános méretrajza' })
  if (model.tableImage !== '') legacySections.push({ heading: `${model.model} méret- és tömegtáblázata`, imageFile: `${prefix}_Tabella_2017_GB.jpg`, imageAlt: `${model.model} gyártói méret- és tömegtáblázata` })
  legacySections.push({ heading: 'Standard felszerelés', body: model.equipment.join('\n\n') })
  const sections = legacySections.filter((section) => section.heading !== 'Csőméret- és teljesítményadatok')
  const tables = rows.length ? [{
    title: 'Csőméret- és teljesítményadatok',
    column1: 'Tömlő külső átmérője (mm)', column2: 'Ajánlott tömlőhossz (m)', column3: 'Maximális tömlőhossz (m)',
    column4: 'Vízhozam (m³/h)', column5: 'Ajánlott fúvóka (mm)',
    rows: model.table.map((row) => ({ cell1: String(row[0]), cell2: String(row[1]), cell3: String(row[2]), cell4: String(row[3]), cell5: String(row[4]) })),
  }] : []
  input[slug] = { sections, legacySections, tables, videos: model.videos.map((id, i) => ({ title: `${model.model} gyártói videó ${i + 1}`, url: `https://www.youtube.com/watch?v=${id}` })) }
}

for (const [slug, model] of Object.entries(rmSeriesContent)) {
  const sections: any[] = []
  if (model.table) sections.push({ heading: `${model.label} tömlőméret- és teljesítménytáblázata`, imageFile: model.table, imageAlt: `${model.label} gyártói tömlőméret- és teljesítménytáblázata` })
  if (model.dimensions) sections.push({ heading: `${model.label} méretrajza`, imageFile: model.dimensions, imageAlt: `${model.label} gyártói méretrajza` })
  if (model.common) sections.push({ heading: 'Általános méretrajz', imageFile: model.common, imageAlt: 'RM csévélődobok általános méretrajza' })
  sections.push({ heading: 'Tömlőméret-tartomány és alkalmazási információ', body: [
    ...(rmSeriesEquipment.configurations[slug] || []),
    'A táblázatok katalógusadatokat mutatnak; a kivitel és rendelhetőség modellenként egyeztetendő.',
  ].filter(Boolean).join('\n\n') })
  const equipment = [
    ...rmSeriesEquipment.baseEquipment,
    ...(slug.includes('xj') ? rmSeriesEquipment.xjEquipment : []),
    ...(slug.includes('xjm') ? rmSeriesEquipment.xjmEquipment : []),
    ...(slug.includes('fx') ? rmSeriesEquipment.fxEquipment : []),
  ]
  sections.push({ heading: 'Standard felszerelés', body: [...equipment, 'A felszereltség modellenként és kiválasztott opciók szerint változhat.'].join('\n\n') })
  input[slug] = { sections, legacySections: sections, tables: [], videos: (model.videos || []).map((id, i) => ({ title: `${model.label} gyártói videó ${i + 1}`, url: `https://www.youtube.com/watch?v=${id}` })) }
}

const payload = await getPayload({ config })
try {
  const mediaResult = await payload.find({ collection: 'media', limit: 1000, depth: 0, overrideAccess: true })
  const mediaByName = new Map<string, any>((mediaResult.docs as any[]).map((doc) => [doc.filename, doc]))
  const requestedImages = new Set(Object.values(input).flatMap((record) => record.sections.flatMap((section) => section.imageFile ? [section.imageFile] : [])))
  const filesToImport = [...requestedImages].filter((filename) => !mediaByName.has(filename)).map((filename) => {
    const filePath = path.join(root, 'public/images/rm-products', filename)
    if (!fs.existsSync(filePath)) throw new Error(`Product technical image is missing: ${filename}`)
    return { filename, filePath }
  })
  if (apply) for (const file of filesToImport) {
    const section = Object.values(input).flatMap((record) => record.sections).find((item) => item.imageFile === file.filename)
    const created = await payload.create({
      collection: 'media', overrideAccess: true,
      data: { alt: section?.imageAlt || file.filename, sourceUrl, credit: 'RM Irrigation hivatalos termékoldala' },
      filePath: file.filePath,
    } as any)
    mediaByName.set(file.filename, created)
  }

  const productResult = await payload.find({ collection: 'products', where: { slug: { in: Object.keys(input) } }, limit: 100, depth: 0, overrideAccess: true })
  const products = productResult.docs as any[]
  if (products.length !== Object.keys(input).length) throw new Error(`Expected ${Object.keys(input).length} RM models, found ${products.length}.`)
  const plans: any[] = []
  const normalize = (value: any) => {
    const relationId = (item: any) => typeof item === 'object' && item !== null ? item.id : item
    return {
      technicalSections: (value.technicalSections || []).map((section: any) => ({
        heading: section.heading || '', body: section.body || '', image: relationId(section.image) || null, imageAlt: section.imageAlt || '',
      })),
      technicalTables: (value.technicalTables || []).map((table: any) => ({
        title: table.title || '', column1: table.column1 || '', column2: table.column2 || '', column3: table.column3 || '', column4: table.column4 || '', column5: table.column5 || '', column6: table.column6 || '',
        rows: (table.rows || []).map((row: any) => ({ cell1: row.cell1 || '', cell2: row.cell2 || '', cell3: row.cell3 || '', cell4: row.cell4 || '', cell5: row.cell5 || '', cell6: row.cell6 || '' })),
      })),
      videos: (value.videos || []).map((video: any) => ({ title: video.title || '', url: video.url || '' })),
    }
  }
  for (const product of products) {
    const content = input[product.slug]
    const resolveSections = (sections: any[]) => sections.map(({ imageFile, ...section }) => ({ ...section, ...(imageFile && mediaByName.get(imageFile) ? { image: mediaByName.get(imageFile).id } : {}) }))
    const data = { technicalSections: resolveSections(content.sections), technicalTables: content.tables, videos: content.videos }
    const legacyData = { technicalSections: resolveSections(content.legacySections), technicalTables: [], videos: content.videos }
    const current = normalize(product)
    if (JSON.stringify(current) === JSON.stringify(normalize(data))) continue
    if (JSON.stringify(current) !== JSON.stringify(normalize(legacyData)) && (current.technicalSections.length || current.technicalTables.length || current.videos.length)) throw new Error(`${product.slug} already has different technical CMS data; refusing to overwrite.`)
    plans.push({ id: product.id, slug: product.slug, data })
  }

  if (!apply) {
    console.log(`Dry run: ${plans.length} products ready; ${Object.keys(input).length - plans.length} already match; ${filesToImport.length} technical images need media records.`)
    for (const product of products) console.log(`${product.slug}: ${input[product.slug].sections.length} sections, ${input[product.slug].tables.length} tables, ${input[product.slug].videos.length} videos`)
    console.log('Use --apply to migrate the existing model tables, dimensions, equipment notes and videos to editable product fields.')
  } else {
    for (const plan of plans) await payload.update({ collection: 'products', id: plan.id, data: plan.data, depth: 0, overrideAccess: true } as any)
    console.log(`Imported editable technical content for ${plans.length} RM products.`)
  }
} finally {
  await payload.destroy()
}
