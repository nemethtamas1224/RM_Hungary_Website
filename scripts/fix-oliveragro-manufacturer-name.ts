import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

try {
  const result = await payload.find({
    collection: 'manufacturers',
    where: { slug: { equals: 'oliveragro' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const manufacturer = result.docs[0] as any
  if (!manufacturer) throw new Error('Az oliveragro gyártórekord nem található.')

  console.log(`${apply ? 'Alkalmazás' : 'Előnézet'}: ${manufacturer.name} → Oliver Agro; slug: ${manufacturer.slug} (változatlan)`)
  if (apply && manufacturer.name !== 'Oliver Agro') {
    await payload.update({
      collection: 'manufacturers',
      id: manufacturer.id,
      overrideAccess: true,
      data: { name: 'Oliver Agro' } as any,
    })
  }
} finally {
  await payload.destroy()
}
