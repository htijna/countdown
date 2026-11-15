import { useEffect, useState } from 'react'
import './App.css'

const releaseDate = new Date(2026, 10, 19)
const newsRefreshInterval = 60 * 60 * 1000
const newsCacheKey = 'leonida-watch-press-news-v1'
const pressFeedUrl = 'https://news.google.com/rss/search?q=%28GTA+6+OR+GTA+VI+OR+%22Grand+Theft+Auto+VI%22%29&hl=en-US&gl=US&ceid=US:en'

const news = [
  {
    date: 'November 10, 2026',
    category: 'Launch preparation',
    title: 'GTA 6 pre-load is available now',
    summary: 'Rockstar says players who pre-ordered digitally can begin downloading the game ahead of launch. Check your platform store for availability and storage requirements.',
    href: 'https://www.rockstargames.com/newswire/article/89834o94713o21/pre-load-grand-theft-auto-vi-now',
    source: 'Rockstar Newswire',
  },
  {
    date: 'November 9, 2026',
    category: 'Community',
    title: 'Rockstar announces GTA VI: The Festival',
    summary: 'The launch celebration is scheduled for November 21 at Mana Wynwood in Miami. The official event page has the latest ticket and venue information.',
    href: 'https://www.rockstargames.com/newswire/article/o39o87a435a25a/grand-theft-auto-vi-the-festival',
    source: 'Rockstar Newswire',
  },
  {
    date: 'November 5, 2026',
    category: 'Screenshots',
    title: 'The GTA VI launch gallery is live',
    summary: 'Rockstar published a new collection of official screenshots. Use the source gallery for the original images and captions.',
    href: 'https://www.rockstargames.com/newswire/article/39ak81277255o9/explore-the-grand-theft-auto-vi-launch-gallery',
    source: 'Rockstar Newswire',
  },
]

const articles = [
  {
    number: '01',
    tag: 'PLAYER GUIDE',
    title: 'GTA 6 launch checklist: get your console ready',
    intro: 'A practical, spoiler-free checklist for players preparing to start in Leonida.',
    points: [
      'Confirm that your console has enough free storage, then check the platform store for the current install size.',
      'If you pre-ordered digitally, check your console’s download settings. Rockstar announced pre-load availability on November 10.',
      'Install system updates, test your controller and headset, and make sure your account can sign in before launch day.',
      'Avoid unofficial “early access” downloads and links. Use your console store and Rockstar’s official site for updates.',
    ],
  },
  {
    number: '02',
    tag: 'CREATOR PLAYBOOK',
    title: 'A spoiler-safe GTA 6 content plan for creators',
    intro: 'Help viewers follow the launch without spoiling the story or repeating unverified claims.',
    points: [
      'Label videos clearly as spoiler-free or spoiler discussion, and put story spoilers after a warning and timestamp.',
      'Separate confirmed details from your predictions. Link to the original Rockstar announcement whenever you report a fact.',
      'Prepare useful formats before launch: settings guides, accessibility notes, first-hour impressions, and platform comparisons.',
      'Use your own captured gameplay only when permitted by the game’s terms and platform rules; do not present leaks as official footage.',
    ],
  },
  {
    number: '03',
    tag: 'FACT CHECK',
    title: 'What Rockstar has confirmed about GTA VI',
    intro: 'A quick reference for conversations, streams, and posts about the game.',
    points: [
      'The announced release date is November 19, 2026.',
      'Rockstar lists PlayStation 5 and Xbox Series X|S as launch platforms on the official game page.',
      'The story follows Jason and Lucia in the state of Leonida, including Vice City.',
      'A PC release date has not been announced on Rockstar’s official GTA VI page. Treat dates circulating elsewhere as unconfirmed.',
    ],
  },
]

const videos = [
  { title: 'Grand Theft Auto VI Launch Trailer', date: 'October 15, 2026', id: 'rz1B4B2yBZY', label: 'LATEST OFFICIAL TRAILER' },
  { title: 'Grand Theft Auto VI: An Extended Look', date: 'August 27, 2026', id: 'tJbzMqJGH4k', label: 'OFFICIAL GAMEPLAY LOOK' },
  { title: 'Grand Theft Auto VI Trailer 2', date: 'May 6, 2025', id: 'VQRLujxTm3c', label: 'OFFICIAL TRAILER' },
]

function getTimeLeft() {
  const distance = releaseDate.getTime() - Date.now()
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  }
}

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [pressNews, setPressNews] = useState([])
  const [newsUpdatedAt, setNewsUpdatedAt] = useState(null)
  const [newsStatus, setNewsStatus] = useState('loading')
  const pad = (number) => String(number).padStart(2, '0')

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true
    let lastRefresh = 0

    const refreshNews = async () => {
      if (!active) return
      setNewsStatus('loading')
      try {
        const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(pressFeedUrl)}`
        const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
        if (!response.ok) throw new Error(`News feed returned ${response.status}`)
        const payload = await response.json()
        if (payload.status !== 'ok' || !Array.isArray(payload.items)) throw new Error('News feed response was invalid')

        const items = payload.items.flatMap((item) => {
          const title = String(item.title || '').trim()
          let link
          try { link = new URL(item.link).href } catch { return [] }
          if (!/^https:$/.test(new URL(link).protocol) || !/\b(?:gta\s*(?:6|vi)|grand theft auto\s*vi)\b/i.test(title)) return []

          const descriptionDocument = new DOMParser().parseFromString(String(item.description || ''), 'text/html')
          const summary = descriptionDocument.body.textContent.replace(/\s+/g, ' ').trim().slice(0, 220)
          const imageCandidate = typeof item.thumbnail === 'string' ? item.thumbnail : item.enclosure?.link || descriptionDocument.querySelector('img')?.src
          let image = ''
          try {
            const parsedImage = new URL(imageCandidate)
            if (parsedImage.protocol === 'https:') image = parsedImage.href
          } catch { /* Articles without a usable thumbnail render without one. */ }
          const published = new Date(item.pubDate)
          return [{
            title,
            link,
            image,
            summary: summary || 'Read the latest GTA VI coverage from this publisher.',
            date: Number.isNaN(published.getTime()) ? '' : published.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          }]
        })

        if (active) {
          const updatedAt = Date.now()
          lastRefresh = updatedAt
          setPressNews(items.slice(0, 3))
          setNewsUpdatedAt(updatedAt)
          setNewsStatus('ready')
          try { localStorage.setItem(newsCacheKey, JSON.stringify({ updatedAt, items: items.slice(0, 3) })) } catch { /* Storage may be unavailable. */ }
        }
      } catch {
        if (active) setNewsStatus((current) => current === 'ready' ? 'ready' : 'unavailable')
      }
    }

    try {
      const cached = JSON.parse(localStorage.getItem(newsCacheKey) || 'null')
      if (cached?.updatedAt && Array.isArray(cached.items)) {
        setPressNews(cached.items)
        setNewsUpdatedAt(cached.updatedAt)
        lastRefresh = cached.updatedAt
        setNewsStatus('ready')
      }
    } catch { /* Ignore an empty or unavailable browser cache. */ }

    refreshNews()
    const hourlyTimer = window.setInterval(() => refreshNews(), newsRefreshInterval)
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastRefresh >= newsRefreshInterval) refreshNews()
    }
    document.addEventListener('visibilitychange', refreshWhenVisible)
    window.addEventListener('focus', refreshWhenVisible)

    return () => {
      active = false
      window.clearInterval(hourlyTimer)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      window.removeEventListener('focus', refreshWhenVisible)
    }
  }, [])

  return (
    <div className="app-container">
      <div className="overlay" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="GTA VI Countdown home"><span aria-hidden="true">★</span><span className="brand-name">LEONIDA WATCH</span></a>
        <button className="menu-toggle" type="button" aria-expanded={mobileNavOpen} aria-controls="primary-navigation" onClick={() => setMobileNavOpen((open) => !open)}>
          <span className="menu-icon" aria-hidden="true"><i /><i /></span>{mobileNavOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="primary-navigation" className={mobileNavOpen ? 'is-open' : ''} aria-label="Main navigation">
          <a href="#news" onClick={() => setMobileNavOpen(false)}>News</a>
          <a href="#guides" onClick={() => setMobileNavOpen(false)}>Guides</a>
          <a href="#videos" onClick={() => setMobileNavOpen(false)}>Videos & live</a>
          <a className="nav-official" href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Rockstar site <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="page-title">
          <div className="hero-content">
            <p className="eyebrow">THE ROAD TO LEONIDA</p>
            <h1 id="page-title">GTA 6 Countdown</h1>
            <h2 className="main-title">Grand Theft Auto VI arrives November 19, 2026</h2>
            <p className="hero-copy">Your independent fan-made countdown, verified GTA VI updates, and useful guides for players and creators.</p>
            <div className="countdown-wrapper" role="timer" aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until November 19, 2026`}>
              {[
                ['Days', timeLeft.days], ['Hours', timeLeft.hours], ['Minutes', timeLeft.minutes], ['Seconds', timeLeft.seconds],
              ].map(([label, value], index) => (
                <div className="time-group" key={label}>
                  {index > 0 && <span className="time-divider" aria-hidden="true">:</span>}
                  <div className="time-block"><span className="number">{pad(value)}</span><span className="label">{label}</span></div>
                </div>
              ))}
            </div>
            <p className="date-note">Countdown uses local time; Rockstar has announced the release date, not a universal launch hour.</p>
            <a className="btn btn-primary" href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Visit Rockstar’s GTA VI page ↗</a>
          </div>
          <a className="scroll-cue" href="#news">SCROLL TO THE LATEST <span aria-hidden="true">↓</span></a>
        </section>

        <section className="content-section news-section" id="news" aria-labelledby="news-title">
          <div className="section-heading">
            <div><p className="eyebrow">THE VICE CITY WIRE</p><h2 id="news-title">Trending GTA 6 news</h2></div>
            <p>Recent official announcements, with links to the original source. Updated November 15, 2026.</p>
          </div>
          <div className="news-grid">
            {news.map((item, index) => (
              <article className={`news-card ${index === 0 ? 'featured-news' : ''}`} key={item.title}>
                {item.image && <img className="news-image" src={item.image} alt={`${item.title} thumbnail`} loading="lazy" onError={(event) => { event.currentTarget.hidden = true }} />}
                <div className="card-meta"><span>{item.category}</span><time>{item.date}</time></div>
                <h3>{item.title}</h3><p>{item.summary}</p>
                <a href={item.href} target="_blank" rel="noreferrer">Read at {item.source} <span aria-hidden="true">↗</span></a>
              </article>
            ))}
            {pressNews.map((item) => (
              <article className="news-card press-news" key={item.link}>
                {item.image && <img className="news-image" src={item.image} alt={`${item.title} thumbnail`} loading="lazy" onError={(event) => { event.currentTarget.hidden = true }} />}
                <div className="card-meta"><span>Gaming press</span><time>{item.date || 'Recent'}</time></div>
                <h3>{item.title}</h3><p>{item.summary}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">Read the full story <span aria-hidden="true">↗</span></a>
              </article>
            ))}
          </div>
          <p className="feed-status" aria-live="polite">
            {newsStatus === 'loading' && !pressNews.length && 'Loading the latest gaming press coverage…'}
            {newsStatus === 'unavailable' && 'Live headlines are temporarily unavailable. Official stories above remain available.'}
            {newsUpdatedAt && <>Press headlines last refreshed {new Date(newsUpdatedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}. Refreshes automatically every hour while this page is open.</>}
          </p>
          <p className="editorial-note">Independent fan coverage. Rockstar Games is the source for confirmed release information; rumors and predictions are not presented as fact.</p>
        </section>

        <section className="content-section guides-section" id="guides" aria-labelledby="guides-title">
          <div className="section-heading">
            <div><p className="eyebrow">PLAY SMART. CREATE BETTER.</p><h2 id="guides-title">GTA 6 guides & articles</h2></div>
            <p>Original, practical reads for the people playing, streaming, and making videos about GTA VI.</p>
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <article className="article-card" key={article.number}>
                <div className="article-topline"><span>{article.tag}</span><span>{article.number}</span></div>
                <h3>{article.title}</h3><p className="article-intro">{article.intro}</p>
                <ul>{article.points.map((point) => <li key={point}>{point}</li>)}</ul>
                {article.number === '03' && <a className="source-link" href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Check Rockstar’s official game page ↗</a>}
              </article>
            ))}
          </div>
        </section>

        <section className="content-section video-section" id="videos" aria-labelledby="videos-title">
          <div className="section-heading">
            <div><p className="eyebrow">WATCH THE OFFICIALS</p><h2 id="videos-title">Trending GTA 6 videos</h2></div>
            <p>Rockstar’s latest trailers and gameplay look, embedded here so players and creators can catch up.</p>
          </div>
          <div className="video-grid">
            {videos.map((video) => (
              <article className="video-card" key={video.id}>
                <div className="video-frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="video-info"><span>{video.label} · {video.date}</span><h3>{video.title}</h3><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div>
              </article>
            ))}
          </div>
          <div className="live-panel">
            <div className="live-indicator"><span aria-hidden="true" /> LIVE SEARCH</div>
            <div className="live-copy"><h3>Find GTA 6 streams live right now</h3><p>Browse YouTube’s live-filtered results for current streams. Live listings change constantly, so the link opens the latest results on YouTube.</p></div>
            <a className="btn btn-primary" href="https://www.youtube.com/results?search_query=GTA+6&sp=EgJAAQ%3D%3D" target="_blank" rel="noopener noreferrer">Browse live streams ↗</a>
          </div>
          <p className="editorial-note">Videos are hosted by YouTube and belong to Rockstar Games. Live listings are provided by YouTube and may vary by region.</p>
        </section>

        <section className="fact-strip" aria-label="GTA VI confirmed release details">
          <div><span className="fact-label">RELEASE DATE</span><strong>November 19, 2026</strong></div>
          <div><span className="fact-label">LAUNCH PLATFORMS</span><strong>PlayStation 5 · Xbox Series X|S</strong></div>
          <div><span className="fact-label">SETTING</span><strong>Leonida · Vice City</strong></div>
          <a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">All details at Rockstar ↗</a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#home"><span aria-hidden="true">★</span> LEONIDA WATCH</a>
        <p>Independent fan site. Not affiliated with Rockstar Games or Take-Two Interactive.</p>
        <a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Official GTA VI website ↗</a>
      </footer>
    </div>
  )
}

export default App
