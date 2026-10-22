import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const apply = process.argv.includes('--apply')
const assignments = [
  { id: 105, name: 'Dohánytörő kombájnok', originalUrl: 'https://www.rmhungary.hu/index.php?alkat=38', brands: ['De Cloet', 'Mantovani'] },
  { id: 104, name: 'Dohánytetejező gépek', originalUrl: 'https://www.rmhungary.hu/index.php?alkat=6', brands: ['Mantovani', 'De Cloet'] },
  { id: 103, name: 'Permetezőgépek', originalUrl: 'https://www.rmhungary.hu/index.php?alkat=7', brands: ['De Cloet', 'Mantovani'] },
  { id: 101, name: 'Bakháthúzó gépek', originalUrl: 'https://www.rmhungary.hu/index.php?alkat=5', brands: ['De Cloet', 'Oliver Agro', 'Mantovani'] },
]

const result: Array<{ id: number; name: string; current: string | null; next: string; applied?: boolean }> = []
for (const assignment of assignments) {
  const product = await payload.findByID({ collection: 'products', id: assignment.id, depth: 0, overrideAccess: true }) as any
  const evidence = JSON.stringify(product.sourceEvidence || [])
  const text = JSON.stringify(product.description || '')
  if (product.name !== assignment.name || product.productKind !== 'type' || product.manufacturer || product.originalUrl !== assignment.originalUrl) {
    throw new Error(`A(z) ${assignment.id} rekord aktuális állapota nem egyezik az auditált kiinduló adatokkal.`)
  }
  const proof = `${evidence} ${text}`
  for (const brand of assignment.brands) {
    if (!proof.toLowerCase().includes(brand.toLowerCase())) {
      throw new Error(`A(z) ${assignment.id} rekord forrásbizonyítéka nem nevezi meg: ${brand}.`)
    }
  }
  const next = assignment.brands.join(', ')
  const row: typeof result[number] = { id: assignment.id, name: product.name, current: product.brand || null, next }
  if (apply && product.brand !== next) {
    await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: { brand: next } as any })
    row.applied = true
  }
  result.push(row)
}

console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', records: result }, null, 2))
await payload.destroy()
