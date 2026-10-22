import { getPayload } from 'payload'
import fs from 'node:fs'
import path from 'node:path'
import config from '../payload.config'
import { sections as gxSections, familyOverviewData as gxMeta } from '../src/app/(frontend)/termekek/[...segments]/gx-family-overview'
import { sections as xjSections, familyOverviewData as xjMeta } from '../src/app/(frontend)/termekek/[...segments]/xj-family-overview'
import { sections as xjmSections, familyOverviewData as xjmMeta } from '../src/app/(frontend)/termekek/[...segments]/xjm-family-overview'
import { sections as fxSections, familyOverviewData as fxMeta } from '../src/app/(frontend)/termekek/[...segments]/fx-family-overview'

const apply = process.argv.includes('--apply')
const root = process.cwd()
const sources = [
  { slug: 'rm-gx', meta: gxMeta, sections: gxSections },
  { slug: 'rm-xj', meta: xjMeta, sections: xjSections },
  { slug: 'rm-xjm', meta: xjmMeta, sections: xjmSections },
  { slug: 'rm-magnum', meta: fxMeta, sections: fxSections },
]
const payload = await getPayload({ config })

try {
  const mediaResult = await payload.find({ collection: 'media', limit: 1000, depth: 0, overrideAccess: true })
  const mediaByName = new Map<string, any>((mediaResult.docs as any[]).map((item) => [item.filename, item]))
  const requestedFiles = new Set<string>()
  for (const source of sources) for (const section of source.sections as any[]) {
    if (section.image) requestedFiles.add(section.image)
    if (section.extra) requestedFiles.add(section.extra)
  }
  const filesToImport = [...requestedFiles].filter((filename) => !mediaByName.has(filename)).map((filename) => {
    const filePath = ['public/images/rm-products', 'public/images/rm-families'].map((folder) => path.join(root, folder, filename)).find((candidate) => fs.existsSync(candidate))
    if (!filePath) throw new Error(`Source image not found: ${filename}`)
    return { filename, filePath }
  })
  if (apply) for (const file of filesToImport) {
    const alt = sources.flatMap((source) => source.sections as any[]).find((section) => section.image === file.filename || section.extra === file.filename)
    const label = alt?.alt || alt?.extraAlt || file.filename
    const media = await payload.create({ collection: 'media', overrideAccess: true, data: { alt: label, credit: 'RM Irrigation hivatalos termékcsalád-oldala' }, filePath: file.filePath } as any)
    mediaByName.set(file.filename, media)
  }
  const plans: Array<{ id: number; slug: string; data: any }> = []

  for (const source of sources) {
    const family = (await payload.find({ collection: 'product-families', where: { slug: { equals: source.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
    if (!family) throw new Error(`Missing family: ${source.slug}`)
    const overviewSections = source.sections.map((section: any) => {
      const media = (filename?: string) => {
        if (!filename) return undefined
        const item = mediaByName.get(filename)
        if (!item && !apply) return undefined
        if (!item) throw new Error(`${source.slug}: media not found (${filename})`)
        return item.id
      }
      return {
        heading: section.title,
        body: section.paragraphs?.join('\n\n') || section.text || '',
        image: media(section.image),
        imageAlt: section.alt || section.title,
        secondaryImage: media(section.extra),
        secondaryImageAlt: section.extraAlt || section.title,
      }
    })
    const data = {
      overviewTitle: source.meta.title,
      overviewIntro: source.meta.intro.join('\n\n'),
      overviewSections,
    }
    const current = {
      overviewTitle: family.overviewTitle || '',
      overviewIntro: family.overviewIntro || '',
      overviewSections: (family.overviewSections || []).map((section: any) => ({
        heading: section.heading || '', body: section.body || '',
        image: typeof section.image === 'object' ? section.image?.id : section.image,
        imageAlt: section.imageAlt || '',
        secondaryImage: typeof section.secondaryImage === 'object' ? section.secondaryImage?.id : section.secondaryImage,
        secondaryImageAlt: section.secondaryImageAlt || '',
      })),
    }
    if (JSON.stringify(current) === JSON.stringify(data)) continue
    if (current.overviewTitle || current.overviewIntro || current.overviewSections.length) throw new Error(`${source.slug} already has different CMS overview content; refusing to overwrite.`)
    plans.push({ id: family.id, slug: source.slug, data })
  }

  if (!apply) {
    console.log(`Dry run: ${plans.length} family overviews ready; ${sources.length - plans.length} already match; ${filesToImport.length} source images need Payload media records.`)
    for (const plan of plans) console.log(`${plan.slug}: ${plan.data.overviewSections.length} sections, ${plan.data.overviewSections.filter((section: any) => section.image).length} primary images`)
    console.log('Use --apply to import the reviewed existing family content into editable Payload fields.')
  } else {
    for (const plan of plans) {
      await payload.update({ collection: 'product-families', id: plan.id, data: plan.data, depth: 0, overrideAccess: true } as any)
      console.log(`Updated ${plan.slug}`)
    }
    console.log(`Imported ${plans.length} RM family overviews.`)
  }
} finally {
  await payload.destroy()
}
