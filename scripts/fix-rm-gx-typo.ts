import { getPayload } from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })

try {
  const result = await payload.find({
    collection: 'product-families',
    where: { slug: { equals: 'rm-gx' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const family = result.docs[0] as any
  if (!family) throw new Error('RM GX termékcsalád nem található.')

  const typo = 'tanúsított tanúsított alapanyagokat'
  const corrected = 'tanúsított alapanyagokat'
  const matches = (family.overviewSections || []).filter((section: any) => (section.body || '').includes(typo))
  if (matches.length === 0) {
    console.log('Nincs javítandó elírás; az RM GX családbemutató már naprakész.')
  } else {
    if (matches.length !== 1 || (matches[0].body.match(/tanúsított tanúsított alapanyagokat/g) || []).length !== 1) {
      throw new Error(`Váratlan egyezésszám: ${matches.length}; kézi ellenőrzés szükséges.`)
    }
    const overviewSections = family.overviewSections.map((section: any) => ({
      id: section.id,
      heading: section.heading,
      body: (section.body || '').replace(typo, corrected),
      image: typeof section.image === 'object' ? section.image?.id ?? null : section.image ?? null,
      imageAlt: section.imageAlt || '',
      secondaryImage: typeof section.secondaryImage === 'object' ? section.secondaryImage?.id ?? null : section.secondaryImage ?? null,
      secondaryImageAlt: section.secondaryImageAlt || '',
    }))
    const planned = overviewSections.find((section: any) => section.body.includes(corrected))
    if (!planned) throw new Error('A javított szöveg nem található az előnézeti adatokban.')

    if (!apply) {
      console.log(`Előnézet: ${family.name} / ${planned.heading}`)
      console.log(`Előtte: ${matches[0].body}`)
      console.log(`Utána: ${planned.body}`)
      console.log('Alkalmazáshoz használd a --apply kapcsolót.')
    } else {
      await payload.update({
        collection: 'product-families',
        id: family.id,
        data: { overviewSections },
        depth: 0,
        overrideAccess: true,
      } as any)
      const check = await payload.find({
        collection: 'product-families',
        where: { slug: { equals: 'rm-gx' } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const updated = (check.docs[0] as any)?.overviewSections?.find((section: any) => section.heading === planned.heading)
      if (!updated?.body?.includes(corrected) || updated.body.includes(typo)) throw new Error('A CMS visszaolvasási ellenőrzése sikertelen.')
      console.log(`Javítva és visszaellenőrizve: ${family.name} / ${planned.heading}`)
    }
  }
} finally {
  await payload.destroy()
}
