(() => {
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('hu').trim()
  const cleanMail = (value) => String(value || '').replace(/[\r\n\0]/g, ' ').trim()
  const cleanBody = (value) => String(value || '').replace(/\0/g, '').trim()
  let catalogProductNames = {}

  document.querySelector('.mobile-menu-toggle')?.addEventListener('click', (event) => {
    const button = event.currentTarget
    const nav = document.querySelector('.nav')
    const open = !nav?.classList.contains('nav-open')
    nav?.classList.toggle('nav-open', open)
    button.setAttribute('aria-expanded', String(open))
  })

  for (const form of document.querySelectorAll('.site-search')) {
    const input = form.querySelector('input[name="q"]')
    const button = form.querySelector('button')
    button?.addEventListener('click', (event) => {
      if (!form.classList.contains('search-open')) {
        event.preventDefault()
        form.classList.add('search-open')
        input?.removeAttribute('aria-hidden')
        if (input) input.tabIndex = 0
        input?.focus()
      }
    })
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const q = input?.value.trim()
      if (q) location.href = `/kereses?q=${encodeURIComponent(q)}`
    })
  }

  document.querySelectorAll('.quote-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (!form.reportValidity()) return
      const values = new FormData(form)
      const honeypot = String(values.get('website') || '')
      if (honeypot) return
      const recipient = 'rmhajduhungary@gmail.com'
      const subject = cleanMail('Ajánlatkérés – RM Hajdú Hungary')
      const lines = []
      for (const [key, label] of [['name', 'Név'], ['email', 'E-mail cím'], ['phone', 'Telefonszám'], ['message', 'Üzenet']]) {
        const value = cleanBody(values.get(key))
        if (value) lines.push(`${label}: ${value}`)
      }
      const selectedSlug = new URLSearchParams(location.search).get('termek')
      const productContext = selectedSlug ? catalogProductNames[selectedSlug] : ''
      if (productContext) lines.unshift(`Kért termék: ${productContext}`)
      const context = document.querySelector('.quote-page .lead')?.innerText?.trim()
      if (context) lines.unshift(`Kapcsolódó oldal: ${context}`)
      lines.push('Adatkezelési hozzájárulás: igen')
      const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`
      location.href = mailto
    })
  })

  fetch('/catalog.json').then((r) => r.ok ? r.json() : null).then((catalog) => {
    if (!catalog) return
    catalogProductNames = Object.fromEntries(catalog.products.map(product => [product.slug, product.name]))
    setupHomeCatalog(catalog)
  }).catch(() => {})

  fetch('/search-index.json').then((r) => r.ok ? r.json() : []).then((index) => {
    let resultBox = document.querySelector('.search-results')
    if (!resultBox) {
      const form = document.querySelector('.search-large')
      if (!form) return
      resultBox = document.createElement('div')
      resultBox.className = 'search-results'
      form.after(resultBox)
    }
    const query = new URLSearchParams(location.search).get('q') || ''
    const formInput = document.querySelector('.search-large input[name="q"]')
    if (formInput) formInput.value = query
    if (!query) return
    const needle = normalize(query)
    const matches = index.filter(item => normalize(`${item.title} ${item.text}`).includes(needle)).slice(0, 80)
    resultBox.replaceChildren()
    if (!matches.length) {
      const p = document.createElement('p'); p.textContent = 'Nincs találat.'; resultBox.append(p); return
    }
    for (const item of matches) {
      const link = document.createElement('a'); link.href = item.href
      const type = document.createElement('span'); type.textContent = item.type
      const title = document.createElement('b'); title.textContent = item.title
      link.append(type, title); resultBox.append(link)
    }
  }).catch(() => {})

  function setupHomeCatalog(data) {
    const grid = document.querySelector('.category-choice-grid')
    if (!grid) return
    const groups = data.categories.filter(c => !c.parent)
    const children = data.categories.filter(c => c.parent)
    const ids = new Map(groups.map(g => [normalize(g.name), String(g.id)]))
    let selectedGroup = ''
    let selectedCategory = ''
    let offset = 0
    const panelFor = () => document.querySelector('.home-subcategory-panel')
    grid.querySelectorAll('.category-choice').forEach(button => {
      const id = ids.get(normalize(button.innerText))
      if (!id) return
      button.addEventListener('click', () => {
        selectedGroup = selectedGroup === id ? '' : id
        selectedCategory = ''; offset = 0
        grid.querySelectorAll('.category-choice').forEach(b => { const active = ids.get(normalize(b.innerText)) === selectedGroup; b.classList.toggle('active', active); b.setAttribute('aria-expanded', String(active)) })
        panelFor()?.remove()
        if (!selectedGroup) return
        const group = groups.find(c => String(c.id) === selectedGroup)
        const panel = document.createElement('div'); panel.className = 'home-subcategory-panel'; panel.id = 'home-subcategories'
        const head = document.createElement('div'); head.className = 'subcategory-panel-head'
        const title = document.createElement('div'); title.innerHTML = `<p class="eyebrow"></p><h3>Melyik típust keresi?</h3>`; title.querySelector('.eyebrow').textContent = group.name
        const all = document.createElement('a'); all.href = `/termekek/${group.slug}`; all.textContent = 'Összes alkategória'
        head.append(title, all)
        const choices = document.createElement('div'); choices.className = 'subcategory-choice-grid'; choices.setAttribute('aria-label', 'Alkategóriák')
        children.filter(c => String(c.parent) === selectedGroup).forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c.name; b.addEventListener('click', () => { selectedCategory = String(c.id); offset = 0; choices.querySelectorAll('button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)) }); showProducts(panel, group, c) }); choices.append(b) })
        panel.append(head, choices); grid.after(panel)
        panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
      })
    })

    function showProducts(panel, group, category) {
      panel.querySelector('.selected-products')?.remove()
      const section = document.createElement('div'); section.className = 'selected-products'; section.id = 'home-selected-products'
      const heading = document.createElement('div'); heading.className = 'selected-products-heading'
      const text = document.createElement('div'); text.innerHTML = '<p class="eyebrow">Kiválasztott alkategória</p><h3></h3>'; text.querySelector('h3').textContent = category.name
      const open = document.createElement('a'); open.className = 'text-link'; open.href = `/termekek/${group.slug}/${category.slug}`; open.textContent = 'Alkategória megnyitása'
      heading.append(text, open); section.append(heading)
      const families = data.families.filter(f => String(f.category) === String(category.id)).sort((a,b) => a.sortOrder-b.sortOrder)
      if (category.slug === 'csevelodobos') {
        const cards = document.createElement('div'); cards.className = 'reel-series-grid'; cards.setAttribute('aria-label','Csévélődob termékcsaládok')
        families.forEach((f,i) => { const a=document.createElement('a');a.className='reel-series-card';a.href=`/termekek/${group.slug}/${category.slug}/${f.slug}`;a.innerHTML=`<span class="reel-series-index">${String(i+1).padStart(2,'0')}</span><span class="reel-series-logo"></span><strong></strong><span class="reel-series-count"></span>`;a.querySelector('strong').textContent=f.cardTitle||f.name;a.querySelector('.reel-series-count').textContent=f.cardDescription||f.summary||'';if(f.logo){const img=document.createElement('img');img.src=f.logo;img.alt=`${f.cardTitle||f.name} logó`;img.loading='lazy';img.decoding='async';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';a.querySelector('.reel-series-logo').append(img)}cards.append(a) })
        section.append(cards)
      } else {
        const products = data.products.filter(p => p.categoryIds.includes(String(category.id)))
        if (!products.length) { const empty=document.createElement('div');empty.className='catalog-empty';empty.innerHTML='<p>Ebben az alkategóriában még nincsenek ellenőrzött, közzétett termékek.</p>';section.append(empty) }
        else {
          const show = document.createElement('div'); show.className='catalog-showcase'
          const prev=document.createElement('button');prev.className='slide-arrow';prev.textContent='Előző';prev.setAttribute('aria-label','Előző termékek')
          const track=document.createElement('div');track.className='showcase-track'
          const next=document.createElement('button');next.className='slide-arrow';next.textContent='Következő';next.setAttribute('aria-label','Következő termékek')
          const draw=()=>{track.replaceChildren();for(let i=0;i<Math.min(3,products.length);i++){const p=products[(offset+i)%products.length];const a=document.createElement('a');a.className='showcase-card';a.href=p.href;const media=document.createElement('div');media.className='showcase-image';if(p.image){const img=document.createElement('img');img.src=p.image;img.alt=p.alt||p.name;img.loading='lazy';img.decoding='async';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';media.append(img)}const brand=document.createElement('span');brand.textContent=p.brand||'RM Hajdú Hungary';const h=document.createElement('h3');h.textContent=p.name;a.append(media,brand,h);if(p.summary){const d=document.createElement('p');d.textContent=p.summary;a.append(d)}track.append(a)}}
          prev.addEventListener('click',()=>{offset=(offset+products.length-1)%products.length;draw()});next.addEventListener('click',()=>{offset=(offset+1)%products.length;draw()});draw();show.append(prev,track,next);section.append(show)
        }
      }
      panel.append(section)
      section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})
    }
  }
})()
