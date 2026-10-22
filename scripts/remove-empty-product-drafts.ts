import { getPayload } from 'payload'
import config from '../payload.config'

const dryRun=process.argv.includes('--dry-run')
const payload=await getPayload({config})
try{
 const matches=await payload.find({
  collection:'products',
  where:{and:[
   {name:{exists:false}},
   {slug:{exists:false}},
   {category:{exists:false}},
   {family:{exists:false}},
   {manufacturer:{exists:false}},
   {image:{exists:false}},
   {status:{equals:'draft'}},
  ]},
  limit:100,
  depth:0,
  overrideAccess:true,
 })
 const removed=[]
 for(const product of matches.docs as any[]){
  if(dryRun){removed.push(product.id);continue}
  await payload.delete({collection:'products',id:product.id,overrideAccess:true})
  removed.push(product.id)
 }
 console.log(JSON.stringify({dryRun,matched:matches.docs.length,removed}))
}finally{
 await payload.destroy()
}
