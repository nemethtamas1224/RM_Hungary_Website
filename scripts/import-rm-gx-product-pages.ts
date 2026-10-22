import { getPayload } from 'payload'
import config from '../payload.config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const payload=await getPayload({config})
const fileGroups:Record<string,{photos:string[];table:string;dimensions:string;pdf:string;official:string;model:string}>={
 'rm-560-gx':{model:'560 GX',photos:['560GX-1095.jpg','560GX-1095-1.jpg'],table:'560GX_Tabella_2017_GB.jpg',dimensions:'560GX_Dimensioni.jpg',pdf:'560gx.pdf',official:'560-gx'},
 'rm-570-gx-evo':{model:'570 GX',photos:['570GX-1095.jpg','570GX-1095-1.jpg'],table:'570GX_Tabella_2017_GB.jpg',dimensions:'570GX_Dimensioni.jpg',pdf:'570gx.pdf',official:'570-gx'},
 'rm-581-gx-evo':{model:'581 GX EVO',photos:['581GX-1095-5.jpg','581GX-1095-2.jpg','581GX-1095-1.jpg','581GX-1095-3.jpg','581GX-1095-4.jpg'],table:'581GX_Tabella_2017_GB.jpg',dimensions:'581GX_Dimensioni.jpg',pdf:'581gx.pdf',official:'581-gx'},
 'rm-690-gx-evo':{model:'690 GX EVO',photos:['690GX-1095.jpg'],table:'690GX_Tabella_2017_GB.jpg',dimensions:'690GX_Dimensioni.jpg',pdf:'690gx.pdf',official:'690-gx'},
 'rm-790-gx':{model:'790 GX',photos:['790GX-1095.jpg'],table:'790GX_Tabella_2017_GB.jpg',dimensions:'790GX_Dimensioni.jpg',pdf:'790gx.pdf',official:'790-gx'},
 'rm-890-gx':{model:'890 GX',photos:['890GX-1095-3.jpg','890GX-1095-5.jpg','890GX-1095-4.jpg','890GX-1095-2.jpg','890GX-1095-1.jpg'],table:'890GX_Tabella_2017_GB.jpg',dimensions:'890GX_Dimensioni.jpg',pdf:'890gx.pdf',official:'890-gx'},
 'rm-990-gx':{model:'990 GX',photos:['990GX-1095.jpg','990GX-1095-1.jpg','990GX-1095-2.jpg','990GX-1095-3.jpg','990GX-1095-4.jpg'],table:'',dimensions:'990GX_Dimensioni.jpg',pdf:'990gx.pdf',official:'990-gx'},
 'rm-1100-gx':{model:'1100 GX',photos:['1100GX-1095.jpg'],table:'',dimensions:'1100GX_Dimensioni.jpg',pdf:'',official:'1100-gx'},
}
const shared='DimensioniGX.jpg'
const mediaByFile=new Map<string,any>()
const allFiles=[...new Set([...Object.values(fileGroups).flatMap(x=>[...x.photos,x.table,x.dimensions,x.pdf]),shared].filter(Boolean))]
for(const file of allFiles){
 const sourceUrl=`local:rm-product:${file}`
 let media=(await payload.find({collection:'media',where:{sourceUrl:{equals:sourceUrl}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
 if(!media){
  const alt=file.endsWith('.pdf')?`RM gyártói katalógus – ${file.replace('gx.pdf',' GX')}`:file.includes('Tabella')?`Gyártói méret- és tömegtáblázat – ${file.slice(0,3)} GX`:file.includes('Dimensioni')?`Gyártói méretrajz – ${file.slice(0,3)} GX`:`RM gyártói termékfotó – ${file.slice(0,3)} GX`
  media=await payload.create({collection:'media',overrideAccess:true,data:{alt,sourceUrl,credit:'RM Irrigation hivatalos gyártói adatlap'},filePath:path.join(root,'public/images/rm-products',file)} as any)
 }
 mediaByFile.set(file,media)
}
const sharedMedia=mediaByFile.get(shared)
for(const [slug,item] of Object.entries(fileGroups)){
 const product=(await payload.find({collection:'products',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
 if(!product)throw new Error(`Hiányzó Payload termék: ${slug}`)
 const photos=item.photos.map(file=>mediaByFile.get(file))
 const gallery=[...photos,mediaByFile.get(item.dimensions),...(item.table?[mediaByFile.get(item.table)]:[]),...(slug==='rm-1100-gx'?[]:[sharedMedia])].filter(Boolean)
 const pdf=item.pdf?mediaByFile.get(item.pdf):null
 await payload.update({collection:'products',id:product.id,overrideAccess:true,data:{
  image:photos[0].id,gallery:gallery.map(m=>m.id),documents:pdf?[pdf.id]:[],
  specifications:[...(product.specifications||[]).filter((x:any)=>!String(x.label).startsWith('Gyártói modell')).map((x:any)=>({label:x.label,value:x.value})), {label:'Gyártói modell',value:item.model}],
  ...(slug==='rm-1100-gx'?{hoseSizes:[],configurations:[],reviewState:'identified',reviewNote:'A megadott gyártói adatlap fotót, méretrajzot és standard felszerelést tartalmaz. A 1100 GX-specifikus tömlőkonfigurációkat nem sorolja fel; nem kerültek más modell vagy korábbi import alapján a termékhez rendelve.'}:{}),
  sourceDetails:slug==='rm-1100-gx'? 'Gyártói termékadatlap: 1100 GX. A gyártó termékoldalán gépfotó, méretrajzok és standard felszerelés szerepel. Az oldal nem tartalmaz 1100 GX-specifikus tömlő-/teljesítménytáblázatot vagy letölthető termékbrosúrát; az általános GX-opciós katalógus elérhető. A gyártói videógaléria üres.':'Gyártói termékadatlap: '+item.model+'. A gyártói fotók, a méretrajzok, a tömlő műszaki táblázata, a standard felszerelés és a modellspecifikus katalógus ezen az oldalon szerepelnek. A konfigurációs lista a korábban megadott RM katalógus-adatsorból származik, nem jelzi az aktuális készlet.',
  ...(slug==='rm-1100-gx'?{reviewState:'identified',reviewNote:'Az 1100 GX oldal képét, méretrajzait és standard felszerelését ellenőriztük a megadott RM Irrigation gyártói termékoldalon. A forrás videógalériája üres és külön brosúrát nem kapcsol; modellspecifikus teljesítménytáblázat nincs.'}:{}),
  sourceEvidence:[{url:`https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/forg%C3%B3-torony-szerkezet%C5%B1/${item.official}.html`,note:'Hivatalos gyártói termékadatlap: képek, méretrajz és standard felszerelés.',media:photos[0].id},...(pdf?[{url:`https://www.rmirrigation.com/public/Cataloghi/Catalogo-GX-Inglese/${item.pdf}`,note:'Modellspecifikus gyártói katalógus: tömlőátmérő, ajánlott/maximális tömlőhossz, vízhozam és fúvóka.',media:pdf.id}]:[])]
 }} as any)
}
const familyMediaFiles=['Turbina.png','Dente.png','asse-bobina.png','programmatore.png','occhione.jpg','Ruota.png','multi-sezione.jpg','multi-sezione-1.png','oleodinamico.png','Verniciatura-www-Italiano.png','Carrello-ok.png','assale.png','Collaudo.png','LogoGreen.png']
const familyMedia:any[]=[]
for(const file of familyMediaFiles){
 const sourceUrl=`local:rm-product:${file}`
 let media=(await payload.find({collection:'media',where:{sourceUrl:{equals:sourceUrl}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
 if(!media)media=await payload.create({collection:'media',overrideAccess:true,data:{alt:`RM GX gyártói ábra – ${file}`,sourceUrl,credit:'RM Irrigation hivatalos GX termékcsaládoldal'},filePath:path.join(root,'public/images/rm-products',file)} as any)
 familyMedia.push(media.id)
}
console.log(JSON.stringify({products:Object.keys(fileGroups).length,modelMedia:allFiles.length,familyMedia:familyMedia.length},null,2))
await payload.destroy()
