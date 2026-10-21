const items=[
 'Eredeti cserealkatrészek beszerzése és alkatrész-utánpótlás',
 'Az általunk forgalmazott gépek és berendezések karbantartása, javítása és komplett felújítása',
 'Szivattyú- és öntözőtelepek tervezése, építése és kivitelezése',
 'Csőhálózatok telepítése',
]
export default function ServiceHighlights(){return <ul className="service-highlights">{items.map(item=><li key={item}>{item}</li>)}</ul>}
