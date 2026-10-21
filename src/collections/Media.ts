import type { CollectionConfig } from 'payload'
import { contentEditor, publicRead } from './access'

export const Media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Médiaeszköz', plural: 'Médiaeszközök' },
  upload: { staticDir: process.env.MEDIA_UPLOAD_DIR || 'public/uploads', mimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*'] },
  admin: { useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'mimeType'] },
  access: { create: contentEditor, delete: contentEditor, read: publicRead, update: contentEditor },
  fields: [{ name: 'alt', type: 'text' }, { name: 'sourceUrl', type: 'text' }, { name: 'credit', type: 'text' }],
}
