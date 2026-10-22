import { getPayload } from 'payload'
import config from '../payload.config'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const dir=path.join(root,'public/images/rm-products')
const payload=await getPayload({config})
const existing=(await payload.find({collection:'media',limit:1000,depth:0,overrideAccess:true})).docs as any[]
const bySource=new Map(existing.filter(m=>m.sourceUrl).map(m=>[m.sourceUrl,m]))
const imageFiles=(await import('node:fs/promises')).readdir(dir)
const files=await imageFiles
let uploaded=0
const mediaByName=new Map<string,any>()
for(const file of files){
 const sourceUrl=`local:rm-product:${file}`
 let doc=bySource.get(sourceUrl)
 if(!doc){
  doc=await payload.create({collection:'media',overrideAccess:true,data:{alt:`RM ${file.replace(/[-_]+/g,' ').replace(/\.[^.]+$/,'')}`,sourceUrl,credit:'RM Hajdú Hungary – felhasználó által megadott képtár'},filePath:path.join(dir,file)} as any)
  uploaded++
 }
 mediaByName.set(file,doc)
}
const products=(await payload.find({collection:'products',limit:500,depth:0,overrideAccess:true})).docs as any[]
const bySlug:Record<string,string[]>={
 'rm-570-gx-evo':['570-gx-evo_1_1.jpg',...files.filter(f=>/^570-gx-evo_\d+_190x140\.jpg$/.test(f))],
 'rm-581-gx-evo':['581-gx-evo_1_1.jpg',...files.filter(f=>/^581-gx-evo_\d+_190x140\.(jpg|png)$/.test(f))],
 'rm-690-gx-evo':['690-gx-evo_1_1.jpg',...files.filter(f=>/^690-gx-evo_\d+_190x140\.jpg$/.test(f))],
 'rm-790-gx':['790gx_1_1.png','790-gx_1_2.jpg'],
 'rm-890-gx':['890-gx-890gxevo_1_1.png','890-gx_1_2.jpg',...files.filter(f=>/^890-gx_\d+_190x140\.jpg$/.test(f))],
 'rm-990-gx':['990gx_1_1.png','990-gx_1_1.jpg',...files.filter(f=>/^990-gx_\d+_190x140\.jpg$/.test(f))],
 'rm-600-xj':['600-xj_1_1.jpg','600-xj_2_340x280.png','600-xj_3_340x280.png',...files.filter(f=>/^600-xj_\d+_190x140\.jpg$/.test(f))],
 'rm-700-xj':['700-xj_1_2.jpg',...files.filter(f=>/^700-xj_\d+_190x140\.jpg$/.test(f))],
 'rm-800-xj':['800xj_1_1.png'], 'rm-840-xj':['840xj_1_1.png'], 'rm-900-xj-evo':['900xj-evo_1_1.png'],
 'rm-600-xjm':['600-xjm_1.png','600-xjm_1_1.jpg'], 'rm-800-xjm':['800-xjm_1.png','800-xjm_1_1.jpg','800-xjm_1_2.jpg','800-xjm_57.png'],
 'rm-major-xjm':['major-xjm_1.png','major-xjm_1_1.jpg'], 'rm-magnum-xjm':['magnum-xjm_1.png','magnum-xjm_1_1.jpg'],
 'rm-magnum':['magnum_1_1.png'], 'rm-magnum-giant':['magnum-giant_1_1.png'], 'rm-magnum-fx':['magnum-fx_2.png'],
}
const basename=(f:string)=>f.replace(/^rmhungary__/,'')
let linked=0
for(const p of products){
 const names=bySlug[p.slug]
 if(!names)continue
 const docs=names.map(n=>mediaByName.get(basename(n))).filter(Boolean)
 if(!docs.length)continue
 await payload.update({collection:'products',id:p.id,overrideAccess:true,data:{image:docs[0].id,gallery:docs.map((m:any)=>m.id)}} as any)
 linked++
}
console.log(JSON.stringify({uploaded,linked,sourceFiles:files.length},null,2))
await payload.destroy()
