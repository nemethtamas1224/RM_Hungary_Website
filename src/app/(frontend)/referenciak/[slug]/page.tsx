import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic='force-dynamic'
const cleanText=(value:string)=>value.split('Termékeink')[0].replace(/\s*(?:…|\.{1,3})?\s*Tovább\s*»?\s*$/i,'').trim()
export default async function ReferenceDetail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const payload=await getPayload({config})
 const result=await payload.find({collection:'references',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1,depth:1})
 const item=result.docs[0];if(!item)notFound()
 return <main className="plain-page wrap article-detail"><p className="eyebrow"><Link href="/referenciak">Referenciák</Link></p><h1>{item.title}</h1>{item.location&&<p className="lead">{item.location}</p>}{item.summary&&<p className="reference-summary">{cleanText(item.summary)}</p>}{item.body&&<div className="source-content"><RichText data={item.body as any}/></div>}</main>
}
