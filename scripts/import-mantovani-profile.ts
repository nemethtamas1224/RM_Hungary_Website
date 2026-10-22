import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const maker: any = (await payload.find({
  collection: 'manufacturers',
  where: { slug: { equals: 'mantovani' } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})).docs[0]

if (!maker) throw new Error('A Mantovani gyártórekord nem található.')

await payload.update({
  collection: 'manufacturers',
  id: maker.id,
  overrideAccess: true,
  data: {
    description: 'A Mantovani Srl dohánytermesztéshez és dohányfeldolgozáshoz készít gépeket. Hivatalos ismertetője kézi és automatizált dohánybetakarítókat, valamint préselő- és csomagolóberendezéseket mutat be.',
    sourceUrl: 'https://www.mantovanisrl.it/macchine-pressatrici-e-confezionatrici-per-tabacco/',
    reviewNote: 'A dohánygépek gyártóját a Mantovani Srl hivatalos oldala azonosítja. Ne keverd össze a hasonló nevű Mantovani Agrinova gyártóval; a termékfotók és modellek hozzárendelése további forrásellenőrzést igényel.',
  } as any,
})

console.log('Mantovani gyártói bemutató frissítve; modellszintű termékadatot és képet nem rendeltünk hozzá.')
await payload.destroy()
