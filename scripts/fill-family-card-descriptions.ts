import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')

// Rövid kártyaszövegek a már forrásolt termékcsalád-összefoglalók alapján.
// Csak az üres cardDescription mezőket tölti; a részletes összefoglalók változatlanok.
const entries = [
  { slug: 'de-cloet-dohanybetakaritok', text: 'Egysoros és kétsoros dohánybetakarítók eltérő leválasztási és továbbítási megoldásokkal.' },
  { slug: 'mantovani-dohanybetakaritok', text: 'Dohánybetakarító gépek kézi vagy automatizált munkavégzéshez.' },
  { slug: 'mantovani-permetezogepek', text: 'Önjáró és vontatott permetezőgépek dohányhoz, kukoricához és más kultúrákhoz.' },
  { slug: 'de-cloet-onjaro-permetezok', text: 'Önjáró permetezőgépek 1500, 2000 vagy 2500 literes rozsdamentes acéltartállyal.' },
  { slug: 'oliveragro-rotosark', text: 'Mechanikus gyomirtás, talajlazítás és bakhátformálás egy gépben.' },
  { slug: 'da-ros-seeders', text: 'Moduláris tálcás vetőgépek faiskolai vetéshez.' },
  { slug: 'lindsay-omega-linearis', text: 'Kombinált öntözőrendszer lineáris és körforgó üzemmódhoz.' },
  { slug: 'rovatti-centrifugal', text: 'Felszíni centrifugálszivattyúk villanymotoros vagy kardánhajtású kivitelben.' },
  { slug: 'rovatti-fuggoleges', text: 'Függőleges tengelyű szivattyúk kutakhoz, tározókhoz és öntözőrendszerekhez.' },
  { slug: 'rovatti-kutszivattyuk', text: 'Búvárszivattyúk 4–16 colos kutakhoz és mélykúti vízellátáshoz.' },
  { slug: 'giunti-csepegteto', text: 'Csepegtetőszalagok, csövek és mikroöntözési elemek célzott vízadagoláshoz.' },
  { slug: 'vodar-linearis', text: 'Oda-vissza haladó öntözőrendszer téglalap alakú táblákhoz.' },
  { slug: 'vodar-korforgo', text: 'Központi vízellátási pont körül forgó, járókerekes öntözőrendszer.' },
]

const payload = await getPayload({ config })

try {
  const changes: Array<{ id: number | string; slug: string; name: string; text: string }> = []
  for (const entry of entries) {
    const result = await payload.find({
      collection: 'product-families',
      where: { slug: { equals: entry.slug }, status: { equals: 'published' } },
      limit: 1,
      overrideAccess: true,
    })
    const family = result.docs[0] as any
    if (!family) throw new Error(`Publikált termékcsalád nem található: ${entry.slug}`)
    if (String(family.cardDescription || '').trim()) {
      console.log(`Kihagyva (már van kártyaszöveg): ${entry.slug}`)
      continue
    }
    if (!String(family.summary || '').trim()) throw new Error(`Nincs forrásolt összefoglaló: ${entry.slug}`)
    changes.push({ id: family.id, slug: entry.slug, name: family.name, text: entry.text })
  }

  if (!apply) {
    console.log(JSON.stringify({ mode: 'preview', count: changes.length, changes }, null, 2))
  } else {
    for (const change of changes) {
      await payload.update({ collection: 'product-families', id: change.id, overrideAccess: true, data: { cardDescription: change.text } as any })
    }
    for (const change of changes) {
      const saved = await payload.findByID({ collection: 'product-families', id: change.id, overrideAccess: true }) as any
      if (saved.cardDescription !== change.text) throw new Error(`Visszaolvasási eltérés: ${change.slug}`)
    }
    console.log(`Kitöltve és visszaellenőrizve: ${changes.length} üres családkártya-leírás.`)
  }
} finally {
  await payload.destroy()
}
