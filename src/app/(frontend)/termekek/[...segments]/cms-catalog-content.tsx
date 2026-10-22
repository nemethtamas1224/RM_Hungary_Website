import Image from 'next/image'

type Media = { url?: string; alt?: string; width?: number; height?: number } | number | null
type Section = {
  heading?: string
  body?: string
  image?: Media
  imageAlt?: string
  secondaryImage?: Media
  secondaryImageAlt?: string
}
type Video = { title?: string; url?: string }
type TechnicalTable = { title?: string; rows?: Array<Record<string, string>> } & Record<string, any>

function mediaImage(value: Media): value is Exclude<Media, number | null> {
  return typeof value === 'object' && value !== null && Boolean(value.url)
}

function EditorialImage({ media, alt }: { media: Media; alt?: string }) {
  if (!mediaImage(media)) return null
  return <figure><Image src={media.url!} alt={alt || media.alt || ''} width={Number(media.width) || 700} height={Number(media.height) || 440} sizes="(max-width: 760px) 100vw, 48vw" /></figure>
}

function VideoEmbed({ video }: { video: Video }) {
  if (!video.url) return null
  let embed: string | null = null
  try {
    const parsed = new URL(video.url)
    if (parsed.hostname === 'youtu.be') embed = `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`
    if (parsed.hostname.endsWith('youtube.com')) {
      const id = parsed.pathname === '/watch' ? parsed.searchParams.get('v') : parsed.pathname.split('/').filter(Boolean).at(-1)
      if (id) embed = `https://www.youtube-nocookie.com/embed/${id}`
    }
  } catch { /* Keep invalid URLs out of iframe sources. */ }
  if (!embed) return <a href={video.url} target="_blank" rel="noreferrer">{video.title || 'Videó megtekintése'}</a>
  return <div className="gx-video"><iframe src={embed} title={video.title || 'Termékvideó'} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
}

export function FamilyOverviewContent({ family, showIntro = true }: { family: any; showIntro?: boolean }) {
  const sections = (family.overviewSections || []) as Section[]
  const videos = (family.videos || []) as Video[]
  if (!sections.length && !family.overviewIntro && !videos.length) return null
  return <section className="gx-family-overview">
    <header>{family.overviewTitle && <h2>{family.overviewTitle}</h2>}{showIntro && family.overviewIntro?.split(/\n{2,}/).filter(Boolean).map((text: string, i: number) => <p className={i === 0 ? 'lead' : undefined} key={`${i}-${text.slice(0, 20)}`}>{text}</p>)}</header>
    {sections.length > 0 && <div className="gx-family-sections">{sections.map((section, i) => <article className="gx-family-section" key={section.heading || i}>
      <div className="gx-family-copy"><p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>{section.heading && <h3>{section.heading}</h3>}{section.body?.split(/\n{2,}/).filter(Boolean).map((text, j) => <p key={`${j}-${text.slice(0, 20)}`}>{text}</p>)}</div>
      <EditorialImage media={section.image || null} alt={section.imageAlt} /><EditorialImage media={section.secondaryImage || null} alt={section.secondaryImageAlt} />
    </article>)}</div>}
    {videos.length > 0 && <section className="spec-section"><h2>Videók</h2><div className="gx-videos">{videos.map((video, i) => <VideoEmbed key={`${video.url}-${i}`} video={video} />)}</div></section>}
  </section>
}

export function ProductTechnicalContent({ sections = [], tables = [], videos = [] }: { sections?: Section[]; tables?: TechnicalTable[]; videos?: Video[] }) {
  if (!sections.length && !tables.length && !videos.length) return null
  return <>
    {sections.map((section, i) => <section className="spec-section" key={section.heading || i}>{section.heading && <h2>{section.heading}</h2>}{section.body?.split(/\n{2,}/).filter(Boolean).map((text, j) => <p key={`${j}-${text.slice(0, 20)}`}>{text}</p>)}<EditorialImage media={section.image || null} alt={section.imageAlt} /></section>)}
    {tables.map((table, i) => {
      const columns = [table.column1, table.column2, table.column3, table.column4, table.column5, table.column6].filter((column): column is string => Boolean(column?.trim()))
      if (!columns.length) return null
      return <section className="spec-section" key={table.title || i}><h2>{table.title || 'Műszaki adatok'}</h2><div className="gx-table-scroll"><table><thead><tr>{columns.map((column, j) => <th key={`${column}-${j}`}>{column}</th>)}</tr></thead><tbody>{(table.rows || []).map((row, rowIndex) => <tr key={row.id || rowIndex}>{columns.map((_, columnIndex) => <td key={columnIndex}>{row[`cell${columnIndex + 1}`] || ''}</td>)}</tr>)}</tbody></table></div></section>
    })}
    {videos.length > 0 && <section className="spec-section"><h2>Videók</h2><div className="gx-videos">{videos.map((video, i) => <VideoEmbed key={`${video.url}-${i}`} video={video} />)}</div></section>}
  </>
}
