import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { productHref, relationArray } from '@/lib/catalog'

export const dynamic='force-dynamic'
export default async function ManufacturerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const payload=await getPayload({config})
 const m=(await payload.find({collection:'manufacturers',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1})).docs[0]
 if(!m)notFound()
 const [productResult,catResult,familyResult]=await Promise.all([
  payload.find({collection:'products',where:{and:[{manufacturer:{equals:m.id}},{status:{equals:'published'}}]},limit:200,depth:1}),
  payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,depth:1}),
  payload.find({collection:'product-families',where:{status:{equals:'published'}},limit:100,depth:1}),
 ])
 const products=productResult.docs.filter(p=>p.productKind!=='legacy')
 const categories=catResult.docs as any[]
 const groups=categories.filter(category=>products.some(p=>relationArray(p.category).some((value:any)=>String(typeof value==='object'?value.id:value)===String(category.id))))
 return <main className="plain-page wrap"><p className="eyebrow"><Link href="/gyartok">Gyártók</Link></p><h1>{m.name}</h1>{m.description&&<p className="lead">{m.description}</p>}<div className="category-card-grid">{groups.map(category=>{const parent=categories.find(c=>String(c.id)===String(typeof category.parent==='object'?category.parent?.id:category.parent));return <Link className="category-card" href={`/termekek/${parent?.slug}/${category.slug}`} key={category.id}><span>{category.name}</span><b aria-hidden="true">↗</b></Link>})}</div>{groups.length===0&&<p>Ehhez a gyártóhoz még nincs közzétett termékkategória.</p>}</main>
}
