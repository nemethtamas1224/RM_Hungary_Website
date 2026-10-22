import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

const items = [
  {
    slug: 'ontozofejek-vizagyuk',
    imageId: null,
    sourceUrl: 'https://www.giuntispa.com/wp-content/uploads/2017/11/verde_macchine_irrigatrici_semoventi_F1-1-600x400.jpg',
    file: 'public/images/giunti/tornado-f1-category.jpg',
    alt: 'Giunti Tornado F1 öntöződob szórófej-kocsival',
    credit: 'Giunti S.p.A. hivatalos termékoldala',
    description: 'Öntözőfejek és vízágyúk a mezőgazdasági területek egyenletes vízellátásához.',
  },
  {
    slug: 'ontozesi-automatika',
    imageId: 142,
    description: 'Öntözésvezérlők és szerelvények a rendszerek működtetéséhez és szabályozásához.',
  },
  {
    slug: 'aramfejleszto-kivitelek',
    imageId: 584,
    description: 'Dízel-, traktorhajtású és napelemes áramfejlesztő-kivitelek mezőgazdasági energiaellátáshoz.',
  },
] as const

try {
  const plan: Array<{ category: any; imageId: number | string | null; mediaItem?: (typeof items)[number] }> = []
  for (const item of items) {
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: item.slug }, catalogRole: { equals: 'catalog' } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const category: any = result.docs[0]
    if (!category) throw new Error(`Hiányzó aktív kategória: ${item.slug}`)

    let imageId: any = item.imageId
    let mediaItem: any
    if ('sourceUrl' in item) {
      const existing = await payload.find({
        collection: 'media',
        where: { sourceUrl: { equals: item.sourceUrl } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      mediaItem = existing.docs[0] ? undefined : item
      imageId = existing.docs[0]?.id ?? null
      if (!existing.docs[0] && !apply) imageId = '(új Giunti média előnézet)'
    }

    const currentImageId = typeof category.image === 'object' ? category.image?.id : category.image
    if (currentImageId && imageId && String(currentImageId) !== String(imageId)) {
      throw new Error(`${item.slug}: már másik kép van kapcsolva (${currentImageId}); felülírás megszakítva.`)
    }
    if (currentImageId && !imageId && !mediaItem) imageId = currentImageId

    plan.push({ category, imageId, mediaItem })
  }

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    changes: plan.map(({ category, imageId, mediaItem }) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageId: mediaItem ? 'create official Giunti media' : imageId,
      description: items.find(item => item.slug === category.slug)?.description,
    })),
  }, null, 2))

  if (apply) {
    for (const entry of plan) {
      const item: any = items.find(candidate => candidate.slug === entry.category.slug)
      let imageId: any = entry.imageId
      if (entry.mediaItem) {
        const media: any = await payload.create({
          collection: 'media',
          overrideAccess: true,
          data: { alt: item.alt, sourceUrl: item.sourceUrl, credit: item.credit },
          filePath: path.join(root, item.file),
        } as any)
        imageId = media.id
      }
      await payload.update({
        collection: 'categories',
        id: entry.category.id,
        overrideAccess: true,
        data: { image: imageId, description: item.description } as any,
      })
    }
    console.log('A három üres kategóriakártya képe és rövid leírása összekapcsolva.')
  }
} finally {
  await payload.destroy()
}
