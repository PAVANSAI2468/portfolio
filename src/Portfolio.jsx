import { useEffect, useRef, useState } from 'react'
import {
  Mail, Phone, MapPin, Menu, X, Moon, Sun, ArrowRight, ArrowUpRight,
  Code2, Server, Database, Cloud, Wrench, Briefcase, GraduationCap,
  Ship, Calendar, FileText, Send, CheckCircle2, AlertCircle, Loader2, ChevronDown,
} from 'lucide-react'
import profile from './profile.jpg'
import './Portfolio.css'

const EMAIL = 'pavansarapu85@gmail.com'
const PHONE = '+91 9390337575'
// Free key from https://web3forms.com (sent to your inbox). Put it in portfolio/.env
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const NAV = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact']

const ROLES = ['Full Stack Developer', 'React.js Developer', 'Node.js Developer']

const STATS = [
  { value: '1y 10m', label: 'Professional experience' },
  { value: '3', label: 'Freight modes: sea, air, road' },
  { value: '4+', label: 'Third-party API integrations' },
]

const QUICK_INFO = [
  { icon: MapPin, label: 'Location', value: 'Hyderabad, India' },
  { icon: Briefcase, label: 'Current role', value: 'Full Stack Developer @ VoltusWave' },
  { icon: GraduationCap, label: 'Education', value: 'MCA, 2024 · CGPA 8.0' },
  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
]

const SKILLS = [
  { icon: Code2, title: 'Frontend', items: ['React.js', 'Redux Toolkit', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'shadcn/ui'] },
  { icon: Server, title: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication'] },
  { icon: Database, title: 'Database', items: ['MySQL', 'SQL', 'Data Modeling', 'Database Design'] },
  { icon: Cloud, title: 'Cloud & APIs', items: ['AWS', 'AWS Lambda', 'Google Cloud Platform', 'Google Drive API', 'Google Calendar API', 'Outlook Calendar API'] },
  { icon: Wrench, title: 'Tools', items: ['Git', 'GitHub', 'Jira', 'Postman', 'Agile', 'LLM Integrations'] },
]

const EXPERIENCE = [
  {
    company: 'VoltusWave Technologies India Pvt Ltd',
    role: 'Full Stack Software Developer',
    period: 'Dec 2024 – Oct 2026',
    location: 'Hyderabad, India',
    points: [
      'Worked across core Freight ERP modules, with substantial involvement in Freight and Accounting functionality.',
      'Developed and maintained freight enquiry workflows for sea, air and road transportation, supporting operational processing.',
      'Worked on CRM and business workflows covering customers, suppliers, carriers, sales and freight operations.',
      'Implemented frontend functionality using React.js and Redux Toolkit, and developed backend services and REST APIs using Node.js and Express.js.',
      'Worked on Accounting module features, including configuration and soft-delete functionality across frontend and backend workflows.',
      'Integrated Google Calendar and Outlook Calendar APIs into the Sales application to support calendar-based scheduling.',
      'Worked on AI-assisted email extraction to capture relevant information from incoming business emails and reduce manual data entry.',
      'Built dynamic PDF template-generation functionality, inserting application data into predefined templates and integrating with the Google Drive API.',
      'Worked with MySQL for application data storage, querying and backend workflows; supported deployment and cloud-based application operations.',
    ],
    stack: ['React.js', 'Redux Toolkit', 'Node.js', 'Express.js', 'MySQL', 'AWS', 'Google Cloud'],
  },
]

const PROJECTS = [
  {
    icon: Ship,
    title: 'Freight ERP & Accounting Platform',
    desc: 'Enterprise freight management system supporting sea, air and road enquiries, customer CRM, suppliers, carriers, freight operations and accounting workflows. Contributed across modules, with a stronger focus on Freight and Accounting.',
    tags: ['React.js', 'Redux Toolkit', 'Node.js', 'Express.js', 'MySQL'],
  },
  {
    icon: Calendar,
    title: 'AI Email Extraction & Sales Calendar',
    desc: 'AI-assisted extraction of business information from emails, plus Google Calendar and Outlook Calendar API integration in the Sales application for scheduling workflows.',
    tags: ['LLM Integrations', 'Google Calendar API', 'Outlook Calendar API'],
  },
  {
    icon: FileText,
    title: 'Dynamic PDF Template Engine',
    desc: 'A template engine that dynamically inserts application data into PDF templates, with Google Drive API integration.',
    tags: ['Node.js', 'Google Drive API', 'PDF Generation'],
  },
]

const EDUCATION = [
  { degree: 'Master of Computer Applications (MCA)', school: 'University Post Graduate College, Secunderabad', year: '2024', note: 'CGPA: 8.0 / 10' },
  { degree: 'Bachelor of Science in Computer Science (B.Sc.)', school: '', year: '2022', note: '' },
]

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('pf-theme')
    if (saved) return saved
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Cycles through ROLES with a typing effect
function useTypewriter(words, speed = 70, pause = 1600) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    const done = !deleting && text === word
    const cleared = deleting && text === ''
    const delay = done ? pause : deleting ? speed / 2 : speed

    const t = setTimeout(() => {
      if (done) setDeleting(true)
      else if (cleared) { setDeleting(false); setIndex((i) => i + 1) }
      else setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words, speed, pause])

  return text
}

// Adds .is-visible to .pf-reveal elements as they scroll into view
function useReveal(rootRef) {
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('.pf-reveal') ?? []
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rootRef])
}

// Tracks which section is on screen to highlight the nav link
function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }

function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState({ state: 'idle', msg: '' })

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!WEB3FORMS_KEY) {
      setStatus({ state: 'error', msg: 'Mail service is not configured yet. Please email me directly.' })
      return
    }
    // Honeypot: bots fill hidden fields, humans don't
    if (e.target.botcheck.checked) return

    setStatus({ state: 'loading', msg: '' })
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          from_name: 'Portfolio Contact Form',
          subject: form.subject || `New message from ${form.name}`,
          name: form.name,
          email: form.email,
          replyto: form.email,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Something went wrong')
      setForm(EMPTY_FORM)
      setStatus({ state: 'success', msg: "Thanks! Your message has been sent. I'll get back to you soon." })
    } catch (err) {
      setStatus({ state: 'error', msg: err.message || 'Could not send message. Please try again.' })
    }
  }

  const loading = status.state === 'loading'

  return (
    <form className="pf-card pf-form" onSubmit={onSubmit}>
      <div className="pf-form-row">
        <label className="pf-field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={onChange} required placeholder="Your name" autoComplete="name" />
        </label>
        <label className="pf-field">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="you@example.com" autoComplete="email" />
        </label>
      </div>
      <label className="pf-field">
        <span>Subject <em>(optional)</em></span>
        <input name="subject" value={form.subject} onChange={onChange} placeholder="Job opportunity, project, etc." />
      </label>
      <label className="pf-field">
        <span>Message</span>
        <textarea name="message" value={form.message} onChange={onChange} required rows={5} minLength={10} placeholder="Tell me a bit about what you have in mind..." />
      </label>
      <input type="checkbox" name="botcheck" className="pf-hp" tabIndex={-1} autoComplete="off" />

      <button type="submit" className="pf-btn pf-btn-primary pf-form-submit" disabled={loading}>
        {loading ? <><Loader2 size={16} className="pf-spin" /> Sending...</> : <>Send message <Send size={16} /></>}
      </button>

      {status.state === 'success' && (
        <p className="pf-alert pf-alert-ok" role="status"><CheckCircle2 size={18} /> {status.msg}</p>
      )}
      {status.state === 'error' && (
        <p className="pf-alert pf-alert-err" role="alert"><AlertCircle size={18} /> {status.msg}</p>
      )}
    </form>
  )
}

function Section({ id, eyebrow, title, subtitle, children, alt }) {
  return (
    <section id={id.toLowerCase()} className={`pf-section ${alt ? 'pf-section-alt' : ''}`}>
      <div className="pf-container">
        <header className="pf-section-head pf-reveal">
          <p className="pf-eyebrow">{eyebrow}</p>
          <h2 className="pf-h2">{title}</h2>
          {subtitle && <p className="pf-subtitle">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}

const SECTION_IDS = NAV.map((n) => n.toLowerCase())

export default function Portfolio() {
  const rootRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const role = useTypewriter(ROLES)
  const active = useActiveSection(SECTION_IDS)
  useReveal(rootRef)

  useEffect(() => {
    try { localStorage.setItem('pf-theme', theme) } catch { /* ignore */ }
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="pf" data-theme={theme} ref={rootRef}>
      <header className={`pf-nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="pf-container pf-nav-inner">
          <a href="#top" className="pf-logo" onClick={() => setMenuOpen(false)}>
            <span className="pf-logo-mark">PS</span>
            <span className="pf-logo-text">Pavan Sai</span>
          </a>

          <nav className={`pf-links ${menuOpen ? 'is-open' : ''}`}>
            {NAV.map((n) => {
              const id = n.toLowerCase()
              return (
                <a key={n} href={`#${id}`} className={active === id ? 'is-active' : ''} onClick={() => setMenuOpen(false)}>
                  {n}
                </a>
              )
            })}
            <a href="#contact" className="pf-btn pf-btn-primary pf-nav-cta" onClick={() => setMenuOpen(false)}>
              Hire me
            </a>
          </nav>

          <div className="pf-nav-actions">
            <button
              className="pf-icon-btn"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="pf-icon-btn pf-menu-btn"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="pf-hero">
          <div className="pf-hero-bg" aria-hidden="true">
            <span className="pf-blob pf-blob-1" />
            <span className="pf-blob pf-blob-2" />
            <span className="pf-grid-bg" />
          </div>

          <div className="pf-container pf-hero-grid">
            <div className="pf-hero-text">
              <span className="pf-badge pf-fade" style={{ '--d': '0ms' }}><span className="pf-dot" /> Available for new opportunities</span>
              <p className="pf-hello pf-fade" style={{ '--d': '80ms' }}>Hello, I'm</p>
              <h1 className="pf-h1 pf-fade" style={{ '--d': '160ms' }}>
                Pavan Sai <span className="pf-gradient-text">Sarapu</span>
              </h1>
              <p className="pf-role pf-fade" style={{ '--d': '240ms' }}>
                <span className="pf-role-text">{role}</span><span className="pf-caret" />
              </p>
              <p className="pf-lead pf-fade" style={{ '--d': '320ms' }}>
                I build freight management and CRM applications end to end, from clean React.js
                interfaces to Node.js / Express.js REST APIs backed by MySQL.
              </p>
              <div className="pf-cta pf-fade" style={{ '--d': '400ms' }}>
                <a href="#contact" className="pf-btn pf-btn-primary">Get in touch <ArrowRight size={16} /></a>
                <a href="#projects" className="pf-btn pf-btn-ghost">View my work</a>
              </div>
              <div className="pf-meta pf-fade" style={{ '--d': '480ms' }}>
                <a href={`mailto:${EMAIL}`} aria-label="Email"><Mail size={16} /> {EMAIL}</a>
                <span><MapPin size={16} /> Hyderabad, India</span>
              </div>
            </div>

            <div className="pf-hero-visual pf-fade" style={{ '--d': '200ms' }}>
              <div className="pf-avatar">
                <span className="pf-avatar-ring" aria-hidden="true" />
                <img src={profile} alt="Pavan Sai Sarapu" />
              </div>
              <span className="pf-float pf-float-1"><Code2 size={14} /> React.js</span>
              <span className="pf-float pf-float-2"><Server size={14} /> Node.js</span>
              <span className="pf-float pf-float-3"><Database size={14} /> MySQL</span>
            </div>
          </div>

          <div className="pf-container">
            <div className="pf-stats pf-fade" style={{ '--d': '560ms' }}>
              {STATS.map((s) => (
                <div key={s.label} className="pf-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <a href="#about" className="pf-scroll" aria-label="Scroll to About"><ChevronDown size={20} /></a>
        </section>

        <Section id="About" eyebrow="About me" title="Developer focused on real business workflows"
          subtitle="Freight, CRM and accounting systems, from database to UI.">
          <div className="pf-about">
            <div className="pf-about-text pf-reveal">
              <p>
                I'm a <strong>Full Stack Software Developer</strong> with 1 year 10 months of experience building and
                supporting freight management and CRM applications. I've worked hands-on across freight enquiries for
                sea, air and road operations, customer and supplier workflows, operations, and accounting.
              </p>
              <p>
                I develop frontend features and backend REST APIs using <strong>React.js, Node.js, Express.js and MySQL</strong>,
                with integrations involving AWS, Google Cloud APIs, Google Calendar and Outlook Calendar. I've also
                worked on AI-assisted email data extraction and dynamic PDF template generation.
              </p>
              <a href="#contact" className="pf-link">Let's talk <ArrowUpRight size={16} /></a>
            </div>
            <div className="pf-card pf-info pf-reveal">
              {QUICK_INFO.map(({ icon: Icon, label, value, href }) => {
                const Tag = href ? 'a' : 'div'
                return (
                  <Tag key={label} className="pf-info-row" {...(href ? { href } : {})}>
                    <span className="pf-card-icon"><Icon size={18} /></span>
                    <div><small>{label}</small><span>{value}</span></div>
                  </Tag>
                )
              })}
            </div>
          </div>
        </Section>

        <Section id="Skills" eyebrow="Skills" title="Technical toolkit"
          subtitle="Technologies I use day to day to ship features across the stack." alt>
          <div className="pf-skills">
            {SKILLS.map(({ icon: Icon, title, items }, i) => (
              <div key={title} className="pf-card pf-skill pf-reveal" style={{ '--d': `${i * 70}ms` }}>
                <div className="pf-card-head">
                  <span className="pf-card-icon"><Icon size={18} /></span>
                  <h3>{title}</h3>
                </div>
                <div className="pf-chips">
                  {items.map((it) => <span key={it} className="pf-chip">{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="Experience" eyebrow="Experience" title="Where I've worked">
          <div className="pf-timeline">
            {EXPERIENCE.map((e) => (
              <article key={e.company} className="pf-tl-item pf-reveal">
                <span className="pf-tl-dot" />
                <div className="pf-card">
                  <div className="pf-exp-head">
                    <div>
                      <h3>{e.role}</h3>
                      <p className="pf-company">{e.company}</p>
                      <p className="pf-muted pf-small"><MapPin size={14} /> {e.location}</p>
                    </div>
                    <span className="pf-period">{e.period}</span>
                  </div>
                  <ul className="pf-list">
                    {e.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <div className="pf-chips pf-exp-stack">
                    {e.stack.map((s) => <span key={s} className="pf-chip pf-chip-sm">{s}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="Projects" eyebrow="Projects" title="Things I've built"
          subtitle="Highlights from production work at VoltusWave." alt>
          <div className="pf-projects">
            {PROJECTS.map(({ icon: Icon, title, desc, tags }, i) => (
              <article key={title} className="pf-card pf-project pf-reveal" style={{ '--d': `${i * 90}ms` }}>
                <div className="pf-project-top">
                  <span className="pf-card-icon pf-card-icon-lg"><Icon size={22} /></span>
                  <span className="pf-project-num">0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p className="pf-muted">{desc}</p>
                <div className="pf-chips">
                  {tags.map((t) => <span key={t} className="pf-chip pf-chip-sm">{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="Education" eyebrow="Education" title="Academic background">
          <div className="pf-edu">
            {EDUCATION.map((ed, i) => (
              <div key={ed.degree} className="pf-card pf-edu-item pf-reveal" style={{ '--d': `${i * 90}ms` }}>
                <span className="pf-card-icon pf-card-icon-lg"><GraduationCap size={22} /></span>
                <div>
                  <span className="pf-edu-year">{ed.year}</span>
                  <h3>{ed.degree}</h3>
                  {ed.school && <p className="pf-muted">{ed.school}</p>}
                  {ed.note && <p className="pf-edu-note">{ed.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="Contact" eyebrow="Contact" title="Let's work together"
          subtitle="Open to full stack and frontend roles. Drop a message and I'll get back to you." alt>
          <div className="pf-contact">
            <div className="pf-contact-info pf-reveal">
              <a className="pf-card pf-contact-item" href={`mailto:${EMAIL}`}>
                <span className="pf-card-icon"><Mail size={18} /></span>
                <div><small>Email</small><span>{EMAIL}</span></div>
              </a>
              <a className="pf-card pf-contact-item" href={`tel:${PHONE.replace(/\s/g, '')}`}>
                <span className="pf-card-icon"><Phone size={18} /></span>
                <div><small>Phone</small><span>{PHONE}</span></div>
              </a>
              <div className="pf-card pf-contact-item">
                <span className="pf-card-icon"><MapPin size={18} /></span>
                <div><small>Location</small><span>Hyderabad, India</span></div>
              </div>
            </div>
            <div className="pf-reveal" style={{ '--d': '100ms' }}>
              <ContactForm />
            </div>
          </div>
        </Section>
      </main>

      <footer className="pf-footer">
        <div className="pf-container pf-footer-inner">
          <a href="#top" className="pf-logo">
            <span className="pf-logo-mark">PS</span>
            <span>Pavan Sai Sarapu</span>
          </a>
          <p>© {new Date().getFullYear()} Pavan Sai Sarapu · Built with React</p>
        </div>
      </footer>
    </div>
  )
}
