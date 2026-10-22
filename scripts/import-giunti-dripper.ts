import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const product = (await payload.find({
  collection: 'products', where: { slug: { equals: 'szetszerelheto-csepegtetogomba' } },
  limit: 1, depth: 0, overrideAccess: true,
})).docs[0] as any

if (!product) throw new Error('Missing Giunti product: szetszerelheto-csepegtetogomba')

const paragraphs = [
  'A szétszerelhető csepegtetőgomba gyümölcsösök pontszerű öntözéséhez készült, névleges vízkijuttatása 2 l/óra.',
  'LPE csőbe pattintható; beépítéséhez 2 mm-es lyukasztó szükséges. Szétszedhető, ezért tisztításhoz könnyen hozzáférhető.',
  'Üzemi nyomástartománya 0,8–2,0 bar. Ellenáll az UV-sugárzásnak, a kemikáliáknak és a műtrágyáknak.',
]
const description = {
  root: {
    type: 'root', format: '', indent: 0, version: 1,
    children: paragraphs.map((text) => ({
      type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
}

await payload.update({
  collection: 'products', id: product.id, overrideAccess: true,
  data: {
    summary: 'Szétszerelhető csepegtetőgomba gyümölcsösök pontszerű öntözéséhez, tisztításhoz hozzáférhető kivitelben.',
    description,
    specifications: [
      { label: 'Névleges vízkijuttatás', value: '2 l/óra' },
      { label: 'Üzemi nyomástartomány', value: '0,8–2,0 bar' },
      { label: 'Csatlakozás', value: 'LPE csőbe pattintható; 2 mm-es lyukasztóval' },
      { label: 'Karbantartás', value: 'Szétszerelhető és tisztítható' },
      { label: 'Ellenállóság', value: 'UV-sugárzás, kemikáliák és műtrágyák' },
    ],
    originalUrl: 'https://www.rmhungary.hu/index.php?alkat=13',
    sourceDetails: 'A tartalom az RM Hajdú Hungary korábbi Giunti kategóriaoldalának archivált termékleírásából származik; a Giunti jelenlegi hivatalos oldalán külön termékadatlapot és biztosan egyező termékfotót nem találtam.',
    sourceEvidence: [{
      url: 'https://www.rmhungary.hu/index.php?alkat=13',
      note: 'Archivált magyar Giunti kategóriaoldal; a szétszerelhető csepegtetőgomba külön bekezdésében közölt leírás és adatok.',
    }],
    reviewState: 'source-check',
    reviewNote: 'A leírás pontos helyi történeti forrásból került át; gyártói termékoldal és termékazonos fotó nem igazolt.',
  } as any,
})

console.log(`Updated Giunti ${product.slug} public description; verified historic specifications retained.`)
await payload.destroy()
