import React from 'react'

const steps = [
  {
    number: '01',
    title: 'Kategória',
    description: 'Hozd létre a főkategóriát, majd alatta az alkategóriát. A régi, archivált kategóriák nem keverednek az aktív listába.',
    href: '/admin/collections/categories',
    action: 'Kategóriák kezelése',
  },
  {
    number: '02',
    title: 'Termékcsalád',
    description: 'Válaszd ki azt az alkategóriát, amely alatt a család megjelenik.',
    href: '/admin/collections/product-families',
    action: 'Termékcsaládok kezelése',
  },
  {
    number: '03',
    title: 'Termék',
    description: 'Válaszd ki a kategóriát, majd az alá tartozó családot. A mentés ellenőrzi, hogy a két kapcsolat egyezik-e.',
    href: '/admin/collections/products',
    action: 'Termékek kezelése',
  },
]

export function CatalogDashboard() {
  return (
    <section className="catalog-workflow" aria-labelledby="catalog-workflow-title">
      <div className="catalog-workflow__intro">
        <p className="catalog-workflow__eyebrow">RM termékkatalógus</p>
        <h2 id="catalog-workflow-title">Kategória → termékcsalád → termék</h2>
        <p>A főkategóriák alkategóriákra bomlanak. A család az alkategóriához tartozik, a termék pedig a család alatt jelenik meg. Ha egy terméknek nincs családja, közvetlenül az alkategóriához rendelhető.</p>
      </div>
      <div className="catalog-workflow__steps">
        {steps.map((step) => (
          <article className="catalog-workflow__step" key={step.number}>
            <span className="catalog-workflow__number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <a href={step.href}>{step.action}<span aria-hidden="true"> →</span></a>
          </article>
        ))}
      </div>
      <p className="catalog-workflow__note">A szerkesztési menü csak az aktív katalóguskategóriákat mutatja. A megőrzött régi URL-ek nem szerepelnek a napi szerkesztési listákban.</p>
    </section>
  )
}
