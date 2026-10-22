import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
const sources = {
  one: 'https://www.giuntispa.com/product/filtroquarz-1c/',
  two: 'https://www.giuntispa.com/product/filtroquarz-2c/',
}

try {
  const result = await payload.find({ collection: 'products', where: { slug: { equals: 'kvarchomokos-kozegszuro' } }, limit: 1, depth: 1, overrideAccess: true })
  const product = result.docs[0] as any
  if (!product) throw new Error('A kvarchomokos Giunti-termékrekord nem található.')
  const configurations = (product.configurations || []).map((item: any) => ({
    name: item.name,
    value: item.value,
    sourceUrl: item.name === 'FILTROQUARZ 2C' ? sources.two : sources.one,
  }))
  if (!configurations.some((item: any) => item.name === 'FILTROQUARZ 1C') || !configurations.some((item: any) => item.name === 'FILTROQUARZ 2C')) {
    throw new Error('A várt FILTROQUARZ 1C/2C konfigurációpár nem található.')
  }
  const sourceEvidence = [
    { url: sources.one, note: 'FILTROQUARZ 1C termékleírás, termékfotó, konfigurációs tábla és működési ábra.' },
    { url: sources.two, note: 'FILTROQUARZ 2C termékleírás, termékfotó és konfigurációs tábla.' },
  ]
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', product: product.name, id: product.id, configurations, sourceEvidence }, null, 2))
  if (apply) await payload.update({ collection: 'products', id: product.id, data: { configurations, sourceEvidence } as any, overrideAccess: true })
} finally {
  await payload.destroy()
}
