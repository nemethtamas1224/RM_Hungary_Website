import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'
import { categoryHref, familyHref, productHref, relationArray } from '@/lib/catalog'
import ProductGallery from './product-gallery'
import { FamilyOverviewContent, ProductTechnicalContent } from './cms-catalog-content'

export const dynamic='force-dynamic'
type Props={params:Promise<{segments:string[]}>}
const idOf=(x:any)=>String(typeof x==='object'&&x?x.id:x||'')
const photo=(x:any)=>x&&typeof x==='object'&&x.url?x:null

export default async function CatalogRoute({params}:Props){
 const {segments}=await params
 const payload=await getPayload({config})
 const [catResult,familyResult,productResult]=await Promise.all([
  payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:200,sort:'sortOrder',depth:1}),
  payload.find({collection:'product-families',where:{status:{equals:'published'}},limit:100,sort:'sortOrder',depth:1}),
  payload.find({collection:'products',where:{status:{equals:'published'}},limit:500,depth:1}),
 ])
 const categories=catResult.docs as any[]
 const families=familyResult.docs as any[]
 const products=(productResult.docs as any[]).filter(p=>p.productKind!=='legacy')
 const categoryCardMedia=(category:any)=>{
  const ownImage=photo(category.image)
  if(ownImage)return {image:ownImage,description:category.description||''}
  const categoryFamilies=families.filter(f=>idOf(f.category)===String(category.id)).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
  const familyWithImage=categoryFamilies.find(f=>photo(f.image))
  if(familyWithImage)return {image:photo(familyWithImage.image),description:category.description||familyWithImage.cardDescription||familyWithImage.summary||''}
  const familyIds=new Set(categoryFamilies.map(f=>String(f.id)))
  const categoryProducts=products.filter(p=>relationArray(p.category).some((c:any)=>idOf(c)===String(category.id))||familyIds.has(idOf(p.family))).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
  const productWithImage=categoryProducts.find(p=>photo(p.cardImage)||photo(p.image))
  return {image:productWithImage?photo(productWithImage.cardImage)||photo(productWithImage.image):null,description:category.description||categoryFamilies.find(f=>f.cardDescription||f.summary)?.cardDescription||categoryFamilies.find(f=>f.summary)?.summary||categoryProducts.find(p=>p.cardDescription||p.summary)?.cardDescription||categoryProducts.find(p=>p.summary)?.summary||''}
 }
 const familyCardMedia=(family:any)=>{
  const familyProducts=products.filter(p=>idOf(p.family)===String(family.id)&&p.showInFamily!==false).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
  const image=photo(family.image)||familyProducts.map(p=>photo(p.cardImage)||photo(p.image)).find(Boolean)||null
  const description=family.cardDescription||family.summary||familyProducts.find(p=>p.cardDescription)?.cardDescription||familyProducts.find(p=>p.summary)?.summary||''
  return {image,description}
 }
 const [rootSlug,subSlug,third,fourth]=segments
 const root=categories.find(c=>c.slug===rootSlug&&!c.parent)
 if(segments.length===1){
  if(root){
   const children=categories.filter(c=>idOf(c.parent)===String(root.id))
   return <main className="plain-page wrap"><p className="eyebrow"><Link href="/termekek">Termékek</Link></p><h1>{root.name}</h1><div className="category-card-grid">{children.map(c=>{const {image,description}=categoryCardMedia(c);const cardClass=image?'category-card category-image-card':description?'category-card category-description-card':'category-card';return <Link className={cardClass} href={categoryHref(c,categories)} key={c.id}>{image&&<Image className="category-card-image" src={image.url} alt={image.alt||c.name} width={Number(image.width)||320} height={Number(image.height)||190} sizes="(max-width: 560px) 100vw, (max-width: 800px) 50vw, 30vw"/>}<span>{c.name}</span>{description&&<small>{description}</small>}</Link>})}</div></main>
  }
  const old=(await payload.find({collection:'products',where:{slug:{equals:rootSlug}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
  if(old){
   if(old.productKind==='legacy'){
    const map=(await payload.find({collection:'legacy-mappings',where:{legacyKey:{equals:String(old.legacyKey)}},limit:1,overrideAccess:true})).docs[0] as any
    if(map?.targetPath)permanentRedirect(map.targetPath)
   }
   if(old.status==='published')permanentRedirect(productHref(old,categories,families))
  }
  notFound()
 }
 const sub=root&&categories.find(c=>c.slug===subSlug&&idOf(c.parent)===String(root.id))
 if(!sub)notFound()
 if(segments.length===2){
  const familyItems=families.filter(f=>idOf(f.category)===String(sub.id)).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
  const productItems=products.filter(p=>!p.family&&relationArray(p.category).some((c:any)=>idOf(c)===String(sub.id))).sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
  return <main className="plain-page wrap"><p className="eyebrow"><Link href="/termekek">Termékek</Link>　/　<Link href={categoryHref(root,categories)}>{root.name}</Link></p><h1>{sub.name}</h1>{sub.description&&<p className="lead">{sub.description}</p>}{familyItems.length>0&&<section className="catalog-section"><h2>Termékcsaládok</h2><div className={sub.slug==='csevelodobos'?'category-card-grid reel-family-grid':sub.slug==='motoros-szivattyuegysegek'?'category-card-grid pump-family-grid':'category-card-grid'}>{familyItems.map(f=>{
   const {image,description:desc}=familyCardMedia(f),logo=photo(f.cardLogo)
   const isReel=sub.slug==='csevelodobos',isPump=sub.slug==='motoros-szivattyuegysegek'
   const cardClass=isReel?'category-card reel-family-card':isPump?'category-card pump-family-card':image||logo?'category-card product-family-image-card':'category-card'
   return <Link className={cardClass} href={familyHref(f,categories)} key={f.id}>{image&&<Image className={isReel?'reel-family-image':'product-family-card-image'} src={image.url} alt={image.alt||f.name} width={320} height={190}/ >}{logo&&<Image className={isReel?'reel-family-logo':isPump?'pump-family-logo':'reel-family-logo'} src={logo.url} alt={logo.alt||`${f.cardTitle||f.name} logó`} width={220} height={100}/ >}<span>{f.cardTitle||f.name}</span>{desc&&<small>{desc}</small>}<b aria-hidden="true">↗</b></Link>
  })}</div></section>}{productItems.length>0&&<section className="catalog-section"><h2>Termékek</h2><div className={sub.slug==='ontozoszarnyak'?'catalog-grid wing-product-grid':'catalog-grid'}>{productItems.map(p=><ProductCard key={p.id} product={p} href={productHref(p,categories,families)} />)}</div></section>}</main>
 }
 if(segments.length===3&&third==='rm-nagy-teljesitmenyu'&&sub.slug==='csevelodobos')permanentRedirect(`/termekek/${root.slug}/${sub.slug}/rm-magnum`)
 const family=families.find(f=>f.slug===third&&idOf(f.category)===String(sub.id))
 if(segments.length===3&&family){
  const familyProducts=products.filter(p=>idOf(p.family)===String(family.id)&&p.showInFamily!==false)
  const orderedReels=[...familyProducts].sort((a:any,b:any)=>{
   const order=Number(a.sortOrder||0)-Number(b.sortOrder||0)
   if(order!==0)return order
   const number=(p:any)=>Number(String(p.name).match(/\d+/)?.[0]||Infinity)
   const difference=number(a)-number(b)
   return Number.isFinite(difference)&&difference!==0?difference:String(a.name).localeCompare(String(b.name),'hu')
  })
  return <main className="plain-page wrap"><p className="eyebrow"><Link href={categoryHref(sub,categories)}>{sub.name}</Link></p><h1>{family.cardTitle||family.name}</h1>{family.overviewIntro&&<section className="gx-intro"><p>{family.overviewIntro}</p>{family.overviewSections?.length>0&&<a className="button button-red" href="#family-details">Részletes bemutató</a>}</section>}{!family.overviewIntro&&family.summary&&<p className="lead">{family.summary}</p>}{orderedReels.length>0&&<div className={family.slug==='rm-ontozoszarnyak'?'catalog-grid gx-product-grid wing-product-grid':'catalog-grid gx-product-grid'}>{orderedReels.map(p=><ProductCard key={p.id} product={p} href={productHref(p,categories,families)} variants={p.cardHoseSizes?.length?p.cardHoseSizes:p.hoseSizes}/>)}</div>}{family.overviewSections?.length>0&&<div id="family-details"><FamilyOverviewContent family={family} showIntro={!family.overviewIntro}/></div>}{family.slug==='rm-szivattyuegysegek'&&orderedReels[0]&&<div id="mop-family-details"><ProductTechnicalContent sections={orderedReels[0].technicalSections||[]} tables={orderedReels[0].technicalTables||[]} videos={orderedReels[0].videos||[]}/></div>}</main>
 }
 const slug=segments.length===4?fourth:third
 if(slug==='albatros-72')permanentRedirect(`/termekek/${rootSlug}/${subSlug}/${third}/albatros`)
 const result=await payload.find({collection:'products',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1,depth:2})
 const p=result.docs[0] as any
 if(!p||p.productKind==='legacy')notFound()
 const canonical=productHref(p,categories,families)
 if(canonical!==`/termekek/${segments.join('/')}`)permanentRedirect(canonical)
 const image=photo(p.image)
 const gallery=(p.gallery||[]).map(photo).filter(Boolean)
 const documents=(p.documents||[]).map(photo).filter(Boolean)
 const wing=family?.slug==='rm-ontozoszarnyak'
 return <main className="plain-page wrap"><p className="eyebrow"><Link href="/termekek">Termékek</Link>　/　<Link href={categoryHref(sub,categories)}>{sub.name}</Link>{family&&<>　/　<Link href={familyHref(family,categories)}>{family.name}</Link></>}</p><section className="product-detail"><div className={image&&Number(image.width)<=350?'detail-image detail-image-low-res':'detail-image'}>{image?<Image src={image.url} alt={image.alt||p.name} fill sizes="(max-width: 700px) 100vw, 52vw"/>:<span>RM</span>}</div><div><p className="eyebrow">{p.manufacturer&&typeof p.manufacturer==='object'?p.manufacturer.name:p.brand||'RM Hajdú Hungary'}</p><h1>{p.name}</h1>{p.summary&&<p className="lead">{p.summary}</p>}<Link className="button button-red" href={`/ajanlatkeres?termek=${encodeURIComponent(p.slug)}`}>Ajánlatot kérek</Link></div></section>{!wing&&p.hoseSizes?.length>0&&<section className="hose-size-panel"><div className="hose-size-heading"><div><p className="eyebrow">RM csévélődobok</p><h2>Méretek</h2></div><span>{p.hoseSizes.length} változat</span></div><p className="hose-size-legend">Átmérő (mm) / tömlőhossz (m) — például 110/450: 110 mm átmérő, 450 m hossz.</p><div className="hose-size-grid">{p.hoseSizes.map((size:any,i:number)=><span key={size.id||i}>{size.diameterMm}/{size.lengthM}</span>)}</div><p className="hose-size-caveat">A méretváltozatokat ajánlatkéréskor egyeztetjük.</p></section>}{p.description&&<section className="source-content"><RichText data={p.description as any}/></section>}<ProductTechnicalContent sections={p.technicalSections||[]} tables={p.technicalTables||[]} videos={p.videos||[]}/>{p.specifications?.length>0&&<section className="spec-section"><h2>Műszaki adatok</h2><dl>{p.specifications.map((s:any,i:number)=><div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl></section>}{!wing&&p.configurations?.length>0&&<section className="spec-section"><h2>Választható kivitelek</h2><dl>{p.configurations.map((c:any,i:number)=><div key={i}><dt>{c.name}</dt><dd>{c.value||'Érdeklődésre'}</dd></div>)}</dl></section>}{gallery.length>0&&<ProductGallery photos={gallery} name={p.name}/ >}{documents.length>0&&<section className="spec-section"><h2>Dokumentumok</h2><ul>{documents.map((d:any)=><li key={d.id}><a href={d.url}>{d.alt||d.filename||'Dokumentum'}</a></li>)}</ul></section>}</main>
}
function ProductCard({product,href,variants,wingLengths,imageSrc,logoSrc,wingDescription}:{product:any;href:string;variants?:Array<{diameterMm:number;lengthM:number}>;wingLengths?:string[];imageSrc?:string;logoSrc?:string;wingDescription?:[string,string]}){
 const image=photo(product.image)
 const cardImage=photo(product.cardImage)
 const cardLogo=photo(product.cardLogo)
 const cmsVariants=Array.isArray(product.cardHoseSizes)&&product.cardHoseSizes.length?product.cardHoseSizes:Array.isArray(variants)&&variants.length?variants:undefined
 const cardCopy=String(product.cardDescription||'').trim().split('\n').filter(Boolean)
 const copy=cardCopy.length?cardCopy:wingDescription||(!cmsVariants&&!wingLengths&&product.summary?[product.summary]:[])
 const pictureClass=(cardImage||image)&&Number((cardImage||image).width)<=350?'product-picture product-picture-contained':wingDescription&&imageSrc?'product-picture wing-photo-picture':(cardLogo||logoSrc)?'product-picture wing-logo-picture':'product-picture'
 return <article className={cmsVariants||wingLengths||copy.length?'product-card gx-product-card':'product-card'}><Link className="gx-product-link" aria-label={`${product.name} részletei`} href={href}><div className={pictureClass}>{cardImage?<Image src={cardImage.url} alt={cardImage.alt||product.name} fill sizes="(max-width: 800px) 80vw, 26vw"/>:imageSrc?<Image src={imageSrc} alt={`${product.name} termékkép`} fill sizes="(max-width: 800px) 80vw, 26vw"/>:logoSrc?<Image src={logoSrc} alt="" fill sizes="(max-width: 800px) 80vw, 26vw"/>:image?<Image src={image.url} alt={image.alt||product.name} fill sizes="(max-width: 800px) 80vw, 26vw"/>:<span className="product-placeholder">RM</span>}</div>{<><div className="product-card-meta"><span>{product.manufacturer&&typeof product.manufacturer==='object'?product.manufacturer.name:product.brand||'RM'}</span></div><h3>{product.name}</h3></>}</Link>{(copy.length>0||cardLogo||logoSrc)&&<div className="wing-card-description">{cardLogo?<Image className="wing-card-logo" src={cardLogo.url} alt={cardLogo.alt||`${product.name} logó`} width={180} height={65}/>:logoSrc&&<Image className="wing-card-logo" src={logoSrc} alt={`${product.name} logó`} width={180} height={65}/ >}{copy.map((line,index)=><span key={index}>{line}</span>)}</div>}{cmsVariants&&<div className="gx-card-sizes" aria-label={product.name+' tömlőátmérő és hossz változatai'}><span className="gx-card-sizes-label">Elérhető méretek</span><div>{cmsVariants.map((size:any)=><span key={size.diameterMm+'/'+size.lengthM}><b>{size.diameterMm}</b><i>/</i><em>{size.lengthM}</em></span>)}</div></div>}{wingLengths&&<div className="gx-card-sizes"><span className="gx-card-sizes-label">Szárnyhossz</span><div>{wingLengths.map(value=><span key={value}><em>{value}</em></span>)}</div></div>}</article>
}
