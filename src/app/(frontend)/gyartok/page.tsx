import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic='force-dynamic'
export default async function ManufacturersPage(){
 const payload=await getPayload({config})
 const result=await payload.find({collection:'manufacturers',where:{status:{equals:'published'}},limit:100,sort:'name',depth:1})
 return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Gyártók</h1><div className="manufacturer-grid">{result.docs.map(m=>{const logo=m.logo&&typeof m.logo==='object'?m.logo:null;return <Link className="manufacturer-card" href={`/gyartok/${m.slug}`} key={m.id}><span className="manufacturer-logo-panel">{logo?.url?<Image src={logo.url} alt={logo.alt||`${m.name} logó`} fill sizes="(max-width: 560px) 90vw, (max-width: 900px) 42vw, 28vw"/>:<span className="manufacturer-logo-text">{m.name}</span>}</span><strong>{m.name}</strong></Link>})}</div></main>
}
