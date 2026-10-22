import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic='force-dynamic'
export const metadata:Metadata={robots:{index:false,follow:true}}
export default async function SourcePage({params}:{params:Promise<{key:string}>}){
 const {key}=await params
 const payload=await getPayload({config})
 const [result,mapping]=await Promise.all([
  payload.find({collection:'products',where:{legacyKey:{equals:key}},limit:1,depth:1,overrideAccess:true}),
  payload.find({collection:'legacy-mappings',where:{legacyKey:{equals:key}},limit:1,depth:0,overrideAccess:true}),
 ])
 const p=result.docs[0] as any;const map=mapping.docs[0] as any
 if(!p||!map)notFound()
 const images=(p.gallery||[]).filter((v:any)=>v&&typeof v==='object'&&v.url)
 const documents=(p.documents||[]).filter((v:any)=>v&&typeof v==='object'&&v.url)
 const gxModelLogos=key==='10'?[{src:'/tartalom/termek/540-gx_1_2.png',alt:'540 GX sárga modellfelirat',width:180,height:59},{src:'/tartalom/termek/1000gx_1_1.png',alt:'1000 GX sárga modellfelirat',width:180,height:55}]:[]
 return <main className="plain-page wrap page-content"><p className="eyebrow">Eredeti RM termékoldal · {key}</p><h1>{p.name}</h1><Link className="text-link" href={map.targetPath}>Az új kategória megnyitása</Link>{p.sourceDetails&&<div className="source-content source-preserved">{p.sourceDetails}</div>}{images.length>0&&<section className="catalog-section"><h2>Eredeti képek</h2><div className="media-gallery">{images.map((m:any)=><div key={m.id}><Image src={m.url} alt={m.alt||p.name} fill sizes="(max-width:700px) 80vw, 24vw"/></div>)}</div></section>}{gxModelLogos.length>0&&<section className="catalog-section"><h2>Eredeti modellfeliratok</h2><div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'1.25rem'}}>{gxModelLogos.map(logo=><Image key={logo.src} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} style={{display:'block',width:logo.width,height:'auto',objectFit:'contain'}}/>)}</div></section>}{documents.length>0&&<section className="catalog-section"><h2>Eredeti dokumentumok</h2><ul>{documents.map((d:any)=><li key={d.id}><a href={d.url}>{d.alt||d.filename||'Dokumentum'}</a></li>)}</ul></section>}{p.originalUrl&&<p className="source-note">Eredeti forrás: <a href={p.originalUrl}>{p.originalUrl}</a></p>}</main>
}
