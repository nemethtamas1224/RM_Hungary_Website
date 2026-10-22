import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const ProductFamilies: CollectionConfig = {
  slug: 'product-families', labels: { singular: 'Termékcsalád', plural: 'Termékcsaládok' },
  admin: { group: 'Katalógus', useAsTitle: 'name', defaultColumns: ['manufacturer','category','name','status','sortOrder'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  fields: [
    { type: 'tabs', tabs: [
      { label: '1. Helye a katalógusban', description: 'A termékcsalád egy gyártóhoz és egy alkategóriához tartozik. A konkrét termékeket a Termékek között, ez alatt a család alatt vedd fel.', fields: [
        { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers', admin: { description: 'A termékcsalád gyártója.' } },
        { name: 'category', label: 'Alkategória', type: 'relationship', relationTo: 'categories', required: true, filterOptions: { catalogRole: { equals: 'catalog' }, parent: { exists: true } }, admin: { description: 'A főkategória alkategóriáját válaszd ki.' } },
        { name: 'name', type: 'text', required: true, unique: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'sortOrder', type: 'number', label: 'Sorrend', defaultValue: 0 },
        { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{label:'Piszkozat',value:'draft'},{label:'Publikált',value:'published'}] },
        { name: 'summary', type: 'textarea' },
        { name: 'image', type: 'relationship', relationTo: 'media' },
        { name: 'cardLogo', label: 'Kártyalogó', type: 'relationship', relationTo: 'media' },
        { name: 'cardTitle', label: 'Kártyán megjelenő név', type: 'text' },
        { name: 'cardDescription', label: 'Kártya rövid leírása', type: 'textarea', admin: { description: 'Rövid, a termékcsalád kártyáján és a főoldali választóban megjelenő szöveg.' } },
      ] },
      { label: 'Családbemutató', description: 'A családoldal részletes, nyilvános bemutatója. A szakaszokat a megadott sorrendben jelenítjük meg.', fields: [
        { name: 'overviewTitle', label: 'Bemutató címe', type: 'text' },
        { name: 'overviewIntro', label: 'Bevezető', type: 'textarea' },
        { name: 'overviewSections', label: 'Bemutató szakaszai', type: 'array', fields: [
          { name: 'heading', label: 'Cím', type: 'text', required: true },
          { name: 'body', label: 'Szöveg', type: 'textarea', required: true },
          { name: 'image', label: 'Kép', type: 'relationship', relationTo: 'media' },
          { name: 'imageAlt', label: 'Kép alternatív szövege', type: 'text' },
          { name: 'secondaryImage', label: 'Második kép', type: 'relationship', relationTo: 'media' },
          { name: 'secondaryImageAlt', label: 'Második kép alternatív szövege', type: 'text' },
        ] },
        { name: 'videos', label: 'Videók', type: 'array', fields: [
          { name: 'title', label: 'Videó címe', type: 'text', required: true },
          { name: 'url', label: 'YouTube vagy videó URL', type: 'text', required: true },
        ] },
      ] },
      { label: 'Belső forrásadatok', admin: { hidden: true }, fields: [
        { name: 'sourceDetails', type: 'textarea', admin: {description:'Az eredeti termékcsoport oldalon megőrzött szöveg.'} },
        { name: 'sourceUrl', type: 'text' },
        { name: 'reviewNote', type: 'textarea' },
      ] },
    ] },
  ],
}
