import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Oldal', plural: 'Oldalak' },
  admin: { group: 'Tartalom', useAsTitle: 'title', defaultColumns: ['title', 'status'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 25 },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Oldal tartalma', fields: [
        { name: 'title', type: 'text', required: true, index: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'pageType', type: 'select', required: true, defaultValue: 'page', options: [{ label: 'Oldal', value: 'page' }, { label: 'Kategória', value: 'category' }, { label: 'Forrásoldal', value: 'source' }], admin: { hidden: true } },
        { name: 'status', type: 'select', required: true, defaultValue: 'published', options: [{ label: 'Piszkozat', value: 'draft' }, { label: 'Publikált', value: 'published' }] },
        { name: 'content', type: 'textarea' },
        { name: 'layout', type: 'blocks', blocks: [
      { slug: 'text', labels: { singular: 'Szövegblokk', plural: 'Szövegblokkok' }, fields: [{ name: 'heading', type: 'text' }, { name: 'body', type: 'textarea' }] },
      { slug: 'media-gallery', labels: { singular: 'Képgaléria', plural: 'Képgalériák' }, fields: [{ name: 'images', type: 'relationship', relationTo: 'media', hasMany: true }] },
        ] },
      ] },
      { label: 'Keresőoptimalizálás', fields: [
        { name: 'seoTitle', type: 'text' },
        { name: 'seoDescription', type: 'textarea' },
      ] },
      { label: 'Belső archívum', admin: { hidden: true }, description: 'Megőrzött régi forrásadatok; a látogatói oldalon nem jelennek meg.', fields: [
        { name: 'sourceText', type: 'textarea', admin: { description: 'Belső forrásarchívum. A nyilvános oldalakon nem jelenik meg.' } },
        { name: 'sourceHeadings', type: 'json' },
        { name: 'sourceLinks', type: 'json' },
        { name: 'originalUrl', type: 'text' },
        { name: 'legacyKey', type: 'text', index: true },
      ] },
    ] },
  ],
}
