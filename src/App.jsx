import { useEffect, useState } from 'react'
import './App.css'

const releaseDate = new Date(2026, 10, 19)

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
  {
    date: 'October 15, 2026',
    category: 'Trailer',
    title: 'The launch trailer is now playing',
    summary: 'The official trailer introduces more of Jason and Lucia’s story and features new music by Justice. Watch it on Rockstar’s GTA VI site.',
    href: 'https://www.rockstargames.com/newswire/article/517572321a549a/watch-the-grand-theft-auto-vi-launch-trailer',
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
  const pad = (number) => String(number).padStart(2, '0')

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="app-container">
      <div className="overlay" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="GTA VI Countdown home"><span aria-hidden="true">★</span> LEONIDA WATCH</a>
        <nav aria-label="Main navigation">
          <a href="#news">Latest news</a>
          <a href="#guides">Player & creator guides</a>
          <a href="https://www.rockstargames.com/VI" target="_blank" rel="noreferrer">Official GTA VI site ↗</a>
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
                <div className="card-meta"><span>{item.category}</span><time>{item.date}</time></div>
                <h3>{item.title}</h3><p>{item.summary}</p>
                <a href={item.href} target="_blank" rel="noreferrer">Read at {item.source} <span aria-hidden="true">↗</span></a>
              </article>
            ))}
          </div>
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
