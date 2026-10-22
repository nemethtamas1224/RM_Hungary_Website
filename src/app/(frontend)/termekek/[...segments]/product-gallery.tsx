'use client'

import { useState } from 'react'
import Image from 'next/image'

type Photo={id:string|number;url:string;alt?:string|null}

export default function ProductGallery({photos,name}:{photos:Photo[];name:string}){
 const [active,setActive]=useState(0)
 if(!photos.length)return null
 const current=photos[active]
 const move=(step:number)=>setActive(index=>(index+step+photos.length)%photos.length)
 return <section className="product-slideshow" aria-label={`${name} képgalériája`}>
  <div className="product-slideshow-main">
   <Image src={current.url} alt={current.alt||name} fill priority sizes="(max-width:700px) 100vw, 58vw"/>
   {photos.length>1&&<><button type="button" className="slideshow-arrow slideshow-prev" onClick={()=>move(-1)} aria-label="Előző kép">‹</button><button type="button" className="slideshow-arrow slideshow-next" onClick={()=>move(1)} aria-label="Következő kép">›</button><span className="slideshow-counter">{active+1} / {photos.length}</span></>}
  </div>
  {photos.length>1&&<div className="product-slideshow-thumbs">{photos.map((photo,index)=><button type="button" className={index===active?'active':''} onClick={()=>setActive(index)} key={photo.id} aria-label={`${index+1}. kép megjelenítése`} aria-current={index===active?'true':undefined}><Image src={photo.url} alt="" fill sizes="90px"/></button>)}</div>}
 </section>
}
