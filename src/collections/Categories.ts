import type { CollectionConfig } from 'payload'
import { contentEditor, publicRead } from './access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategória', plural: 'Kategóriák' },
  admin: {
    group: 'Katalógus',
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'sortOrder'],
    baseListFilter: () => ({ catalogRole: { equals: 'catalog' } }),
  },
  access: { create: contentEditor, delete: contentEditor, read: publicRead, update: contentEditor },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Kategória', description: 'Hozzon létre főkategóriát, majd annak alkategóriáit.', fields: [
        { name: 'name', type: 'text', required: true, index: true, admin: { description: 'Főkategóriát vagy annak alkategóriáját hozd létre. Az alkategóriánál válaszd ki a szülő főkategóriát.' } },
        { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { description: 'Az oldal URL-jének egyedi azonosítója.' } },
        { name: 'description', type: 'textarea' },
        { name: 'parent', label: 'Szülő főkategória', type: 'relationship', relationTo: 'categories', filterOptions: { catalogRole: { equals: 'catalog' }, parent: { exists: false } }, admin: { description: 'Üresen hagyva főkategória. Alkategóriánál válaszd ki a szülő főkategóriát.' } },
        { name: 'sortOrder', type: 'number', label: 'Sorrend', defaultValue: 0 },
        { name: 'image', type: 'relationship', relationTo: 'media' },
      ] },
      { label: 'Archív adatok', admin: { hidden: true }, description: 'Belső megőrzési adatok; a régi kategóriák nem jelennek meg az aktív katalóguslistában.', fields: [
        { name: 'catalogRole', type: 'select', required: true, defaultValue: 'catalog', options: [{label:'Aktív katalógus',value:'catalog'},{label:'Régi forráskategória',value:'legacy'}] },
        { name: 'originalUrl', type: 'text' },
      ] },
    ] },
  ],
}
