import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../payload.config'
import { wings } from '../src/app/(frontend)/termekek/[...segments]/rm-wings-content'

const apply = process.argv.includes('--apply')
const root = process.cwd()
const slugs = Object.keys(wings)
const payload = await getPayload({ config })
const filePath = (filename: string) => path.join(root, 'public/images/rm-wings', filename)
const idOf = (value: any) => typeof value === 'object' && value ? value.id : value
try {
  const allMedia = (await payload.find({ collection: 'media', limit: 2000, depth: 0, overrideAccess: true })).docs as any[]
  const media = new Map(allMedia.map((item) => [item.filename, item]))
  const requested = new Set(slugs.flatMap((slug) => [...wings[slug].gallery, ...(wings[slug].pdf ? [wings[slug].pdf!] : [])]))
  const missing = [...requested].filter((filename) => !media.has(filename))
  if (apply) for (const filename of missing) {
    if (!fs.existsSync(filePath(filename))) throw new Error(`Hiányzó helyi fájl: ${filename}`)
    const mediaDoc = await payload.create({ collection: 'media', overrideAccess: true, data: {
      alt: filename.endsWith('.pdf') ? `RM ${filename.split('-')[0]} gyártói katalógus` : `RM öntözőszárny – ${filename}`,
      sourceUrl: 'https://www.rmirrigation.com/hu/modell/esővíz-szárnyak-öntöző-gépekhez/',
      credit: 'RM Irrigation hivatalos termékoldala',
    }, filePath: filePath(filename) } as any)
    media.set(filename, mediaDoc)
  }
  const products = (await payload.find({ collection: 'products', where: { slug: { in: slugs } }, limit: 20, depth: 0, overrideAccess: true })).docs as any[]
  if (products.length !== slugs.length) throw new Error(`RM szárnytermék-rekordok: ${products.length}/${slugs.length}`)
  const plans: any[] = []
  for (const product of products) {
    const source = wings[product.slug]
    const requestedGallery = source.gallery.map((filename) => media.get(filename)?.id).filter(Boolean)
    const existingGallery = (product.gallery || []).map(idOf).filter(Boolean)
    const gallery = [...new Set([...existingGallery, ...requestedGallery])]
    const galleryHashes = new Set<string>()
    const uniqueGallery = gallery.filter((id: number) => {
      const item = allMedia.find((candidate) => candidate.id === id) || [...media.values()].find((candidate) => candidate.id === id)
      if (!item?.filename) return true
      const candidatePath = path.join(root, 'public/uploads', item.filename)
      if (!fs.existsSync(candidatePath)) return true
      const hash = createHash('sha256').update(fs.readFileSync(candidatePath)).digest('hex')
      if (galleryHashes.has(hash)) return false
      galleryHashes.add(hash)
      return true
    })
    const document = source.pdf ? media.get(source.pdf)?.id : undefined
    if (apply && (requestedGallery.length !== source.gallery.length || (source.pdf && !document))) throw new Error(`${product.slug}: nem minden médiarekord jött létre`)
    const specifications = (source.specs || []).map((line) => {
      const split = line.indexOf(':')
      return { label: split < 0 ? 'Jellemző' : line.slice(0, split), value: split < 0 ? line : line.slice(split + 1).trim() }
    })
    if (source.lengths.length) specifications.push({ label: 'Szárnyhossz', value: source.lengths.join(' / ') })
    const contentData = {
      technicalSections: [
        ...source.description.map((body, index) => ({ heading: index ? `${source.title} – további jellemzők` : 'Bemutatás', body })),
        ...(source.galleryTitle ? [{ heading: source.galleryTitle, body: 'A termék galériájában a kapcsolódó gyártói képek és ábrák láthatók.' }] : []),
      ],
      specifications,
      videos: source.video.map((id, index) => ({ title: `${source.title} – videó ${index + 1}`, url: `https://www.youtube.com/watch?v=${id}` })),
    }
    const existingHero = allMedia.find((item) => item.id === idOf(product.image))
    const cardLogoId = idOf(product.cardLogo)
    const needsHeroUpgrade = !product.image || idOf(product.image) === cardLogoId || Number(existingHero?.width || 0) < 350
    const heroImage = needsHeroUpgrade ? requestedGallery[0] : undefined
    const currentHasContent = Boolean(product.technicalSections?.length || product.specifications?.length || product.videos?.length)
    const contentMatches = currentHasContent && JSON.stringify(product.technicalSections?.map((x: any) => ({ heading: x.heading, body: x.body })) || []) === JSON.stringify(contentData.technicalSections.map(({ heading, body }) => ({ heading, body })))
      && JSON.stringify(product.specifications?.map((x: any) => ({ label: x.label, value: x.value })) || []) === JSON.stringify(contentData.specifications)
      && JSON.stringify(product.videos?.map((x: any) => ({ title: x.title, url: x.url })) || []) === JSON.stringify(contentData.videos)
    if (currentHasContent && !contentMatches) throw new Error(`${product.slug}: meglévő CMS-tartalom eltér; felülírás megtagadva.`)
    const galleryChanged = JSON.stringify(existingGallery) !== JSON.stringify(uniqueGallery)
    const documents = (product.documents || []).map(idOf).filter(Boolean)
    const documentsChanged = Boolean(document && !documents.includes(document))
    if (!currentHasContent || galleryChanged || documentsChanged || heroImage) {
      plans.push({ id: product.id, slug: product.slug, data: {
        ...(!currentHasContent ? contentData : {}),
        ...(heroImage ? { image: heroImage } : {}),
        ...(galleryChanged ? { gallery: uniqueGallery } : {}),
        ...(documentsChanged ? { documents: [...documents, document] } : {}),
      }, galleryCount: uniqueGallery.length })
    }
  }
  const condor = (await payload.find({ collection: 'products', where: { slug: { equals: 'condor' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (condor?.cardImage) {
    const existingHero = allMedia.find((item) => item.id === idOf(condor.image))
    if (!condor.image || idOf(condor.image) === idOf(condor.cardLogo) || Number(existingHero?.width || 0) < 350) {
      plans.push({ id: condor.id, slug: condor.slug, data: { image: idOf(condor.cardImage) }, galleryCount: (condor.gallery || []).length })
    }
  }
  const wingFamily = (await payload.find({ collection: 'product-families', where: { slug: { equals: 'rm-ontozoszarnyak' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const familyImage = media.get('albatros-01.jpg')
  const familyPlan = wingFamily && !wingFamily.image && familyImage ? { id: wingFamily.id, data: { image: familyImage.id } } : null
  if (!apply) {
    console.log(`Előnézet: ${plans.length} termékrekord frissíthető; ${slugs.length + 1 - plans.length} termék egyezik; ${familyPlan ? 'az RM szárnycsalád képe pótolható' : 'a családkép egyezik'}; ${missing.length} fájlhoz kell Payload médiarekord.`)
    for (const plan of plans) console.log(`${plan.slug}: ${plan.data.technicalSections?.length ?? 'meglévő'} szakasz, ${plan.data.specifications?.length ?? 'meglévő'} adat, ${plan.data.videos?.length ?? 'meglévő'} videó, ${plan.galleryCount} egyedi galériakép${plan.data.documents?.length ? ', PDF' : ''}`)
    console.log('Alkalmazáshoz: pnpm import:rm-wings-cms -- --apply (előtte készíts adatbázismentést).')
  } else {
    for (const plan of plans) await payload.update({ collection: 'products', id: plan.id, data: plan.data, depth: 0, overrideAccess: true } as any)
    if (familyPlan) await payload.update({ collection: 'product-families', id: familyPlan.id, data: familyPlan.data, depth: 0, overrideAccess: true } as any)
    console.log(`RM öntözőszárny CMS-tartalom importálva: ${plans.length} termék; családkép ${familyPlan ? 'hozzárendelve' : 'változatlan'}.`)
  }
} finally { await payload.destroy() }
