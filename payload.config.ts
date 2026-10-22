import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import { contentEditor } from './src/collections/access'
import { Categories } from './src/collections/Categories'
import { Manufacturers } from './src/collections/Manufacturers'
import { ProductFamilies } from './src/collections/ProductFamilies'
import { LegacyMappings } from './src/collections/LegacyMappings'
import { UsedMachines } from './src/collections/UsedMachines'
import { Inquiries } from './src/collections/Inquiries'
import { Media } from './src/collections/Media'
import { News } from './src/collections/News'
import { Pages } from './src/collections/Pages'
import { Products } from './src/collections/Products'
import { References } from './src/collections/References'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const usePostgres = process.env.DATABASE_ADAPTER === 'postgres'
const payloadSecret = process.env.PAYLOAD_SECRET || (process.env.NODE_ENV === 'development' ? 'local-development-only-secret-not-for-deployment' : '')
if (!payloadSecret) throw new Error('PAYLOAD_SECRET must be set before production use.')

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      beforeDashboard: ['/src/components/admin/CatalogDashboard#CatalogDashboard'],
    },
  },
  collections: [Manufacturers, Categories, ProductFamilies, Products, UsedMachines, News, References, Pages, Inquiries, Media, LegacyMappings, Users],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  db: usePostgres
    ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } })
    : sqliteAdapter({ client: { url: process.env.DATABASE_URL || 'file:./data/rm-hungary.db' } }),
  upload: { limits: { fileSize: 20_000_000 } },
  globals: [
    {
      slug: 'site-settings',
      label: 'Webhely beállításai',
      access: { read: () => true, update: contentEditor },
      fields: [{ type: 'tabs', tabs: [
        { label: 'Cég és kapcsolat', fields: [
          { name: 'companyName', type: 'text', defaultValue: 'RM Hajdú Hungary Kft.' },
          { name: 'address', type: 'text', defaultValue: '4132 Tépe, Rákóczi u. 8.' },
          { name: 'mailingAddress', type: 'text', defaultValue: '4132 Tépe, Fő u. 8.' },
          { name: 'phone', type: 'text', defaultValue: '+36 30/2780944', admin: { description: 'A nyilvános weboldalon megjelenő telefonszám. A hivatkozás kattintható telefonhívást indít.' } },
          { name: 'email', type: 'email' },
          { name: 'mapEmbedUrl', type: 'text', admin: { description: 'A Google Térkép megosztásából származó beágyazási URL.' } },
        ] },
        { label: 'Kezdőlap', fields: [
          { name: 'heroSubhead', type: 'text', admin: { description: 'Rövid kiegészítő mondat a kezdőoldal nyitóképe mellett.' } },
          { name: 'heroImage', type: 'relationship', relationTo: 'media', admin: { description: 'A kezdőoldal nagy nyitóképe.' } },
          { name: 'serviceImage', type: 'relationship', relationTo: 'media', admin: { description: 'A kezdőoldali szolgáltatások blokk képe.' } },
          { name: 'logo', type: 'relationship', relationTo: 'media', admin: { description: 'A fejléc és lábléc RM logója.' } },
        ] },
        { label: 'Navigáció', fields: [
          { name: 'navigation', type: 'array', admin: { description: 'Felső menüpontok. A hivatkozás lehet belső útvonal, például /kapcsolat.' }, fields: [{ name: 'label', type: 'text', required: true }, { name: 'href', type: 'text', required: true }] },
        ] },
        { label: 'Keresőoptimalizálás', fields: [
          { name: 'seoTitle', type: 'text' },
          { name: 'seoDescription', type: 'textarea' },
        ] },
        { label: 'Régi beállítások', admin: { hidden: true }, description: 'Korábbi admin mezők, megőrzött értékekkel. A jelenlegi oldal nem használja őket.', fields: [
          { name: 'emailSourceUrl', type: 'text', admin: { hidden: true } },
          { name: 'heroHeadline', type: 'text', admin: { hidden: true } },
          { name: 'footerNavigation', type: 'array', admin: { hidden: true }, fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
        ] },
      ] }],
    },
  ],
})
