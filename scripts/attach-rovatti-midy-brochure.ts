import path from 'node:path'
import os from 'node:os'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const sourceUrl = 'https://www.rovatti.it/download_file.php?id_ref_maggiorato=734'
const productSlug = 'midi-szivattyu'
const payload = await getPayload({ config })

try {
  const result: any = await payload.find({
    collection: 'products', where: { slug: { equals: productSlug } }, limit: 1, depth: 0, overrideAccess: true,
  })
  const product: any = result.docs[0]
  if (!product) throw new Error(`Product not found: ${productSlug}`)

  const existingMediaResult: any = await payload.find({
    collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 1, depth: 0, overrideAccess: true,
  })
  const existingMedia: any = existingMediaResult.docs[0]
  const docIds = (product.documents || []).map((value: any) => typeof value === 'object' ? value.id : value)
  const evidence = product.sourceEvidence || []
  const alreadyAttached = existingMedia && docIds.includes(existingMedia.id)
  const alreadyEvidenced = evidence.some((item: any) => item.url === sourceUrl)

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'preview',
    product: product.name,
    sourceUrl,
    existingMedia: existingMedia?.id || null,
    attached: Boolean(alreadyAttached),
    evidencePresent: alreadyEvidenced,
    action: alreadyAttached && alreadyEvidenced ? 'no change' : 'add official 12-page brochure; preserve existing product data and documents',
  }, null, 2))

  if (!apply || (alreadyAttached && alreadyEvidenced)) process.exitCode = 0
  else {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'rovatti-midy-'))
    try {
      const response = await fetch(sourceUrl)
      if (!response.ok) throw new Error(`Brochure download failed: HTTP ${response.status}`)
      const bytes = Buffer.from(await response.arrayBuffer())
      if (bytes.length < 20_000 || bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Downloaded file is not a valid PDF.')
      const filePath = path.join(tempDir, 'Rovatti-Midy-T0-T0F-EN.pdf')
      await writeFile(filePath, bytes)

      const media: any = existingMedia || await payload.create({
        collection: 'media', overrideAccess: true,
        data: {
          alt: 'Rovatti Midy T0-50, T0F-50 és önfelszívó változatok angol nyelvű gyártói prospektusa',
          sourceUrl,
          credit: 'Rovatti Pompe hivatalos termékprospektusa',
        } as any,
        filePath,
      } as any)
      const mediaId = media.id
      const nextDocuments = alreadyAttached ? docIds : [...docIds, mediaId]
      const nextEvidence = alreadyEvidenced ? evidence : [...evidence, {
        url: sourceUrl,
        note: 'Hivatalos 12 oldalas Midy prospektus: T0-50, T0F-50 és A önfelszívó változatok, teljesítménygörbék, méretrajzok, tömegek, alkatrészanyagok és rendelhető csatlakozócsomag.',
        media: mediaId,
      }]
      await payload.update({
        collection: 'products', id: product.id, overrideAccess: true,
        data: { documents: nextDocuments, sourceEvidence: nextEvidence } as any,
      })
      console.log(JSON.stringify({ updated: true, productId: product.id, mediaId, bytes: bytes.length }, null, 2))
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  }
} finally {
  await payload.destroy()
}
