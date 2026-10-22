import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const productSlug = 'rm-magnum'
const officialFamilyUrl = 'https://www.rmirrigation.com/en/models/professional-hose-reel-irrigators/structure-that-can-be-hydraulically-lowered/'
const officialCatalogUrl = 'https://www.rmirrigation.com/public/cataloghi2021/XJ2021_Inglese_Cod202.pdf'
const body = 'Az RM 2021-es XJ katalógusa szerint a Magnum modell hajtóláncai a dob mindkét oldalán helyezkednek el. A 900-as kivitelnél ez a kialakítás opcionális.'
const section = { heading: 'Kétoldali lánchajtás', body, image: null, imageAlt: '' }

const payload = await getPayload({ config })

try {
  const result = await payload.find({ collection: 'products', where: { slug: { equals: productSlug } }, limit: 1, depth: 2, overrideAccess: true })
  const product = result.docs[0] as any
  if (!product) throw new Error('Az RM Magnum termék nem található.')
  if (product.status !== 'published' || product.manufacturer?.slug !== 'rm' || product.family?.slug !== 'rm-magnum') {
    throw new Error('Az RM Magnum aktuális gyártó-, család- vagy publikálási kapcsolata eltér a várt értéktől; nincs módosítás.')
  }

  const oldSections = Array.isArray(product.technicalSections) ? product.technicalSections : []
  const keptSections = oldSections.filter((entry: any) => entry?.heading !== section.heading)
  const nextSections = [...keptSections, section]
  const oldEvidence = Array.isArray(product.sourceEvidence) ? product.sourceEvidence : []
  const evidence = [
    { url: officialFamilyUrl, note: 'Az RM a Magnum modellt a hidraulikusan talajra támasztható XJ család kontextusában sorolja fel.' },
    { url: officialCatalogUrl, note: 'A 2021-es gyártói XJ katalógus a Magnum kétoldali hajtóláncát írja le; a 900-as változatnál opcionális kivitelként.' },
  ]
  const nextEvidence = [...oldEvidence.filter((entry: any) => !evidence.some((item) => item.url === entry?.url)), ...evidence]
  const changes = { technicalSections: nextSections, sourceEvidence: nextEvidence }

  if (!apply) {
    console.log(JSON.stringify({ mode: 'preview', id: product.id, name: product.name, currentSections: oldSections.length, plannedSection: section, sources: evidence }, null, 2))
  } else {
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: changes as any })
    const updated = await payload.findByID({ collection: 'products', id: product.id, depth: 2, overrideAccess: true }) as any
    const saved = (updated.technicalSections || []).find((entry: any) => entry.heading === section.heading)
    if (saved?.body !== body || !evidence.every((item) => (updated.sourceEvidence || []).some((entry: any) => entry.url === item.url))) {
      throw new Error('Az RM Magnum tartalmának vagy forrásainak visszaolvasása nem egyezik.')
    }
    console.log(`Frissítve: ${updated.name}; a műszaki szakasz és mindkét gyártói forrás visszaellenőrizve.`)
  }
} finally {
  await payload.destroy()
}
