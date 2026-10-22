import { getPayload } from 'payload'
import config from '../payload.config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const payload=await getPayload({config})
const files=['540GX-1095.jpg','540GX_Dimensioni.jpg','DimensioniGX.jpg','540gx.pdf']
const media:any[]=[]
for(const file of files){
 const sourceUrl=`local:rm-product:${file}`
 let existing=(await payload.find({collection:'media',where:{sourceUrl:{equals:sourceUrl}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
 if(!existing){
  const alt=file==='540GX-1095.jpg'?'RM 540 GX – gyártói termékfotó':file==='540GX_Dimensioni.jpg'?'RM 540 GX – gyártói méretábra':file==='DimensioniGX.jpg'?'RM GX – általános méretrajz':'RM GX katalógus – 540 GX adatlap'
  existing=await payload.create({collection:'media',overrideAccess:true,data:{alt,sourceUrl,credit:'RM Irrigation hivatalos gyártói adatlap'},filePath:path.join(root,'public/images/rm-products',file)} as any)
 }
 media.push(existing)
}
const result=await payload.find({collection:'products',where:{slug:{equals:'rm-540-gx'}},limit:1,depth:0,overrideAccess:true})
const product=result.docs[0] as any
if(!product)throw new Error('RM 540 GX termékrekord nem található')
const hoseSizes=[{diameterMm:50,lengthM:160},{diameterMm:50,lengthM:250},{diameterMm:63,lengthM:190}]
const specifications=[
 {label:'Hajtás',value:'Turbina'},
 {label:'Forgóváz elfordulása',value:'320°'},
 {label:'Fő tömlőméretek',value:'50 mm × 160 m; 50 mm × 250 m; 63 mm × 190 m'},
 {label:'Méretek és tömeg',value:'A 1480* mm; B 1200 mm; C 2240 mm; D 3650 mm; E 1400* mm; F 1560 mm; G 1850 mm; 650 kg**'},
]
const equipment=[
 'Folyadékelosztású turbina beépített bypass-szal.',
 'TLT-hajtás a tömlő gyors feltekeréséhez.',
 'Automatikus sebességkompenzátor a tömlőtekercs átmérőjéhez igazítva.',
 'Biztonsági szerkezet a tömlő meglazulásának megakadályozására.',
 'Biztonsági leállítás, ha a tömlő a vezetési profilon kívül tekeredik fel.',
 'Elektronikus feltekerésisebesség-mérő és digitális óra.',
 'Finoman szabályozható, csigahajtású tömlővezető dupla sínnel.',
 'Golyóscsapágyas dobtámasz ajaktömítéssel és rozsdamentes persellyel.',
 'Golyóscsapágyazott forgóváz, 320°-os elfordulással.',
 'A kocsi öntözés utáni felemelése kézi hajtókarral vagy kézi hidraulikus szivattyúval.',
 'Rugalmas, csatlakozókkal szerelt gumibetápláló tömlő.',
 'Állítható kocsinyomtáv és kerékmagasság.',
 'Lassú visszatérésű SIME öntözőgép fúvókakészlettel.',
 'Glicerinfürdős nyomásmérő a gépen.',
 'Tűzihorganyzott acélváz és festett dob.',
]
const technicalTables=[{
 title:'Tömlőméret- és teljesítményadatok',
 column1:'Tömlő külső átmérője (mm)',column2:'Ajánlott tömlőhossz (m)',column3:'Maximális tömlőhossz (m)',
 column4:'Vízhozam (m³/h)',column5:'Ajánlott fúvóka (mm)',
 rows:[
  {cell1:'50',cell2:'250',cell3:'250',cell4:'6,4–16',cell5:'10–14'},
  {cell1:'63',cell2:'190',cell3:'190',cell4:'10–21',cell5:'12–16'},
 ],
}]
const technicalSections=[{heading:'Standard felszerelés',body:equipment.join('\n\n')}]
const videos=[{title:'RM 540 GX munka közben',url:'https://www.youtube.com/watch?v=YJaDtu_cbxM'}]
await payload.update({collection:'products',id:product.id,overrideAccess:true,data:{
 image:media[0].id,gallery:media.slice(0,3).map(m=>m.id),documents:[media[3].id],
 hoseSizes,gxTechnical:true,specifications,technicalSections,technicalTables,videos,
 summary:'Turbinahajtású, 320°-ban forgatható GX csévélődob. 50 és 63 mm-es tömlőváltozatokkal.',
 sourceDetails:'Méretek: * minimális szállítási méretek. ** A 650 kg tömeg a 63/190 mm-es kivitelre vonatkozik. A gyártó a méreteket tájékoztató jellegűnek jelöli; felszereltségi és műszaki frissítések szerint változhatnak. A gyártó az oldalon „Választható” címszót tüntet fel, de ehhez nem közöl választható opciók listáját.',
 reviewState:'identified',reviewNote:'A gépfotó, a méretábra, a tömlőtáblázat és a standard felszerelés a megadott RM Irrigation 540 GX gyártói adatlapról került át. Tömlő-konfigurációkat a gyártói letölthető modellkatalógus igazol.',
 sourceEvidence:[{url:'https://www.rmirrigation.com/hu/modell/professzion%C3%A1lis-%C3%B6nt%C3%B6z%C5%91-g%C3%A9pek/forg%C3%B3-torony-szerkezet%C5%B1/540-gx.html',note:'A hivatalos 540 GX termékoldal: méretábra, standard felszerelés és letölthető dokumentumok.',media:media[0].id},{url:'https://www.rmirrigation.com/public/Cataloghi/Catalogo-GX-Inglese/540gx.pdf',note:'Modellspecifikus gyártói katalógus: tömlő-átmérő és -hossz, vízhozam, ajánlott fúvóka.',media:media[3].id},{url:'https://www.rmirrigation.com/nl/modellen/professionele-irrigatiemachines/draaibare-bovenbouw/540-gx.html',note:'Gyártói 540 GX modelloldal: standard felszerelés, 320°-os forgóváz és termékvideó.',media:media[0].id}]
}} as any)
console.log(JSON.stringify({updatedProduct:product.slug,media:media.length},null,2))
await payload.destroy()
