import { getPayload } from 'payload'
import config from '../payload.config'
import { groups } from '../src/app/(frontend)/termekek/[...segments]/oliveragro-rotosark-videos'

const apply = process.argv.includes('--apply')
const payload = await getPayload({ config })
try {
  const product = (await payload.find({ collection:'products', where:{slug:{equals:'oliveragro-rotosark'}}, limit:1, depth:0, overrideAccess:true })).docs[0] as any
  if (!product) throw new Error('Oliveragro Rotosark termékrekord nem található.')
  const videos = groups.flatMap((group) => group.ids.map((id, index) => ({ title:`Rotosark – ${group.label}, ${index+1}. videó`, url:`https://www.youtube.com/watch?v=${id}` })))
  const normalize = (items:any[]) => (items||[]).map(({title,url}:any)=>({title:title||'',url:url||''}))
  const current = normalize(product.videos)
  const equal = JSON.stringify(current) === JSON.stringify(videos)
  if (equal) console.log(`Előnézet: Oliveragro Rotosark ${videos.length} videója már egyezik a CMS-adatokkal.`)
  else if (current.length) throw new Error(`A terméknek már ${current.length} eltérő CMS-videója van; felülírás megtagadva.`)
  else if (!apply) console.log(`Előnézet: ${videos.length} Rotosark videó kerülne a CMS-be, ${groups.length} termesztési csoportban.`)
  else { await payload.update({collection:'products', id:product.id, data:{videos}, depth:0, overrideAccess:true} as any); console.log(`Oliveragro Rotosark: ${videos.length} videó a CMS-be került.`) }
} finally { await payload.destroy() }
