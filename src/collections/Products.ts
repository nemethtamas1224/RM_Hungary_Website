import type { CollectionConfig, Where } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Termék', plural: 'Termékek' },
  admin: {
    group: 'Katalógus',
    useAsTitle: 'name',
    defaultColumns: ['manufacturer', 'category', 'family', 'name', 'productKind', 'status'],
    baseListFilter: () => ({ productKind: { not_equals: 'legacy' }, status: { not_equals: 'archived' } }),
  },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 25 },
  hooks: {
    beforeValidate: [async ({ data, originalDoc, req }) => {
      const values = data || {}
      const relationId = (value: unknown): string | number | undefined => {
        if (typeof value === 'string' || typeof value === 'number') return value
        if (value && typeof value === 'object' && 'id' in value) {
          const id = (value as { id?: unknown }).id
          return typeof id === 'string' || typeof id === 'number' ? id : undefined
        }
        return undefined
      }
      const familyId = relationId(values.family ?? originalDoc?.family)
      const categoryId = relationId(values.category ?? originalDoc?.category)
      const manufacturerId = relationId(values.manufacturer ?? originalDoc?.manufacturer)
      const productKind = values.productKind ?? originalDoc?.productKind
      if (categoryId && productKind !== 'legacy') {
        const category = await req.payload.findByID({ collection: 'categories', id: categoryId, depth: 0, overrideAccess: true })
        if (!relationId(category.parent)) {
          throw new Error('A terméket egy alkategóriába sorold, ne a főkategóriába.')
        }
      }
      if (familyId && categoryId) {
        const family = await req.payload.findByID({ collection: 'product-families', id: familyId, depth: 0, overrideAccess: true })
        const familyCategoryId = relationId(family.category)
        const familyManufacturerId = relationId(family.manufacturer)
        if (familyCategoryId !== categoryId) {
          throw new Error('A termék kategóriájának meg kell egyeznie a kiválasztott termékcsalád kategóriájával.')
        }
        if (familyManufacturerId && manufacturerId !== familyManufacturerId) {
          throw new Error('A termék gyártójának meg kell egyeznie a kiválasztott termékcsalád gyártójával.')
        }
      }
      return data
    }],
  },
  fields: [
    { type: 'tabs', tabs: [
      { label: '1. Helye a katalógusban', description: 'A termék útvonala: márka → főkategória → alkategória → termékcsalád → termék. Válaszd ki az alkategóriát; a termékcsalád ehhez igazodik, és közvetlen kategóriaterméknél üresen maradhat.', fields: [
        { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers', admin: { description: 'A terméket gyártó márka.' } },
        { name: 'brand', type: 'text', admin: { description: 'Csak akkor töltsd ki, ha nincs külön gyártórekord, vagy a termék több márkához kapcsolódik.' } },
        { name: 'category', label: 'Alkategória', type: 'relationship', relationTo: 'categories', required: true, index: true, filterOptions: { catalogRole: { equals: 'catalog' }, parent: { exists: true } }, admin: { description: 'A főkategória alkategóriáját válaszd ki. A család- és termékoldal ehhez az ághoz tartozik.' } },
        { name: 'family', label: 'Termékcsalád', type: 'relationship', relationTo: 'product-families', filterOptions: ({ data }) => {
          const selected = Array.isArray(data?.category) ? data.category : data?.category ? [data.category] : []
          const categoryIDs = selected.map((item: unknown) => typeof item === 'object' && item !== null && 'id' in item ? item.id : item).filter((id: unknown): id is string | number => typeof id === 'string' || typeof id === 'number')
          const selectedManufacturer = Array.isArray(data?.manufacturer) ? data.manufacturer[0] : data?.manufacturer
          const manufacturerId = typeof selectedManufacturer === 'object' && selectedManufacturer !== null && 'id' in selectedManufacturer
            ? selectedManufacturer.id
            : selectedManufacturer
          const where: Where = {}
          if (categoryIDs.length) where.category = { in: categoryIDs }
          if (typeof manufacturerId === 'string' || typeof manufacturerId === 'number') where.manufacturer = { equals: manufacturerId }
          return Object.keys(where).length ? where : false
        }, admin: { description: 'Csak a kiválasztott alkategóriához tartozó család választható. Közvetlen kategóriaterméknél hagyd üresen.' } },
        { name: 'name', type: 'text', required: true, index: true },
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
        { name: 'modelCode', type: 'text' },
        { name: 'productKind', type: 'select', required: true, defaultValue: 'model', options: [{label:'Konkrét modell',value:'model'},{label:'Terméktípus',value:'type'},{label:'Tartozék',value:'accessory'},{label:'Régi forrásoldal',value:'legacy'}] },
        { name: 'sortOrder', type: 'number', label: 'Megjelenési sorrend', defaultValue: 0, admin: { description: 'A kategória- és családoldalon a kisebb számú termék jelenik meg előbb.' } },
        { name: 'showInFamily', type: 'checkbox', label: 'Jelenjen meg a termékcsalád oldalán', defaultValue: true, admin: { description: 'Kikapcsolva a rekord megmarad és közvetlen termékoldala működik, de nem szerepel a család modellkártyái között.' } },
        { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{ label: 'Piszkozat', value: 'draft' }, { label: 'Publikált', value: 'published' }, { label:'Archivált',value:'archived' }] },
        { name: 'reviewState', type: 'select', required: true, defaultValue: 'source-check', options: [{label:'Forrás ellenőrizendő',value:'source-check'},{label:'Név azonosított',value:'identified'},{label:'Műszaki adatok hiányoznak',value:'specs-missing'},{label:'Publikálásra kész',value:'ready'}] },
        { name: 'reviewNote', type: 'textarea', admin: { description: 'Belső megjegyzés, a nyilvános termékoldalon nem jelenik meg.' } },
      ] },
      { label: '2. Leírás és adatok', fields: [
        { name: 'summary', type: 'textarea' },
        { name: 'cardDescription', label: 'Kártya rövid leírása', type: 'textarea', admin: { description: 'A termékkártyán megjelenő tömör szöveg. Üresen hagyva a rövid leírást használja.' } },
        { name: 'description', type: 'richText' },
        { name: 'specifications', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'value', type: 'text', required: true }] },
        { name: 'configurations', type: 'array', fields: [{name:'name',type:'text',required:true},{name:'value',type:'text'},{name:'sourceUrl',type:'text'}] },
        { name: 'hoseSizes', type: 'array', label: 'Öntözőcső méretváltozatok', admin: { description: 'Egy sor egy átmérő (mm) / tömlőhossz (m) változat. A katalógusadat nem igazolja az aktuális készletet vagy rendelhetőséget.' }, fields: [
          { name: 'diameterMm', type: 'number', label: 'Átmérő (mm)', required: true, min: 1 },
          { name: 'lengthM', type: 'number', label: 'Tömlőhossz (m)', required: true, min: 1 },
        ] },
        { name: 'gxTechnical', type: 'checkbox', label: 'GX műszaki adatlap tartalom', admin: { description: 'A gyártó 540 GX adatlapjához tartozó technikai táblázat és standard felszerelés megjelenítése.' } },
        { name: 'technicalSections', label: 'Kiegészítő műszaki és bemutató szakaszok', type: 'array', admin: { description: 'Modellspecifikus leírások és ábrák a termékoldalon.' }, fields: [
          { name: 'heading', label: 'Cím', type: 'text', required: true },
          { name: 'body', label: 'Szöveg', type: 'textarea' },
          { name: 'image', label: 'Ábra vagy kép', type: 'relationship', relationTo: 'media' },
          { name: 'imageAlt', label: 'Kép alternatív szövege', type: 'text' },
        ] },
        { name: 'technicalTables', label: 'Műszaki táblázatok', type: 'array', admin: { description: 'Szerkeszthető, reszponzív táblázatok a termékoldalon. A nem használt oszlopokat hagyd üresen.' }, fields: [
          { name: 'title', label: 'Táblázat címe', type: 'text', required: true },
          { name: 'column1', label: '1. oszlop címe', type: 'text', required: true },
          { name: 'column2', label: '2. oszlop címe', type: 'text', required: true },
          { name: 'column3', label: '3. oszlop címe', type: 'text' },
          { name: 'column4', label: '4. oszlop címe', type: 'text' },
          { name: 'column5', label: '5. oszlop címe', type: 'text' },
          { name: 'column6', label: '6. oszlop címe', type: 'text' },
          { name: 'rows', label: 'Táblázatsorok', type: 'array', fields: [
            { name: 'cell1', label: '1. oszlop', type: 'text', required: true },
            { name: 'cell2', label: '2. oszlop', type: 'text', required: true },
            { name: 'cell3', label: '3. oszlop', type: 'text' },
            { name: 'cell4', label: '4. oszlop', type: 'text' },
            { name: 'cell5', label: '5. oszlop', type: 'text' },
            { name: 'cell6', label: '6. oszlop', type: 'text' },
          ] },
        ] },
        { name: 'videos', label: 'Termékvideók', type: 'array', fields: [
          { name: 'title', label: 'Videó címe', type: 'text', required: true },
          { name: 'url', label: 'YouTube vagy videó URL', type: 'text', required: true },
        ] },
      ] },
      { label: '3. Képek és dokumentumok', fields: [
        { name: 'image', type: 'relationship', relationTo: 'media' },
        { name: 'cardImage', label: 'Termékkártya képe', type: 'relationship', relationTo: 'media', admin: { description: 'Ha üres, a termék főképe jelenik meg a kártyán.' } },
        { name: 'cardLogo', label: 'Kártyalogó', type: 'relationship', relationTo: 'media' },
        { name: 'cardHoseSizes', label: 'Kártyán megjelenő méretek', type: 'array', admin: { description: 'A gyártói kategóriakártyán közölt méretpárok. Külön kezelhető a termékoldal konfigurációitól.' }, fields: [
          { name: 'diameterMm', type: 'number', label: 'Átmérő (mm)', required: true, min: 1 },
          { name: 'lengthM', type: 'number', label: 'Tömlőhossz (m)', required: true, min: 1 },
        ] },
        { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
        { name: 'documents', type: 'relationship', relationTo: 'media', hasMany: true },
        { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true },
      ] },
      { label: 'Forrás és kereső', fields: [
        { name: 'sourceDetails', type: 'textarea', admin: { description: 'Eredeti termékleírás a forrásoldalról.' } },
        { name: 'sourceEvidence', type: 'array', fields: [{name:'url',type:'text',required:true},{name:'note',type:'textarea'},{name:'media',type:'relationship',relationTo:'media'}] },
        { name: 'originalUrl', type: 'text' },
        { name: 'legacyKey', type: 'text', index: true, admin: { hidden: true } },
        { name: 'seoTitle', type: 'text' },
        { name: 'seoDescription', type: 'textarea' },
      ] },
    ] },
  ],
}
