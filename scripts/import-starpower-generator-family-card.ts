import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
try {
  const family = (await payload.find({
    collection: 'product-families',
    where: { slug: { equals: 'starpower-aramfejlesztok' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })).docs[0] as any
  const logo = (await payload.find({
    collection: 'media',
    where: { id: { equals: 9 } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })).docs[0] as any
  if (!family) throw new Error('Missing Starpower generator family')
  if (!logo) throw new Error('Missing official Starpower logo media')

  await payload.update({
    collection: 'product-families',
    id: family.id,
    overrideAccess: true,
    data: {
      cardLogo: logo.id,
      cardDescription: 'Egy- és háromfázisú Starpower ECO áramfejlesztők 8–60 kVA teljesítménytartományban.',
      reviewNote: 'A kártyalogó a Starpower gyártói profilban használt eredeti embléma; az ECO tartomány a gyártó hivatalos oldalán ellenőrizve.',
    } as any,
  })
  console.log(`Starpower generator family card updated: ${family.id}`)
} finally {
  await payload.destroy()
}
