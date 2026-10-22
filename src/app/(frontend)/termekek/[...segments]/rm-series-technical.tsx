import Image from 'next/image'

const models:Record<string,{label:string;table?:string;dimensions?:string;common?:string;videos?:string[]}>= {
 'rm-magnum-giant':{label:'GIANT XJ',table:'xj-giant-table.jpg',dimensions:'xj-giant-dim.jpg',common:'xjm-shared-dim.jpg',videos:['lN0L-QpkYcA']},
 'rm-major-evo':{label:'Major EVO',table:'xj-major-table.jpg',dimensions:'xj-major-dim.jpg',common:'xjm-shared-dim.jpg',videos:['OuW5Z1LOuJI','E1n3Vu66vmc']},
 'rm-600-xj':{label:'600 XJ',table:'xj-600-table.jpg',dimensions:'xj-600-dim.jpg',common:'xjm-shared-dim.jpg',videos:['0SDkwzOb41c']},
 'rm-700-xj':{label:'700 XJ',table:'xj-700-table.jpg',dimensions:'xj-700-dim.jpg',common:'xjm-shared-dim.jpg',videos:['EYzUvny9EuU','KzUG1vcxaUU']},
 'rm-800-xj':{label:'800 XJ',table:'xj-800-table.jpg',dimensions:'xj-800-dim.jpg',common:'xjm-shared-dim.jpg',videos:['JOnxXgapKbQ','Wrv-kVxwxz8']},
 'rm-840-xj':{label:'840 XJ',table:'xj-840-table.jpg',dimensions:'xj-840-dim.jpg',common:'xjm-shared-dim.jpg'},
 'rm-900-xj-evo':{label:'900 XJ',table:'xj-900-table.jpg',dimensions:'xj-900-dim.jpg',common:'xjm-shared-dim.jpg',videos:['ijKGaRg4zl8']},
 'rm-giant-xjm':{label:'GIANT XJM',table:'xjm-giant-4.jpg',dimensions:'xjm-giant-5.jpg',common:'xjm-shared-dim.jpg',videos:['2VxiJxVcJ1o']},
 'rm-major-xjm':{label:'Major XJM',table:'xjm-major-7.jpg',dimensions:'xjm-major-8.jpg',common:'xjm-shared-dim.jpg',videos:['esYtEhbknLg','_cECSYMEihM']},
 'rm-900-xjm':{label:'900 XJM',table:'xjm-900-2.jpg',dimensions:'xjm-900-3.jpg',common:'xjm-shared-dim.jpg',videos:['2UNVdLr0UtA']},
 'rm-840-xjm':{label:'840 XJM',table:'xjm-840-4.jpg',dimensions:'xjm-840-5.jpg',common:'xjm-shared-dim.jpg',videos:['ApxX37uqIDs']},
 'rm-700-xjm':{label:'700 XJM',table:'xjm-700-7.jpg',dimensions:'xjm-700-8.jpg',common:'xjm-shared-dim.jpg'},
 'rm-magnum-fx':{label:'Magnum FX',table:'fx-magnum-2.jpg',dimensions:'fx-magnum-3.jpg',common:'fx-shared-dim.jpg'},
 'rm-900-fx':{label:'900 FX',dimensions:'fx-magnum-3.jpg',common:'fx-shared-dim.jpg'},
}
export const rmSeriesSlugs=Object.keys(models)
const baseEquipment=['Bypass-szal ellátott, áramláselosztó turbina.','Négysebességes hajtómű olajfürdőben futó tengelyekkel.','TLT-hajtás a tömlő gyors feltekeréséhez.','Automatikus fékrendszer a tömlő letekeréséhez.','A feltekert tömlő átmérőjéhez igazodó automatikus sebességkompenzátor.','Tömlőlazulás elleni biztonsági szerkezet és leállítás szabálytalan feltekerés esetén.','Elektronikus feltekerésisebesség-mérő és digitális óra.','Mikrométeresen szabályozható, csigahajtású tömlővezető dupla vezetősínnel.','Golyóscsapágyas dobtartó tömítőgyűrűvel és rozsdamentes persellyel.','Hidraulikus, külön vezérelhető hátsó rögzítőkonzolok és kocsiemelés.','Állítható kocsinyomtáv és kerékmagasság.','Lassú visszatérésű SIME öntözőgép fúvókakészlettel.','Glicerinfürdős nyomásmérő a gépen; SIME kivitelben a szórófejen is.','Gömbcsukló és ballasztok az öntözőkocsin.','Magasságban állítható vonószem.','Tűzihorganyzott váz és festett dob; kétoldali vízbemenet.']
const xjEquipment=['Automatikus VertiLift™ kocsifelhúzás az öntözés végén.']
const xjmEquipment=['Beépített motoros szivattyúegység a gép vázában.','Vákuumszivattyú a tömlő kiürítéséhez.','Ø150 mm-es szívócső forgócsuklóval és Ø550 mm-es szűrőkosárral.','Hatkaros hidraulikus vezérlőtömb elfordítható konzolon.','A dob forgó középtányérjának hidraulikus elfordítása.']
const fxEquipment=['Fix váz radiál abroncsokkal és sárvédőkkel.','Automatikusan kompenzált, négysebességes olajfürdős hajtómű.','Hidraulikusan vezérelt, önkiegyenlítő hátsó rögzítőkonzolok és kocsiemelés.','Hidraulikus vonórúd-támasz és hidraulikus vezérlőtömb.','BAUER 133 csatlakozókkal szerelt flexibilis gumibetápláló tömlő.','Háromkerekű, teljesen tűzihorganyzott, változtatható nyomtávú kocsi; az első kerék a PE tömlőt követi.']
const configurations:Record<string,string[]>={'rm-900-fx':['120/770, 125/720, 135/600, 140/580, 150/500, 160/400']}
export const rmSeriesContent = models
export const rmSeriesEquipment = { baseEquipment, xjEquipment, xjmEquipment, fxEquipment, configurations }
export default function RMSeriesTechnical({slug}:{slug:string}){
 const d=models[slug];if(!d)return null
 return <>
  <section className="spec-section gx-technical"><h2>{d.label} mérettáblázata és méretrajza</h2>{d.table&&<figure className="gx-dimensions"><Image src={'/images/rm-products/'+d.table} alt={`${d.label} gyártói tömlőméret- és teljesítménytáblázata`} width={1100} height={620}/></figure>}{d.dimensions&&<figure className="gx-dimensions"><Image src={'/images/rm-products/'+d.dimensions} alt={`${d.label} gyártói méretrajza`} width={900} height={620}/></figure>}{d.common&&<figure className="gx-dimensions"><Image src={'/images/rm-products/'+d.common} alt="RM csévélődobok általános méretrajza" width={900} height={620}/></figure>}<p className="source-note">A táblázatok katalógusadatokat mutatnak; a kivitel és rendelhetőség modellenként egyeztetendő.</p></section>
  {configurations[slug]&&<section className="spec-section"><h2>Gyártói csőméret-tartomány</h2><p>{configurations[slug].join(' · ')}</p></section>}
  <section className="spec-section"><h2>Standard felszerelés</h2><ul className="gx-equipment">{[...baseEquipment,...(slug.includes('xj')?xjEquipment:[]),...(slug.includes('xjm')?xjmEquipment:[]),...(slug.includes('fx')?fxEquipment:[])].map((item,i)=><li key={i}>{item}</li>)}</ul><p className="source-note">A felszereltség modellenként és kiválasztott opciók szerint változhat.</p></section>
  {d.videos?.length&&<section className="spec-section gx-video-section"><h2>{d.label} videók</h2><div className="gx-videos">{d.videos.map((id,i)=><div className="gx-video" key={id}><iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={`${d.label} gyártói videó ${i+1}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>)}</div></section>}
 </>
}
