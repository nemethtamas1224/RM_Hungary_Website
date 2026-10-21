import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

// The site reads its content and metadata from Payload at request time. Avoid
// prerendering any route (including Next's not-found page) against a build
// container that intentionally has no production database.
export const dynamic = 'force-dynamic'

export async function generateMetadata():Promise<Metadata>{
  const payload=await getPayload({config});const settings=await payload.findGlobal({slug:'site-settings'})
  return {title:{default:settings.seoTitle||settings.companyName||'RM Hajdú Hungary',template:`%s | ${settings.companyName||'RM Hajdú Hungary'}`},description:settings.seoDescription||''}
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hu"><body>{children}</body></html>
}
