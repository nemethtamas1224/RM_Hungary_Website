import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const sourceUrl = 'https://www.rovatti.it/upload/blocchi/cr_TK-Web-9026.jpg'
const productSlugs = ['rovatti-tk', 'rovatti-tk-europa']
const expectedCurrentFilename = '756f89c51ede-tk.jpg'
const sourceFile = path.join(root, 'public/images/rovatti/tk-series-official.jpg')

try {
  const products: any[] = []
  for (const slug of productSlugs) {
    const result = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 2, depth: 1, overrideAccess: true })
    if (result.docs.length !== 1) throw new Error(`Várt egy ${slug} rekord, talált: ${result.docs.length}`)
    const product: any = result.docs[0]
    if (product.status !== 'published' || !['Rovatti TK', 'Rovatti TK Europa'].includes(product.name)) {
      throw new Error(`A ${slug} termék azonosító mezői váratlanok; megszakítva.`)
    }
    const currentImage = typeof product.image === 'object' ? product.image?.filename : null
    const currentSource = typeof product.image === 'object' ? product.image?.sourceUrl : null
    if (currentSource !== sourceUrl && currentImage !== expectedCurrentFilename) {
      throw new Error(`A ${slug} meglévő képe nem az elvárt Rovatti TK kép; megszakítva.`)
    }
    products.push(product)
  }

  let media: any = (await payload.find({ collection: 'media', where: { sourceUrl: { equals: sourceUrl } }, limit: 2, depth: 0, overrideAccess: true })).docs[0]
  if (!media) {
    if (!apply) {
      console.log(JSON.stringify({ mode: 'preview', sourceUrl, sourceFile, products: products.map(p => ({ id: p.id, name: p.name, slug: p.slug, currentImage: p.image?.filename, galleryCount: p.gallery?.length || 0 })), expected: 'egy 515×515 hivatalos TK sorozatfotó; főképként mindkét sorozatmodellhez, az azonos régi galériaelem kivétele' }, null, 2))
      process.exitCode = 0
    } else {
      media = await payload.create({ collection: 'media', overrideAccess: true, data: {
        alt: 'Rovatti TK sorozatú, traktor TLT-hajtású többfokozatú szivattyú',
        sourceUrl,
        credit: 'Rovatti Pompe hivatalos termékoldala – Pompe multistadio con moltiplicatore',
      } as any, filePath: sourceFile } as any)
    }
  }

  if (apply) {
    if (!media?.id) throw new Error('A gyártói kép médiarekordja nem jött létre.')
    for (const product of products) {
      const previousEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
      const sourceEvidence = [
        ...previousEvidence.filter((item: any) => item?.url !== sourceUrl),
        { url: sourceUrl, note: 'A Rovatti hivatalos TK/TK Europa termékcsalád-oldalán közölt 515×515 pixeles sorozatfotó; a helyi modellrekordokhoz a megfelelő TK sorozatképként társítva.', media: media.id },
      ]
      await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
        image: media.id,
        gallery: [],
        sourceDetails: 'A főfotó a Rovatti hivatalos TK/TK Europa termékcsalád-oldalán közölt sorozatképből származik. A korábbi főfotó a kisebb felbontású, ugyanahhoz a sorozathoz tartozó bélyegkép volt; a galéria ugyanazt a képet ismételte, ezért a nagyobb felbontású főfotó mellett az ismétlődő galériaelemet eltávolítottuk.',
        sourceEvidence,
        reviewNote: 'A hivatalos sorozatfotó a gyártó TK és TK Europa sorozatoldalán szerepel; a kép sorozatazonosító, nem egyedi altípus-részletfotó.',
      } as any })
    }
    console.log(JSON.stringify({ mode: 'apply', media: { id: media.id, filename: media.filename, width: media.width, height: media.height, url: media.url }, products: products.map(p => ({ id: p.id, name: p.name, slug: p.slug })), sourceUrl }, null, 2))
  }
} finally {
  await payload.destroy()
}
