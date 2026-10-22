import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const overview = 'https://www.rovatti.it/General-Overview-Rovatti.pdf'
const product4ES = 'https://www.rovatti.it/prodotti/pompe-da-pozzo/1199/elettropompe-sommerse-radiali-e-semiassiali-da-4'
const irrigation = 'https://www.rovatti.it/market-area/agricoltura-e-irrigazione/1121/sistemi-di-irrigazione'
const categorySource = 'https://www.rovatti.it/prodotti/1105/pompe-di-superficie'

type Entry = { slug: string; group: string; family: string; maxFlow?: string; maxHead?: string; maxPower?: string; bore?: string; kind: string; summary: string; imageUse: string }
const entries: Entry[] = [
  { slug:'rovatti-4es',group:'well4',family:'4ES',maxFlow:'27 m³/óra',maxHead:'415 m',maxPower:'5,5 kW',bore:'4″',kind:'Többlépcsős, radiális vagy félaxiális búvárszivattyú beépített visszacsapó szeleppel.',summary:'A 4ES sorozat négycolos kutakhoz készült, többfokozatú merülő szivattyúcsalád házi vízellátáshoz, öntözéshez és nyomásfokozáshoz.',imageUse:'A meglévő Rovatti 4ES termékkép megőrizve.' },
  ...['rovatti-erc','rovatti-ercx','rovatti-ec','rovatti-ecx'].map(slug=>({slug,group:'well6',family:'ERC / ERCX / EC / ECX',maxFlow:'96 m³/óra',maxHead:'415 m',maxPower:'30 kW',bore:'6″-os kútméret-csoport',kind:'Radiális vagy félaxiális, többfokozatú búvárszivattyúk beépített visszacsapó szeleppel; a sorozat különböző anyagú nyomó- és szívótestekkel érhető el.',summary:'A Rovatti ERC, ERCX, EC és ECX a hatcolos kutakhoz kínált radiális és félaxiális búvárszivattyú-családok. A gyártó több anyagváltozatot ismertet.',imageUse:'A meglévő közös ERC/EC sorozatfotó megőrizve.'})),
  {slug:'rovatti-e',group:'wellE',family:'E',maxFlow:'1200 m³/óra',maxHead:'470 m',maxPower:'400 kW',bore:'6″–16″',kind:'Nagy teljesítményű, félaxiális többfokozatú búvárszivattyú beépített visszacsapó szeleppel.',summary:'A Rovatti E sorozat nagyobb vízhozamú mélykúti feladatokra készült, mezőgazdasági öntözéshez és vízellátáshoz.',imageUse:'A meglévő Rovatti E sorozat kép megőrizve.'},
  {slug:'rovatti-v',group:'vertical',family:'V',maxFlow:'1200 m³/óra',maxHead:'310 m',maxPower:'200 kW',bore:'6″–16″',kind:'Függőleges tengelyű szivattyú villanymotoros vagy traktoros hajtás kialakításával.',summary:'A Rovatti V függőleges tengelyű szivattyúkat kutakhoz, tározókhoz és öntözési vízkivételhez tervezték; a gyártó villanymotoros és traktoros hajtású kialakítást is bemutat.',imageUse:'A meglévő Rovatti V sorozat kép megőrizve.'},
  {slug:'rovatti-mekv-europa',group:'mekv',family:'MEKV Europa',maxFlow:'345 m³/óra',maxHead:'365 m',maxPower:'200 kW',bore:'DN 65–150',kind:'Függőleges, monoblokkos többfokozatú centrifugálszivattyú IEC villanymotorhoz.',summary:'A MEKV Europa függőleges monoblokkos többfokozatú szivattyú, öntözési, vízellátási, nyomásfokozási és ipari rendszerekhez.',imageUse:'A meglévő Rovatti MEKV Europa kép megőrizve.'},
  {slug:'rovatti-mek-europa',group:'mek',family:'MEK Europa',maxFlow:'300 m³/óra',maxHead:'190 m',maxPower:'160 kW',bore:'DN 65–150',kind:'Vízszintes monoblokkos többfokozatú centrifugálszivattyú IEC villanymotorhoz, axiális szívócsatlakozással.',summary:'A MEK Europa vízszintes monoblokkos többfokozatú szivattyú öntözési, vízellátási és ipari rendszerekhez.',imageUse:'A meglévő Rovatti MEK Europa kép megőrizve.'},
  {slug:'rovatti-sne',group:'sne',family:'SNE',maxFlow:'725 m³/óra',maxHead:'150 m',maxPower:'162 kW',bore:'DN 32–150',kind:'Egylépcsős, csupasz tengelyű centrifugálszivattyú EN 733 szerinti műszaki és méretjellemzőkkel.',summary:'A Rovatti SNE normalizált, EN 733 szerinti egylépcsős szivattyú vízellátási, öntözési, hűtési és ipari feladatokra.',imageUse:'A meglévő Rovatti SNE termékkép megőrizve.'},
  ...[
    {slug:'rovatti-sk',family:'SK',maxFlow:'300 m³/óra',maxHead:'200 m',maxPower:'130 kW',bore:'DN 50–150',summary:'Az SK nagy nyomású vízellátáshoz, öntözéshez és mosó rendszerekhez kínált vízszintes, többfokozatú szivattyú.'},
    {slug:'rovatti-sk-europa',family:'SK Europa',maxFlow:'285 m³/óra',maxHead:'265 m',maxPower:'140 kW',bore:'DN 65–150',summary:'Az SK Europa nagy nyomású, vízszintes többfokozatú szivattyú öntözéshez, vízellátáshoz és ipari alkalmazásokhoz.'},
    {slug:'rovatti-skd-europa',family:'SKD Europa',maxFlow:'275 m³/óra',maxHead:'500 m',maxPower:'330 kW',bore:'DN 65–100',summary:'Az SKD Europa két csapágytámaszú, vízszintes többfokozatú szivattyú nagy nyomású vízellátási, öntözési és ipari rendszerekhez.'},
  ].map(x=>({...x,group:'sk',kind:'Csupasz tengelyű, vízszintes, többfokozatú centrifugálszivattyú axiális szívónyílással; a gyártó nagy nyomású alkalmazásokhoz sorolja.',imageUse:'A meglévő Rovatti SK termékkép megőrizve.'})),
  ...[
    {slug:'rovatti-fk',family:'FK',maxFlow:'300 m³/óra',maxHead:'220 m',maxPower:'130 kW',bore:'DN 65–150',summary:'Az FK többfokozatú centrifugálszivattyú közvetlenül SAE-karimával csatlakoztatható belső égésű motorhoz.'},
    {slug:'rovatti-fk-europa',family:'FK Europa',maxFlow:'300 m³/óra',maxHead:'220 m',maxPower:'130 kW',bore:'DN 65–150',summary:'Az FK Europa többfokozatú, SAE-karimás szivattyú motoros öntözési, tűzvédelmi, permetezési és folyadékszállítási feladatokra.'},
  ].map(x=>({...x,group:'fk',kind:'Többfokozatú centrifugálszivattyú közvetlen belső égésű motorhoz, SAE-karimás csatlakozással.',imageUse:'A meglévő Rovatti FK termékkép megőrizve.'})),
  ...[
    {slug:'rovatti-tk',family:'TK',maxFlow:'210 m³/óra',maxHead:'170 m',maxPower:'77 kW',bore:'DN 50–100',summary:'A TK kardántengellyel, traktor TLT-ről hajtható többfokozatú centrifugálszivattyú mezőgazdasági vízellátáshoz.'},
    {slug:'rovatti-tk-europa',family:'TK Europa',maxFlow:'210 m³/óra',maxHead:'170 m',maxPower:'77 kW',bore:'DN 50–100',summary:'A TK Europa traktor TLT-ről hajtható többfokozatú szivattyú, öntözéshez, tartályfeltöltéshez és folyadékátvitelhez.'},
  ].map(x=>({...x,group:'tk',kind:'Kardánhajtású, többfokozatú centrifugálszivattyú axiális szívónyílással és csigaházas nyomócsonkkal.',imageUse:'A meglévő Rovatti TK termékkép megőrizve.'})),
  {slug:'rovatti-t',group:'t',family:'T',maxFlow:'330 m³/óra',maxHead:'135 m',maxPower:'88 kW',bore:'DN 65–125',kind:'Egylépcsős centrifugálszivattyú, kardántengellyel traktor TLT-ről hajtható.',summary:'A Rovatti T traktor TLT-ről működtethető egylépcsős szivattyú öntözéshez, permetezéshez, tartályfeltöltéshez és folyadékátvitelhez.',imageUse:'A meglévő Rovatti T termékkép megőrizve.'},
]

const app = 'A Rovatti szivattyúcsaládok vízellátási, mezőgazdasági öntözési és ipari feladatokra készülnek. A pontos munkapontot az egyedi szivattyúgörbe és a telepítési körülmények alapján kell kiválasztani.'
const specsFor = (x: Entry) => [
  {label:'Kialakítás',value:x.kind},
  ...(x.maxFlow?[{label:'Család maximális térfogatárama',value:x.maxFlow}]:[]),
  ...(x.maxHead?[{label:'Család maximális emelőmagassága',value:x.maxHead}]:[]),
  ...(x.maxPower?[{label:'Család maximális motorteljesítménye',value:x.maxPower}]:[]),
  ...(x.bore?[{label:'Kút-/csatlakozási tartomány',value:x.bore}]:[]),
]
const richText = (paragraphs:string[]) => ({root:{type:'root',format:'',indent:0,version:1,children:paragraphs.map(text=>({type:'paragraph',format:'',indent:0,version:1,direction:'ltr',textFormat:0,textStyle:'',children:[{type:'text',detail:0,format:0,mode:'normal',style:'',text,version:1}]}))}})

for (const item of entries) {
  const product:any=(await payload.find({collection:'products',where:{slug:{equals:item.slug}},limit:1,depth:0,overrideAccess:true})).docs[0]
  if(!product) throw new Error(`Missing Rovatti product ${item.slug}`)
  const source=item.group==='well4'?product4ES:overview
  const imageId=typeof product.image==='object'?product.image.id:product.image
  await payload.update({collection:'products',id:product.id,overrideAccess:true,data:{
    summary:item.summary,
    description:richText([
      `${item.family}: ${item.kind}`,
      item.summary,
      `A gyártói áttekintőben közölt családszintű felső értékek: térfogatáram ${item.maxFlow ?? 'a gyártói adatlap szerint'}, emelőmagasság ${item.maxHead ?? 'a gyártói adatlap szerint'}, motorteljesítmény ${item.maxPower ?? 'a gyártói adatlap szerint'}. Ezek a sorozat választékának határértékei, nem minden változat egyedi munkapontjai.`,
      app,
    ]),
    specifications:specsFor(item),
    originalUrl:source,sourceDetails:`A magyar leírás a Rovatti hivatalos ${item.family} termékcsalád-áttekintőjének fordítása és szerkesztése. A megadott teljesítményértékek családszintű maximumok; egyedi kiválasztáshoz az adott modell gyártói görbéje szükséges.`,
    sourceEvidence:[{url:source,note:`A gyártói katalógus ${item.family} sorozatleírása és felső paraméterei. ${item.imageUse}`,media:imageId}],
    reviewState:'ready',reviewNote:`Gyártói forrásazonosítás: ${item.family} sorozat. A műszaki értékek a család katalógusban közölt felső határértékei.`,
    gallery:imageId?[imageId]:[],
  } as any})
}

const manufacturer:any=(await payload.find({collection:'manufacturers',where:{slug:{equals:'rovatti'}},limit:1,depth:0,overrideAccess:true})).docs[0]
await payload.update({collection:'manufacturers',id:manufacturer.id,overrideAccess:true,data:{
  description:'A Rovatti 1952 óta fejleszt és gyárt centrifugálszivattyúkat mezőgazdasági, ipari, kommunális és víziközmű-feladatokra. A kínálat mélykúti, felszíni, elektromos, traktorhajtású és búvárszivattyú-családokat foglal magában.',
  sourceUrl:'https://www.rovatti.it/gruppo-rovatti',reviewNote:'A gyártói múlt és termékkör a Rovatti hivatalos bemutatkozó oldalán ellenőrizve.',
} as any})
for(const [slug,description] of [
  ['kutszivattyuk','Rovatti radiális és félaxiális búvárszivattyúk mélykutakhoz, házi és mezőgazdasági vízellátáshoz, öntözéshez és nyomásfokozáshoz.'],
  ['rovatti-fuggoleges','Rovatti függőleges tengelyű szivattyúk vízkivételhez és öntözéshez; villanymotoros vagy traktoros hajtású konfigurációban.'],
  ['rovatti-centrifugal','Rovatti felszíni centrifugálszivattyúk egy- vagy többfokozatú, villanymotoros, motoros vagy kardánhajtású kivitelben.'],
  ['egyeb-szivattyuk','Rovatti nagy nyomású, SAE-karimás és traktor kardánhajtású felszíni szivattyúk öntözési, vízellátási és ipari alkalmazásokra.'],
  ['fuggoleges-szivattyuk', 'Rovatti függőleges tengelyű szivattyúk kút-, tározó- és öntözővíz-kiemeléshez.'],
  ['tobblepcsos-centrifugal','Rovatti többfokozatú centrifugálszivattyúk öntözési, vízellátási és nyomásfokozási rendszerekhez.'],
] as [string,string][]) {
  const category:any=(await payload.find({collection:'categories',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true})).docs[0]
  if(category) await payload.update({collection:'categories',id:category.id,overrideAccess:true,data:{description} as any})
}
for(const [slug,summary] of [
  ['rovatti-kutszivattyuk','Radiális és félaxiális búvárszivattyúk 4–16 colos kutakhoz, mélykúti vízellátásra és mezőgazdasági öntözéshez.'],
  ['rovatti-fuggoleges','Függőleges tengelyű szivattyúk kutakhoz, tározókhoz és öntözőrendszerek vízellátásához.'],
  ['rovatti-centrifugal','Felszíni centrifugálszivattyúk egy- vagy többfokozatú, villanymotoros, SAE-karimás vagy traktoros kardánhajtású kivitelben.'],
] as [string,string][]) {
  const family:any=(await payload.find({collection:'product-families',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true})).docs[0]
  if(family) await payload.update({collection:'product-families',id:family.id,overrideAccess:true,data:{summary,sourceUrl:overview,sourceDetails:'A család kártyájának leírása a Rovatti hivatalos termékáttekintőjéből készült.'} as any})
}
await payload.destroy()
console.log(`Rovatti: ${entries.length} termékadatlap, kategóriák és márkabemutató frissítve; meglévő képek megtartva.`)
