(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  document.documentElement.classList.add('motion-ready')

  // Keep the third-party map out of the initial request. Start loading it
  // automatically shortly before it enters the viewport.
  const mapBoxes = [...document.querySelectorAll('.about-map-box[data-map-src]')]
  const loadMap = (box) => {
    const frame = document.createElement('iframe')
    frame.src = box.dataset.mapSrc
    frame.title = 'RM Hajdú Hungary Kft. – Tépe térkép'
    frame.loading = 'lazy'
    frame.referrerPolicy = 'strict-origin-when-cross-origin'
    frame.allowFullscreen = true
    box.replaceChildren(frame)
  }
  if ('IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        loadMap(entry.target)
        mapObserver.unobserve(entry.target)
      })
    }, { rootMargin: '400px 0px' })
    mapBoxes.forEach((box) => mapObserver.observe(box))
  } else {
    mapBoxes.forEach(loadMap)
  }

  // The source HTML contains the gallery markup; static exports do not hydrate
  // the original React client, so wire every gallery up here.
  document.querySelectorAll('.product-slideshow').forEach((gallery) => {
    const main = gallery.querySelector('.product-slideshow-main')
    const image = main?.querySelector('img')
    const thumbs = [...gallery.querySelectorAll('.product-slideshow-thumbs button')]
    const counter = gallery.querySelector('.slideshow-counter')
    const previous = gallery.querySelector('.slideshow-prev')
    const next = gallery.querySelector('.slideshow-next')
    if (!main || !image || !thumbs.length) return

    let current = Math.max(0, thumbs.findIndex((button) => button.classList.contains('active')))
    const originalAlt = image.alt
    const show = (index) => {
      current = (index + thumbs.length) % thumbs.length
      const button = thumbs[current]
      const thumbImage = button.querySelector('img')
      const source = thumbImage?.currentSrc || thumbImage?.src
      if (source) {
        main.classList.add('is-changing')
        window.setTimeout(() => {
          image.src = source
          image.removeAttribute('srcset')
          image.alt = current === 0 ? originalAlt : `${originalAlt} – ${current + 1}. kép`
          requestAnimationFrame(() => main.classList.remove('is-changing'))
        }, reduceMotion ? 0 : 100)
      }
      thumbs.forEach((thumb, i) => {
        const active = i === current
        thumb.classList.toggle('active', active)
        if (active) thumb.setAttribute('aria-current', 'true')
        else thumb.removeAttribute('aria-current')
      })
      if (counter) counter.textContent = `${current + 1} / ${thumbs.length}`
    }

    previous?.addEventListener('click', () => show(current - 1))
    next?.addEventListener('click', () => show(current + 1))
    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)))
    gallery.tabIndex = 0
    gallery.addEventListener('keydown', (event) => {
      if (event.target.closest('button, a, input, textarea, select')) return
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1) }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1) }
    })
    let touchStart = null
    main.addEventListener('touchstart', (event) => {
      const touch = event.changedTouches[0]
      touchStart = [touch.clientX, touch.clientY]
    }, { passive: true })
    main.addEventListener('touchend', (event) => {
      if (!touchStart) return
      const touch = event.changedTouches[0]
      const dx = touch.clientX - touchStart[0]
      const dy = touch.clientY - touchStart[1]
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) show(current + (dx < 0 ? 1 : -1))
      touchStart = null
    }, { passive: true })
    if (thumbs.length < 2) {
      if (previous) previous.hidden = true
      if (next) next.hidden = true
      const thumbRow = gallery.querySelector('.product-slideshow-thumbs')
      if (thumbRow) thumbRow.hidden = true
    } else show(current)
  })

  // Smooth page-to-page transitions without interfering with downloads,
  // external links, new tabs, or browser navigation shortcuts.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]')
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (link.target && link.target !== '_self' || link.hasAttribute('download')) return
    const destination = new URL(link.href, location.href)
    if (destination.origin !== location.origin || destination.pathname === location.pathname || destination.hash && destination.pathname === location.pathname) return
    if (reduceMotion || !document.body.animate) return
    event.preventDefault()
    document.body.classList.add('page-leaving')
    window.setTimeout(() => { location.href = destination.href }, 180)
  })

  const basePath = location.pathname.startsWith('/RM_Hungary_Website/') ? '/RM_Hungary_Website' : ''
  const siteUrl = (value) => { const path = String(value || ''); return path.startsWith('/') && !path.startsWith('//') ? `${basePath}${path}` : path }

  // Keep the Széchenyi grant link available from every page.
  if (!document.querySelector('.floating-grant-link')) {
    const grantLink = document.createElement('a')
    grantLink.className = 'floating-grant-link'
    grantLink.href = siteUrl('/palyazat')
    grantLink.setAttribute('aria-label', 'Széchenyi pályázat – pályázati oldal megnyitása')
    const grantImage = document.createElement('img')
    grantImage.src = siteUrl('/elemek/szechenyi.webp')
    grantImage.alt = 'Széchenyi Terv Plusz pályázat'
    grantImage.width = 300
    grantImage.height = 79
    grantImage.decoding = 'async'
    grantImage.fetchPriority = 'low'
    grantLink.append(grantImage)
    document.body.append(grantLink)
  }

  const familyFilter = new URLSearchParams(location.search).get('families')
  if (familyFilter) {
    const allowedFamilies = new Set(familyFilter.split(',').filter(Boolean))
    document.querySelectorAll('.category-card-grid > a').forEach((card) => {
      const slug = new URL(card.href, location.href).pathname.replace(/\/+$/, '').split('/').pop()
      card.hidden = !allowedFamilies.has(slug)
    })
  }
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
      if (q) location.href = siteUrl(`/kereses?q=${encodeURIComponent(q)}`)
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

  if (document.querySelector('.category-choice-grid, .quote-form')) {
    fetch(siteUrl('/catalog.json')).then((r) => r.ok ? r.json() : null).then((catalog) => {
      if (!catalog) return
      catalogProductNames = Object.fromEntries(catalog.products.map(product => [product.slug, product.name]))
      setupHomeCatalog(catalog)
    }).catch(() => {})
  }

  if (document.querySelector('.search-large')) fetch(siteUrl('/search-index.json')).then((r) => r.ok ? r.json() : []).then((index) => {
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
      const link = document.createElement('a'); link.href = siteUrl(item.href)
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
        const all = document.createElement('a'); all.href = siteUrl(`/termekek/${group.slug}`); all.textContent = 'Összes alkategória'
        head.append(title, all)
        const choices = document.createElement('div'); choices.className = 'subcategory-choice-grid'; choices.setAttribute('aria-label', 'Alkategóriák')
        children.filter(c => String(c.parent) === selectedGroup).forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c.name; b.addEventListener('click', () => { selectedCategory = String(c.id); offset = 0; choices.querySelectorAll('button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)) }); showProducts(panel, group, c) }); choices.append(b) })
        panel.append(head, choices); grid.after(panel)
        // Keep the category chooser in view; the subcategory panel is rendered
        // directly below it without moving the page.
      })
    })

    function showProducts(panel, group, category) {
      panel.querySelector('.selected-products')?.remove()
      const section = document.createElement('div'); section.className = 'selected-products'; section.id = 'home-selected-products'
      const heading = document.createElement('div'); heading.className = 'selected-products-heading'
      const text = document.createElement('div'); text.innerHTML = '<p class="eyebrow">Kiválasztott alkategória</p><h3></h3>'; text.querySelector('h3').textContent = category.name
      const open = document.createElement('a'); open.className = 'text-link'; open.href = siteUrl(`/termekek/${group.slug}/${category.slug}`); open.textContent = 'Alkategória megnyitása'
      heading.append(text, open); section.append(heading)
      const families = data.families.filter(f => String(f.category) === String(category.id)).sort((a,b) => a.sortOrder-b.sortOrder)
      if (category.slug === 'csevelodobos') {
        const cards = document.createElement('div'); cards.className = 'reel-series-grid'; cards.setAttribute('aria-label','Csévélődob termékcsaládok')
        families.forEach((f,i) => { const a=document.createElement('a');a.className='reel-series-card';a.href=siteUrl(`/termekek/${group.slug}/${category.slug}/${f.slug}`);a.innerHTML=`<span class="reel-series-index">${String(i+1).padStart(2,'0')}</span><span class="reel-series-logo"></span><strong></strong><span class="reel-series-count"></span>`;a.querySelector('strong').textContent=f.cardTitle||f.name;a.querySelector('.reel-series-count').textContent=f.cardDescription||f.summary||'';if(f.logo){const img=document.createElement('img');img.src=siteUrl(f.logo);img.alt=`${f.cardTitle||f.name} logó`;img.loading='lazy';img.decoding='async';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';a.querySelector('.reel-series-logo').append(img)}cards.append(a) })
        section.append(cards)
      } else {
        const products = data.products.filter(p => p.categoryIds.includes(String(category.id)))
        if (!products.length) { const empty=document.createElement('div');empty.className='catalog-empty';empty.innerHTML='<p>Ebben az alkategóriában még nincsenek ellenőrzött, közzétett termékek.</p>';section.append(empty) }
        else {
          const show = document.createElement('div'); show.className='catalog-showcase'
          const prev=document.createElement('button');prev.className='slide-arrow';prev.textContent='Előző';prev.setAttribute('aria-label','Előző termékek')
          const track=document.createElement('div');track.className='showcase-track'
          const next=document.createElement('button');next.className='slide-arrow';next.textContent='Következő';next.setAttribute('aria-label','Következő termékek')
          const draw=()=>{track.replaceChildren();for(let i=0;i<Math.min(3,products.length);i++){const p=products[(offset+i)%products.length];const a=document.createElement('a');a.className='showcase-card';a.href=siteUrl(p.href);const media=document.createElement('div');media.className='showcase-image';if(p.image){const img=document.createElement('img');img.src=siteUrl(p.image);img.alt=p.alt||p.name;img.loading='lazy';img.decoding='async';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';media.append(img)}const brand=document.createElement('span');brand.textContent=p.brand||'RM Hajdú Hungary';const h=document.createElement('h3');h.textContent=p.name;a.append(media,brand,h);if(p.summary){const d=document.createElement('p');d.textContent=p.summary;a.append(d)}track.append(a)}}
          prev.addEventListener('click',()=>{offset=(offset+products.length-1)%products.length;draw()});next.addEventListener('click',()=>{offset=(offset+1)%products.length;draw()});draw();show.append(prev,track,next);section.append(show)
        }
      }
      panel.append(section)
      // Product results stay inline with the category chooser instead of
      // forcing the visitor down the page.
    }
  }
})()
