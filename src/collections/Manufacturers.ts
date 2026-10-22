import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers', labels: { singular: 'Gyártó', plural: 'Gyártók' },
  admin: { group: 'Katalógus', useAsTitle: 'name', defaultColumns: ['name','featuredOnHomepage','homepageSortOrder','status','updatedAt'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'logo', type: 'relationship', relationTo: 'media' },
    { name: 'featuredOnHomepage', label: 'Kiemelt partner a kezdőlapon', type: 'checkbox', defaultValue: false, admin: { description: 'Bekapcsolva a márka megjelenik a kezdőlapi partnerlogók között.' } },
    { name: 'homepageSortOrder', label: 'Kezdőlapi sorrend', type: 'number', defaultValue: 0, admin: { description: 'A kisebb számú márka előrébb jelenik meg; azonos értéknél a márkanév dönt.' } },
    { name: 'sourceUrl', type: 'text' },
    { name: 'reviewNote', type: 'textarea', admin: { description: 'Belső ellenőrzési megjegyzés.' } },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{label:'Piszkozat',value:'draft'},{label:'Publikált',value:'published'}] },
  ],
}
