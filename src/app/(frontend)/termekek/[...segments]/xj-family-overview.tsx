import Image from 'next/image'

export const sections=[
 {title:'Stabil működés a talajra támaszkodó vázzal',image:'xj-600-main.jpg',alt:'RM XJ csévélődob',text:'Az XJ kivitel a talajra támaszkodó dobcsalád. A hidraulikusan leengedhető alap a munkavégzéshez stabil alátámasztást ad, szállításkor pedig a gép kerekein marad.'},
 {title:'Két helyzet, egyszerű átállás',image:'xj-700-main.jpg',alt:'RM 700 XJ csévélődob',text:'A gép szállításkor a futóművén gördül, öntözéskor pedig a támasztószerkezetre ereszkedik. A forgó kialakítás lehetővé teszi a tömlő letekerését a gép áthelyezése nélkül.'},
 {title:'Biztonságos rögzítés és tömlővezetés',image:'xj-800-main.jpg',alt:'RM 800 XJ csévélődob',text:'A hátsó rögzítőelemek a talajhoz horgonyozzák a gépet. A kialakítás a hosszú és nagy átmérőjű tömlőkkel végzett munkánál is stabilitást szolgál.'},
 {title:'Masszív, korrózióálló szerkezet',image:'xj-900-main.jpg',alt:'RM 900 XJ csévélődob',text:'A monolit, tűzihorganyzott váz, a kiegyensúlyozott tengelyelrendezés és a csökkentett vonószemterhelés stabil és tartós kialakítást ad. A felszereltség modellenként és rendelhető opciók szerint változik.'},
]
export const familyOverviewData={title:'Az RM XJ család bemutatása',intro:['Az RM XJ talajra támaszkodó csévélődob-család szállításkor kerekeken gördül, munkavégzéskor stabil támaszokra ereszkedik. Ismerd meg a kialakítás részleteit és válaszd ki a megfelelő modellt.']}
export default function XJFamilyOverview(){return <section className="gx-family-overview"><h2>Az RM XJ család bemutatása</h2><div className="gx-family-sections">{sections.map((s,i)=><article className="gx-family-section" key={s.title}><div className="gx-family-copy"><p className="eyebrow">{String(i+1).padStart(2,'0')}</p><h3>{s.title}</h3><p>{s.text}</p></div><figure><Image src={'/images/rm-products/'+s.image} alt={s.alt} width={440} height={270}/></figure></article>)}</div></section>}
