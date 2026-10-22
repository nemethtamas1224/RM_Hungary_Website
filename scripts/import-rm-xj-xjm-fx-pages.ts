import {getPayload} from 'payload'
import config from '../payload.config'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const payload=await getPayload({config})
const base='https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/'
type Spec={slug:string;name:string;family:string;url:string;card:string;photos:string[];table?:string;dim?:string;commonDim?:string;pdf?:string;options?:string;videos?:string[];summary:string}
const specs:Spec[]=[
 {slug:'rm-magnum-giant',name:'RM GIANT',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/magnum.html',card:'xj-giant-card.jpg',photos:['xj-giant-main.jpg','xj-giant-main-logo.png'],table:'xj-giant-table.jpg',dim:'xj-giant-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'GIANT.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['lN0L-QpkYcA'],summary:'Talajra támaszkodó, forgóvázas RM GIANT csévélődob.'},
 {slug:'rm-major-evo',name:'RM Major EVO',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/major-evo.html',card:'xj-major-evo-card.jpg',photos:['xj-major-main.jpg','xj-major-main-2.jpg','xj-major-logo.png'],table:'xj-major-table.jpg',dim:'xj-major-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'Major-EVO.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['OuW5Z1LOuJI','E1n3Vu66vmc'],summary:'Talajra támaszkodó RM Major EVO csévélődob.'},
 {slug:'rm-900-xj-evo',name:'RM 900 XJ EVO',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/900-xj.html',card:'xj-900-card.jpg',photos:['xj-900-main.jpg','xj-900-main-2.jpg','xj-900-main-3.jpg','xj-900-main-4.jpg','xj-900-main-5.jpg','xj-900-main-6.jpg'],table:'xj-900-table.jpg',dim:'xj-900-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'900xj.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['ijKGaRg4zl8'],summary:'Talajra támaszkodó RM 900 XJ EVO csévélődob.'},
 {slug:'rm-840-xj',name:'RM 840 XJ',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/840-xj.html',card:'xj-840-card.jpg',photos:['xj-840-main.jpg','xj-840-main-2.jpg'],table:'xj-840-table.jpg',dim:'xj-840-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'840xj.pdf',options:'OPT-XJ-2016_Inglese.pdf',summary:'Talajra támaszkodó RM 840 XJ csévélődob.'},
 {slug:'rm-800-xj',name:'RM 800 XJ',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/800-xj.html',card:'xj-800-card.jpg',photos:['xj-800-main.jpg','xj-800-main-2.jpg','xj-800-main-3.jpg'],table:'xj-800-table.jpg',dim:'xj-800-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'800xj.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['JOnxXgapKbQ','Wrv-kVxwxz8'],summary:'Talajra támaszkodó RM 800 XJ csévélődob.'},
 {slug:'rm-700-xj',name:'RM 700 XJ',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/700-xj.html',card:'xj-700-card.jpg',photos:['xj-700-main.jpg','xj-700-main-2.jpg','xj-700-main-3.jpg'],table:'xj-700-table.jpg',dim:'xj-700-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'700xj.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['EYzUvny9EuU','KzUG1vcxaUU'],summary:'Talajra támaszkodó RM 700 XJ csévélődob.'},
 {slug:'rm-600-xj',name:'RM 600 XJ',family:'rm-xj',url:'appoggiati-a-terra-mod.-xj/600-xj.html',card:'xj-600-card.jpg',photos:['xj-600-main.jpg','xj-600-logo.png'],table:'xj-600-table.jpg',dim:'xj-600-dim.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'600xj.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['0SDkwzOb41c'],summary:'Talajra támaszkodó RM 600 XJ csévélődob.'},
 {slug:'rm-giant-xjm',name:'RM GIANT XJM',family:'rm-xjm',url:'con-motore-incorporato/giant-xjm.html',card:'xjm-giant-card.jpg',photos:['xjm-giant-1.jpg','xjm-giant-2.jpg','xjm-giant-3.jpg'],table:'xjm-giant-4.jpg',dim:'xjm-giant-5.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'GIANT-xjm.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['2VxiJxVcJ1o'],summary:'Beépített motorral szerelt RM GIANT XJM csévélődob.'},
 {slug:'rm-major-xjm',name:'RM Major XJM',family:'rm-xjm',url:'con-motore-incorporato/major-xjm.html',card:'xjm-major-card.jpg',photos:['xjm-major-1.jpg','xjm-major-2.jpg','xjm-major-3.jpg','xjm-major-4.jpg','xjm-major-5.jpg','xjm-major-6.jpg'],table:'xjm-major-7.jpg',dim:'xjm-major-8.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'Major-xjm.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['esYtEhbknLg','_cECSYMEihM'],summary:'Beépített motorral szerelt RM Major XJM csévélődob.'},
 {slug:'rm-900-xjm',name:'RM 900 XJM',family:'rm-xjm',url:'con-motore-incorporato/900-xjm.html',card:'xjm-900-card.jpg',photos:['xjm-900-1.jpg'],table:'xjm-900-2.jpg',dim:'xjm-900-3.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'900xjm.pdf',options:'OPT-XJ-2016_Inglese.pdf',videos:['2UNVdLr0UtA'],summary:'Beépített motorral szerelt RM 900 XJM csévélődob.'},
 {slug:'rm-840-xjm',name:'RM 840 XJM',family:'rm-xjm',url:'con-motore-incorporato/840-xjm.html',card:'xjm-840-card.jpg',photos:['xjm-840-1.jpg','xjm-840-2.jpg','xjm-840-3.jpg'],table:'xjm-840-4.jpg',dim:'xjm-840-5.jpg',commonDim:'xjm-shared-dim.jpg',options:'OPT-XJ-2016_Inglese.pdf',videos:['ApxX37uqIDs'],summary:'Beépített motorral szerelt RM 840 XJM csévélődob.'},
 {slug:'rm-700-xjm',name:'RM 700 XJM',family:'rm-xjm',url:'con-motore-incorporato/700-xjm.html',card:'xjm-700-card.jpg',photos:['xjm-700-1.jpg','xjm-700-2.jpg','xjm-700-3.jpg','xjm-700-4.jpg','xjm-700-5.jpg','xjm-700-6.jpg'],table:'xjm-700-7.jpg',dim:'xjm-700-8.jpg',commonDim:'xjm-shared-dim.jpg',pdf:'700XJM-2021_Inglese_Cod202.pdf',options:'OPT-XJ-2016_Inglese.pdf',summary:'Beépített motorral szerelt RM 700 XJM csévélődob.'},
 {slug:'rm-magnum-fx',name:'RM Magnum FX',family:'rm-magnum',url:'a-telaio-fisso/magnum-fx.html',card:'fx-magnum-card.jpg',photos:['fx-magnum-1.jpg'],table:'fx-magnum-2.jpg',dim:'fx-magnum-3.jpg',commonDim:'fx-shared-dim.jpg',pdf:'magnumFx.pdf',options:'OPT-GX-2016_Italiano.pdf',summary:'Fix vázas RM Magnum FX csévélődob.'},
 {slug:'rm-900-fx',name:'RM 900 FX',family:'rm-magnum',url:'a-telaio-fisso/900-fx.html',card:'fx-900-card.jpg',photos:['fx-900-1.jpg','fx-900-2.jpg','fx-900-3.jpg','fx-900-4.jpg','fx-900-5.jpg','fx-900-6.jpg'],dim:'fx-magnum-3.jpg',commonDim:'fx-shared-dim.jpg',options:'OPT-GX-2016_Italiano.pdf',summary:'Fix vázas RM 900 FX csévélődob.'},
]
const mediaMap=new Map<string,any>()
async function media(file:string,alt:string,url:string){
 if(mediaMap.has(file))return mediaMap.get(file)
 const sourceUrl=`local:rm-source:${file}`
 let doc=(await payload.find({collection:'media',where:{sourceUrl:{equals:sourceUrl}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
 if(!doc)doc=await payload.create({collection:'media',overrideAccess:true,data:{alt,sourceUrl,credit:'RM Irrigation hivatalos gyártói oldal'},filePath:path.join(root,file.startsWith('doc:')?'public/documents/rm-products':'public/images/rm-products',file.replace('doc:',''))} as any)
 mediaMap.set(file,doc);return doc
}
const cats=await payload.find({collection:'categories',where:{slug:{equals:'csevelodobos'}},limit:1,depth:0,overrideAccess:true})
const category=cats.docs[0] as any
const families=await payload.find({collection:'product-families',limit:100,depth:0,overrideAccess:true})
const famBySlug=new Map((families.docs as any[]).map(f=>[f.slug,f]))
const products=await payload.find({collection:'products',limit:500,depth:0,overrideAccess:true})
const bySlug=new Map((products.docs as any[]).map(p=>[p.slug,p]))
let created=0,updated=0,mediaCount=0
for(const item of specs){
 const family=famBySlug.get(item.family);if(!family)throw new Error(`Missing family ${item.family}`)
 const sourceUrl=base+item.url
 const allFiles=[item.card,...item.photos,...[item.table,item.dim,item.commonDim].filter(Boolean) as string[],...[item.pdf,item.options].filter(Boolean).map(x=>'doc:'+x)]
 const related=[] as any[]
 for(const file of allFiles)related.push(await media(file,`${item.name} – ${file}`,sourceUrl))
 const card=await media(item.card,`${item.name} termékkártya`,sourceUrl)
 const photos=await Promise.all(item.photos.map(file=>media(file,`${item.name} termékfotó`,sourceUrl)))
 const extra=await Promise.all([item.table,item.dim,item.commonDim].filter(Boolean).map(file=>media(file!,`${item.name} mérettáblázat vagy méretrajz`,sourceUrl)))
 const docs=await Promise.all([item.pdf,item.options].filter(Boolean).map(file=>media('doc:'+file,`${item.name} gyártói PDF`,sourceUrl)))
 const current=bySlug.get(item.slug)
 const data:any={name:item.name,slug:item.slug,brand:'RM Irrigation',family:family.id,category:category.id,productKind:'model',reviewState:'identified',summary:item.summary,originalUrl:sourceUrl,sourceDetails:`Gyártói termékoldal: ${item.name}. A termékfotók, gyártói táblázat, méretrajz, elérhető katalógus és videók a termékoldalon szerepelnek.`,sourceEvidence:[{url:sourceUrl,note:'Gyártói termékoldal és az azon megjelenő termékfotók, táblázatok, méretrajzok, dokumentumok.',media:card.id}],image:card.id,gallery:[...photos,...extra].map(m=>m.id),documents:docs.map(m=>m.id),status:'published'}
 if(current){await payload.update({collection:'products',id:current.id,overrideAccess:true,data} as any);updated++}
 else{await payload.create({collection:'products',overrideAccess:true,data} as any);created++}
 mediaCount+=related.length
}
console.log(JSON.stringify({created,updated,media:mediaCount,models:specs.length},null,2))
await payload.destroy()
