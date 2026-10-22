import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')

// Rövid kategória-összefoglalók meglévő, kapcsolt termék- és családszövegek alapján.
// Csak üres leírást tölt ki; meglévő CMS-szöveget nem ír felül.
const entries = [
  { slug: 'kistermeloi-szivattyuk', text: 'Kompakt, traktorhajtású szivattyúk öntözéshez és folyadékszállításhoz.' },
  { slug: 'szivattyuvezerles', text: 'Dízelmotoros szivattyúk felügyeletére és opcionális távvezérlésére szolgáló vezérlőegységek.' },
  { slug: 'gyorscsatlakozok-idomok', text: 'Gyorscsatlakozók és idomok mobil öntözővezetékek egyszerű szereléséhez.' },
  { slug: 'szelepek-hidranok', text: 'Hidránsfejek és szerelvények öntözőrendszerek csatlakoztatásához és szabályozásához.' },
  { slug: 'talajelokeszites', text: 'Talaj-előkészítő gépek bakhátak kialakításához és termesztési felületek rendezéséhez.' },
  { slug: 'palantaulteto-gepek', text: 'Palántaültető gépek több soros ültetéshez, víz- és tápanyag-adagolási lehetőséggel.' },
  { slug: 'ivsatrak', text: 'Moduláris mezőgazdasági ívsátrak gépek, termények, széna és szalma tárolására.' },
]

const payload = await getPayload({ config })

try {
  const changes: Array<{ id: number | string; slug: string; name: string; text: string }> = []
  for (const entry of entries) {
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: entry.slug }, catalogRole: { equals: 'catalog' } },
      limit: 1,
      overrideAccess: true,
    })
    const category = result.docs[0] as any
    if (!category) throw new Error(`Aktív kategória nem található: ${entry.slug}`)
    if (String(category.parent?.id ?? category.parent ?? '') === '') throw new Error(`Nem alkategória: ${entry.slug}`)
    const existing = String(category.description || '').trim()
    if (existing) {
      console.log(`Kihagyva (már van leírás): ${entry.slug}`)
      continue
    }
    changes.push({ id: category.id, slug: entry.slug, name: category.name, text: entry.text })
  }

  if (!apply) {
    console.log(JSON.stringify({ mode: 'preview', count: changes.length, changes }, null, 2))
  } else {
    for (const change of changes) {
      await payload.update({ collection: 'categories', id: change.id, overrideAccess: true, data: { description: change.text } as any })
    }
    for (const change of changes) {
      const saved = await payload.findByID({ collection: 'categories', id: change.id, overrideAccess: true }) as any
      if (saved.description !== change.text) throw new Error(`Visszaolvasási eltérés: ${change.slug}`)
    }
    console.log(`Kitöltve és visszaellenőrizve: ${changes.length} üres kategórialeírás.`)
  }
} finally {
  await payload.destroy()
}
