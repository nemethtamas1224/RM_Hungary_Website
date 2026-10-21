import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic='force-dynamic'
export default async function ManufacturersPage(){
 const payload=await getPayload({config})
 const result=await payload.find({collection:'manufacturers',where:{status:{equals:'published'}},limit:100,sort:'name'})
 const logos:Record<string,string>={cosmeco:'/images/manufacturers/cosmeco.png','da-ros':'/images/manufacturers/da-ros.png','de-cloet':'/images/manufacturers/de-cloet.png',giunti:'/images/manufacturers/giunti.png',mantovani:'/images/manufacturers/mantovani.png',oliveragro:'/images/manufacturers/oliveragro.png',rm:'/elemek/rolunk_rm.png',rovatti:'/images/manufacturers/rovatti.png',starpower:'/images/manufacturers/starpower.png',valducci:'/images/manufacturers/valducci.png',vodar:'/images/manufacturers/vodar.png'}
 return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Gyártók</h1><div className="manufacturer-grid">{result.docs.map(m=><Link className="manufacturer-card" href={`/gyartok/${m.slug}`} key={m.id}><span className="manufacturer-logo-panel">{logos[m.slug]?<Image src={logos[m.slug]} alt={`${m.name} logó`} fill sizes="(max-width: 560px) 90vw, (max-width: 900px) 42vw, 28vw"/>:<span className="manufacturer-logo-text">{m.name}</span>}</span><strong>{m.name}</strong></Link>)}</div></main>
}
