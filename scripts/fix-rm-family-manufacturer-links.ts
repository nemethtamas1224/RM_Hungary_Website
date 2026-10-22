import { getPayload } from 'payload'
import config from '../payload.config'

const targetSlugs=['rm-giant-xjm','rm-840-xjm','rm-700-xjm','rm-900-fx']
const dryRun=process.argv.includes('--dry-run')
const payload=await getPayload({config})
try{
 const [productResult,familyResult]=await Promise.all([
  payload.find({collection:'products',where:{slug:{in:targetSlugs}},limit:20,depth:1,overrideAccess:true}),
  payload.find({collection:'product-families',where:{slug:{in:['rm-xjm','rm-magnum']}},limit:10,depth:1,overrideAccess:true}),
 ])
 const families=new Map((familyResult.docs as any[]).map(f=>[String(f.id),f]))
 const result=[]
 for(const product of productResult.docs as any[]){
  if(product.manufacturer){result.push({slug:product.slug,action:'already-linked'});continue}
  const family=families.get(String(typeof product.family==='object'?product.family?.id:product.family))
  const manufacturer=family?.manufacturer
  const manufacturerId=typeof manufacturer==='object'?manufacturer?.id:manufacturer
  if(!manufacturerId)throw new Error(`RM family manufacturer is missing for ${product.slug}`)
  if(!dryRun)await payload.update({collection:'products',id:product.id,overrideAccess:true,data:{manufacturer:manufacturerId}} as any)
  result.push({slug:product.slug,manufacturer:typeof manufacturer==='object'?manufacturer.name:manufacturer,action:dryRun?'would-link':'linked'})
 }
 const found=new Set((productResult.docs as any[]).map(p=>p.slug))
 const missing=targetSlugs.filter(slug=>!found.has(slug))
 if(missing.length)throw new Error(`Expected RM models not found: ${missing.join(', ')}`)
 console.log(JSON.stringify({dryRun,result}))
}finally{
 await payload.destroy()
}
