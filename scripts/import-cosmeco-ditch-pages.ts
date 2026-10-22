import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const payload=await getPayload({config})
const materials=[
 {
  slug:'cosmeco-arokmaro',
  name:'Cosmeco árokmaró gépek',
  source:'https://www.cosmeco.it/prodotti/scavafossi-monobiruota/42/scavafossi-monobiruota-standard',
  image:'public/images/cosmeco/monobiruota-standard.png',
  imageUrl:'https://www.cosmeco.it/upload/cmb-80-9-800x600.png',
  alt:'Cosmeco CMB monobiruota forgó árokmaró',
  summary:'Egyrotoros, formázókerékkel dolgozó árokmaró árkok kialakításához és karbantartásához. A kitermelt föld oldalra szórható vagy állítható burkolattal az árokpart mellé terelhető.',
  paragraphs:[
   'A Cosmeco CMB egyrotoros árokmarója árkok és vízelvezető csatornák kialakítására, karbantartására és tisztítására készült. A marórotor és a formázókerék egyenletesre munkálja az árok két oldalát. A kitermelt föld a haladási irány szerinti jobb oldalra távozik; igény szerint távolabbra szórható, vagy szabályozottan az árok partjára terelhető.',
   'A konstrukció alkalmas olyan helyekre, ahol a kitermelt föld irányát a szomszédos területek, utak vagy védendő kultúrák miatt szabályozni kell. Az állítható mélységhez a traktor hidraulikus emelése és a lánc használható; új árok kialakításakor a talajtól és a kívánt mélységtől függően több menet is szükséges lehet.',
   'Alapkivitelben olajfürdős reduktorral, II. kategóriás hárompont-függesztéssel és középső munkavégzésű, fix vázzal készül. Elérhető tartozék többek között a biztonsági csavaros vagy kuplungos kardántengely, a hidraulikus harmadik pont és az erős talajhoz való volfrámkések.'
  ],
  specs:[['Hajtómű','Olajfürdős reduktor'],['Függesztés','II. kategóriás hárompont-függesztés'],['Mélységállítás','A traktor hidraulikus emelésével és lánccal'],['Váz','Fix, középső munkavégzésű']],
  configurations:[
   {name:'CMB 80',value:'1000 ford./perc; 65–85 HP; 0,4–0,7 km/h; 560 kg; kerékdőlés 30°; A/B/C: 26/125/80 cm'},
   {name:'CMB 100',value:'1000 ford./perc; 75–100 HP; 0,4–0,7 km/h; 600 kg; kerékdőlés 30°; A/B/C: 28/145/100 cm'},
  ],
  video:'c13vYRrC0po',
  videoTitle:'Cosmeco egyrotoros árokmaró munka közben',
  sourceDetails:'Gyártói adatlap: Scavafossi monobiruota standard. Forrás szerinti modellek: CMB 80 és CMB 100. A videó a gyártói oldalon beágyazva szerepel.',
 },
 {
  slug:'cosmeco-csatornatisztito',
  name:'Cosmeco csatornatisztító adapterek',
  source:'https://www.cosmeco.it/prodotti/scavafossi-biruota/44/scavafossi-biruota-standard',
  image:'public/images/cosmeco/biruota-standard.jpg',
  imageUrl:'https://www.cosmeco.it/upload/cb-80-al-lavoro-11-800x600.jpg',
  alt:'Cosmeco CB biruota kétrotoros árokmaró munka közben',
  summary:'Kétrotoros árokmarók közepes és nagyobb csatornák kialakításához, karbantartásához és tisztításához. A kitermelt föld szétteríthető, vagy az árok szélére rendezhető.',
  paragraphs:[
   'A Cosmeco CB kétrotoros árokmaró két oldalról vágja és tisztítja a csatornát. Az állítható burkolatokkal a föld oldalra szórható vagy az árok mentén, szabályozottan elteríthető. A kialakított csatorna segíti a felesleges víz elvezetését vagy az öntözőhálózat vízének továbbvezetését.',
   'A gyártó ezt a sorozatot a nagyobb igénybevételű munkákhoz és homokos, illetve nehéz agyagos talajhoz is megadja. A munkamélység a traktor hidraulikus emelésével állítható; új árok marásához a talaj és a célmélység függvényében több menet válhat szükségessé.',
   'Az alapfelszereltség olajfürdős hajtóművet, II. kategóriás hárompont-függesztést és fix, középső munkavégzésű vázat tartalmaz. A gyártói oldalon felsorolt választható tartozékok között kardántengely, kiegészítő burkolat, hidraulikus harmadik pont, közúti szállítókerék és erős talajhoz való volfrámszerszám szerepel.'
  ],
  specs:[['Hajtómű','Olajfürdős fogaskerékhajtás'],['Függesztés','II. kategóriás hárompont-függesztés'],['Mélységállítás','A traktor hidraulikus emelésével'],['Váz','Fix, középső munkavégzésű']],
  configurations:[
   {name:'CB 80',value:'1000 ford./perc; 55–75 HP; 0,3–0,7 km/h; 670 kg; kerékdőlés 32°; A/B/C: 30/130/85 cm'},
   {name:'CB 100',value:'540 vagy 1000 ford./perc; 65–85 HP; 0,3–0,7 km/h; 800 kg; kerékdőlés 32°; A/B/C: 30/150/100 cm'},
   {name:'CB 120',value:'540 vagy 1000 ford./perc; 75–90 HP; 0,3–0,7 km/h; 980 kg; kerékdőlés 32°; A/B/C: 38/180/125 cm'},
   {name:'CB 140',value:'1000 ford./perc; 90–140 HP; 0,3–0,7 km/h; 1200 kg; kerékdőlés 32°; A/B/C: 38/210/140 cm'},
  ],
  video:'lBoRkUE_eZo',
  videoTitle:'Cosmeco kétrotoros árokmaró munka közben',
  sourceDetails:'Gyártói adatlap: Scavafossi biruota standard. Forrás szerinti modellek: CB 80, CB 100, CB 120 és CB 140. A gyártói táblázat A/B/C méreteit cm-ben adja meg; a videó az adatlapba beágyazott gyártói videó.',
 },
]

const richText=(paragraphs:string[])=>({root:{type:'root',format:'',indent:0,version:1,children:paragraphs.map(text=>({type:'paragraph',format:'',indent:0,version:1,direction:'ltr',textFormat:0,textStyle:'',children:[{type:'text',detail:0,format:0,mode:'normal',style:'',text,version:1}]}))}})

for(const item of materials){
 const found=await payload.find({collection:'products',where:{slug:{equals:item.slug}},limit:1,depth:0,overrideAccess:true})
 const product:any=found.docs[0]
 if(!product)throw new Error(`Missing product record: ${item.slug}`)
 let media:any=(await payload.find({collection:'media',where:{sourceUrl:{equals:item.imageUrl}},limit:1,depth:0,overrideAccess:true})).docs[0]
 if(!media)media=await payload.create({collection:'media',overrideAccess:true,data:{alt:item.alt,sourceUrl:item.imageUrl,credit:'Cosmeco hivatalos termékoldala'},filePath:path.join(root,item.image)} as any)
 const data:any={
  summary:item.summary,description:richText(item.paragraphs),specifications:item.specs.map(([label,value])=>({label,value})),
  videos:[{title:item.videoTitle,url:`https://www.youtube.com/watch?v=${item.video}`}],
  configurations:item.configurations.map(row=>({...row,sourceUrl:item.source})),image:media.id,gallery:[media.id],
  originalUrl:item.source,sourceDetails:item.sourceDetails,reviewState:'ready',reviewNote:'Gyártói adatlap alapján ellenőrizve; méretek és teljesítményadatok az adott hivatalos oldalon szereplő táblázatból.',
  sourceEvidence:[{url:item.source,note:`Termékleírás, mérettáblázat, gyártói fotó és beágyazott videó. YouTube ID: ${item.video}.`,media:media.id}],
 }
 await payload.update({collection:'products',id:product.id,overrideAccess:true,data} as any)
 console.log(`Updated ${item.slug}: media=${media.id}, source=${item.source}`)
}
const cosmeco=(await payload.find({collection:'manufacturers',where:{slug:{equals:'cosmeco'}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
if(cosmeco)await payload.update({collection:'manufacturers',id:cosmeco.id,overrideAccess:true,data:{description:'Az 1980-ban alapított, olaszországi ostigliai gyártó mezőgazdasági árokmarókat és talajművelő gépeket fejleszt és készít.',sourceUrl:'https://www.cosmeco.it/azienda'}} as any)
const categoryDescriptions:[string,string][]=[
 ['arokaso-arokmaro','A Cosmeco egyrotoros CMB árokmarók árkok kialakítására, karbantartására és tisztítására szolgálnak; a kitermelt föld oldalra szórható vagy az árokpart mellé rendezhető.'],
 ['csatornatisztito-gepek','A Cosmeco kétrotoros CB árokmarók közepes és nagyobb csatornák kialakítására és tisztítására készülnek, homokos és nehéz agyagos talajon is.'],
]
for(const [slug,description] of categoryDescriptions){
 const category=(await payload.find({collection:'categories',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
 if(category)await payload.update({collection:'categories',id:category.id,overrideAccess:true,data:{description}} as any)
}
await payload.destroy()
