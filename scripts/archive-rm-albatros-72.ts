import { getPayload } from 'payload'
import config from '../payload.config'

const payload=await getPayload({config})
try{
 const matches=await payload.find({collection:'products',where:{slug:{equals:'albatros-72'}},limit:10,depth:0,overrideAccess:true})
 for(const product of matches.docs as any[]){
  if(product.status!=='archived')await payload.update({collection:'products',id:product.id,overrideAccess:true,data:{status:'archived',reviewNote:'Az Albatros 72 az Albatros termékcsalád-változata; a külön rekordot a felhasználó kérésére archiváltuk. A régi URL az Albatros termékoldalra irányít.'}} as any)
 }
 console.log(JSON.stringify({archived:matches.docs.length}))
}finally{await payload.destroy()}
