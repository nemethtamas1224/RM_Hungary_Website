import '../site.css'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import SiteHeader from './site-header'

type MediaRef = {url?:string|null;alt?:string|null}|number|string|null|undefined
const media=(v:MediaRef):v is {url?:string|null;alt?:string|null}=>Boolean(v&&typeof v==='object')
export const dynamic='force-dynamic'
export default async function FrontendLayout({children}:{children:React.ReactNode}){
 const payload=await getPayload({config}); const [settings,categories]=await Promise.all([payload.findGlobal({slug:'site-settings',depth:1}),payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,sort:'sortOrder',depth:0})])
 const logo=media(settings.logo)?settings.logo:null
 const nav=settings.navigation||[]
 const categoryRoots=categories.docs.filter(category=>!category.parent)
 return <>
  <SiteHeader companyName={settings.companyName||'RM Hajdú Hungary'} phone={settings.phone} email={settings.email} logo={settings.logo as any} navigation={nav} categories={categories.docs.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:typeof c.parent==='object'?c.parent?.id:c.parent}))}/>
  {children}
  <footer className="footer"><div className="wrap footer-grid"><div className="footer-brand"><Image src="/images/RM_hajdu_horizontalis_v01.png" alt="RM Hajdú Hungary" width={300} height={48}/><p>{settings.companyName}<br/>{settings.address}</p></div><div className="footer-categories"><b>Termékkategóriák</b>{categoryRoots.map(category=><Link href={`/termekek/${category.slug}`} key={category.id}>{category.name}</Link>)}</div><div className="footer-company"><b>Cégünkről</b><Link href="/#rolunk">Rólunk</Link><Link href="/szolgaltatasok">Szolgáltatások</Link><a href="/tartalom/adatvedelmiadatkezelesiszab.pdf" target="_blank" rel="noreferrer">Adatvédelmi és adatkezelési szabályzat</a><a href="/tartalom/adatfeldolgozasiszerz.pdf" target="_blank" rel="noreferrer">Adatfeldolgozási megbízási szerződés</a></div><div className="footer-contact"><b>Kapcsolat</b>{settings.email&&<a href={`mailto:${settings.email}`}>{settings.email}</a>}<a href={`tel:${String(settings.phone||'').replaceAll(' ','')}`}>{settings.phone}</a><span>{settings.mailingAddress}</span><nav className="social-links" aria-label="Közösségi oldalak"><a href="https://www.facebook.com/people/RM-Hajdú-Hungary/61591815750672/" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor"/></svg></a><a href="https://www.linkedin.com/company/rm-hajdú-hungary-kft/" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-2 2h4v11H3zm6 0h4v1.6c.8-1.2 2-1.9 3.8-1.9 3.2 0 4.2 2 4.2 5.2V21h-4v-5.4c0-1.5-.3-2.7-1.9-2.7s-2.1 1.2-2.1 2.7V21H9z" fill="currentColor"/></svg></a><a href="https://www.instagram.com/rmhajduhungary/" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.8" r="1.2" fill="currentColor"/></svg></a></nav></div></div><div className="wrap footer-bottom"><span>{settings.companyName}</span></div></footer>
 </>
}
