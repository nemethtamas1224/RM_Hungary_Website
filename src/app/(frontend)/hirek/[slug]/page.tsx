import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic='force-dynamic'
export default async function NewsArticle({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const payload=await getPayload({config})
 const result=await payload.find({collection:'news',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1,depth:1})
 const item=result.docs[0];if(!item)notFound()
 const image=item.coverImage&&typeof item.coverImage==='object'?item.coverImage:null
 return <main className="plain-page wrap article-detail"><p className="eyebrow"><Link href="/hirek">Hírek és pályázatok</Link></p><h1>{item.title}</h1>{item.publishedAt&&<p className="article-date">{new Date(item.publishedAt).toLocaleDateString('hu-HU')}</p>}{image?.url&&<div className="article-detail-image"><Image src={image.url} alt={image.alt||item.title} fill sizes="(max-width: 800px) 100vw, 900px" priority/></div>}{item.excerpt&&<p className="lead">{item.excerpt}</p>}{item.body&&<div className="source-content"><RichText data={item.body as any}/></div>}</main>
}
