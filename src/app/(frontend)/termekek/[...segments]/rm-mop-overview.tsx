import Image from 'next/image'

export const photos=['MOP-1095-5.jpg','MOP-1095-6.jpg','MOP-1095-3.jpg','MOP-1095-4.jpg','MOP-1095-1.jpg','mop2.jpg','mop3.jpg','mop4.jpg','SistemaCWM.jpg','Pompe.png']
export const features=[
 'Nagy teherbírású, kerekes alváz három állítható támasztékkal és levehető vonórúddal.',
 'A vázba épített, 450 vagy 480 literes tartály szennyeződés-visszatartóval, valamint üzemanyagszint-jelzővel.',
 'Jobb és bal oldali üzemanyag-betöltő nyílás zárható kupakkal.',
 'Lemezből készült tető, oldalsó védőburkolatok és zárható motorháztető.',
 'A dízelmotor és a szivattyú magas minőségű rugalmas tengelykapcsolóval csatlakozik.',
 'Rezgéscsillapító bakok választják el a motort, a szivattyút és az alvázat.',
 'Részben rozsdamentes acél akkumulátortartó és a szivattyútér megvilágítása.',
]
export const options=[
 '600/650 literes vagy 1 000 literes, megnövelt tartály; bonderizált tartály.',
 'Kirpy rendszerű, RM által gyártott indítószivattyú, amely a kipufogógáz nyomásával tölti fel a szívótömlőt.',
 '12 V-os elektromos szivattyúval működő feltöltőrendszer, igény szerint automatikus indítással és távvezérléssel.',
 'A szivattyú fix nyomóágán 4 vagy 5 colos cső és 180°-ban forgatható végcsatlakozó.',
 'Hangszigetelt fülke belső kipufogóval.',
 'Kézi csörlős, állítható hosszúságú szívókar; vagy hidraulikusan forgatható szívókar traktorcsatlakozással.',
 'Három hidraulikus támasztóláb.',
 'GSM-modem az elektronikus vezérlőpanelhez; opcionális Idromop nyomásszabályzó és GSM/GPRS távfelügyelet.',
]
export const pumpRows=[['APS 100-125 B','3 600','28,1','1–5','78'],['APS 125-175 A','4 000','25,1','1–5','81'],['APS 125-175 B','6 500','23,6','1–5','83'],['APS 150-500 B','12 500','12,0','1','84'],['APS 150-500 B2','10 600','21,8','2','83,5']]

export default function RMMopOverview(){
 return <section className="rm-mop-overview">
  <header className="rm-mop-intro"><Image src="/images/rm-mop/LogoMOP.png" alt="RM MOP" width={200} height={100}/><p>A MOP sorozat motoros szivattyúegységei új gyári motorokkal készülnek, többek között FPT (Iveco), JCB, Deutz, John Deere és Perkins motorokkal. A szivattyúk RM, Rovatti vagy Caprari nagy teljesítményű kivitelek.</p></header>
  <section className="spec-section"><h2>RM „hideg vizes” motorhűtő rendszer</h2><p>Az opcionális, szabadalmaztatott hőcserélő 304-es rozsdamentes acélból készül, és a szivattyú bemenetéhez csatlakozik. A zárt motorhűtő kör hőjét az öntözővíznek adja át, a motor eredeti termosztatikus szelepe által szabályozva. A ventilátor és a hagyományos hűtő elhagyásával körülbelül 8% motorteljesítmény takarítható meg; a zajszint is csökken. A rendszer intercooleres motorokhoz két hőcserélővel készülhet.</p><p>Zajszint: kb. 77,5 dB 8 méteres távolságból, 1 650 1/perc motorfordulaton.</p><div className="rm-mop-gallery rm-mop-diagrams"><a href="/images/rm-mop/SistemaCWM.jpg" target="_blank"><Image src="/images/rm-mop/SistemaCWM.jpg" alt="Az RM motorhűtő hőcserélő rendszer ábrája" width={900} height={600}/></a></div></section>
  <section className="spec-section"><h2>RM nagy teljesítményű szivattyúk</h2><p>Az RM szivattyúk vízszintes tengelyű, többfokozatú centrifugálszivattyúk. Közvetlenül csatlakoztathatók SAE3 karimás dízelmotorhoz vagy csupasz tengelyű villanymotorhoz. A túlméretezett, nagy igénybevételre tervezett alkatrészek a korszerű dízelmotorok mechanikai terhelésére készültek; a gyártó az alkatrészek olaszországi gyártását és minősített anyagok használatát jelzi.</p><ul>{['Nagyobb méretű tengelytámasz és A osztályú, olajkenésű főcsapágyak.','Nagy szilárdságú, edzett és megeresztett rozsdamentes acél tengely; védőpersely a tömítés környezetében.','A járókerekek és a rugalmas tengelykapcsoló rögzítése szabadalmaztatott, nagy torziós merevségű FGP nyomatékátvitellel.','Tömítőzsinóros vagy igény szerint mechanikus tengelytömítés.'].map((x,i)=><li key={i}>{x}</li>)}</ul>
   <div className="rm-mop-table-wrap"><table className="rm-mop-table"><thead><tr><th>Szivattyúmodell</th><th>Max. szállítás (l/perc)</th><th>Max. nyomás (bar)</th><th>Járókerekek száma</th><th>Max. hatásfok (%)</th></tr></thead><tbody>{pumpRows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>
  </section>
  <section className="spec-section"><h2>Választható felszerelések</h2><ul>{options.map((o,i)=><li key={i}>{o}</li>)}</ul></section>
  <section className="rm-mop-gallery"><h2>Képgaléria</h2><div>{photos.map((name,i)=><a href={`/images/rm-mop/${name}`} target="_blank" key={name}><Image src={`/images/rm-mop/${name}`} alt={`RM MOP motoros szivattyúegység – ${i+1}. kép`} width={760} height={520}/></a>)}</div></section>
  <section className="spec-section"><h2>Általános katalógus és videók</h2><a className="button button-red" href="/images/rm-mop/MOP2015.pdf" target="_blank">MOP katalógus (PDF)</a> <a className="button button-dark" href="https://www.youtube.com/channel/UCcvpX7aOXLTcyrJ8G_iJQYQ?view_as=subscriber" target="_blank" rel="noreferrer">RM videógaléria</a></section>
 </section>
}
