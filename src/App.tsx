import { useEffect, useRef, useState } from 'react'
import heroPhoto from './assets/sssssaaaa.png'
import './App.css'

function App() {
  const sections = ['home', 'about', 'skills', 'work', 'contact'] as const
  const [active, setActive] = useState<(typeof sections)[number]>('home')
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id')
          if (!id) return
          if (entry.isIntersecting) {
            setActive(id as (typeof sections)[number])
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.6, 1] }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Local styles for the portfolio (keeps to a single-file edit) */}
      <style>{`
        :root {
          /* Palette: deep purple, indigo, steel blue, mint */
          --bg: #4b2d7f;         /* mint */
          --text: #B2D8CE;       /* deep slate for readability */
          --muted: #4f6282;      /* steel-muted */
          --brand: #648DB3;      /* deep purple */
          --brand2: #5458ae;     /* indigo */
          --brand3: #6289ad;     /* steel blue */
          --card: #f4faf8;       /* soft mint surface */
          --ring: rgba(75,45,127,.24);
        }
        html, body, #root { height: auto; min-height: 100%; }
        body { background: var(--bg); color: var(--text); display: block; min-height: 100%; margin: 0; }
        * { box-sizing: border-box; }

        /* Layout */
        .nav {
          position: sticky; top: 0; z-index: 50; background: transparent;
          backdrop-filter: none;
          border-bottom: none;
        }
        .nav-inner { width: 100%; margin: 0; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
        .brand { font-weight: 800; letter-spacing: .3px; color: #ffffff; font-size: 22px; }
        .links { display: flex; gap: 22px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .links::-webkit-scrollbar { display: none; }
        .link { cursor: pointer; color: rgba(255,255,255,.9); font-weight: 700; position: relative; padding: 6px 0; font-size: 18px; }
        .link.active { color: #ffffff; }
        .link.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 3px; background: #ffffff; border-radius: 999px; }

        main { max-width: 1100px; margin: 0 auto; padding: 24px 20px 80px; }
        section { padding: 80px 0; scroll-margin-top: 80px; }
        h2 { font-size: 40px; margin: 0 0 28px; }
        .muted { color: var(--muted); }

        /* Hero with morphing blob */
        .hero { display: grid; grid-template-columns: 1.2fr .9fr; gap: 40px; align-items: center; }
        .title { font-size: clamp(28px, 4vw + 8px, 54px); line-height: 1.05; margin: 0 0 18px; }
        .cta { display: inline-flex; align-items: center; gap: 8px; background: var(--brand); color: #fff; border: 0; padding: 12px 18px; border-radius: 12px; box-shadow: 0 10px 24px -8px var(--ring); }
        .socials { display: flex; gap: 14px; margin-top: 18px; color: var(--muted); width: 100%; justify-content: center; }
        .social-link { color: rgba(255,255,255,.9); display: inline-flex; }
        .social-link:hover { color: #ffffff; }

        .blob {
          width: clamp(180px, 28vw, 340px);
          height: clamp(180px, 28vw, 340px);
          background: var(--brand);
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          position: relative; margin: 0 auto;
          animation: morph 8s ease-in-out infinite;
          overflow: hidden;
          box-shadow: 0 30px 60px -25px var(--ring);
        }
        .blob img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; border-radius: 0; filter: none; }
        @keyframes morph {
          0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }

        /* About */
        .about { display: grid; grid-template-columns: 1fr 1.3fr; gap: 40px; align-items: center; }
        .card { background: var(--card); border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; }

        /* Skills */
        .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .bar { background: #eef2ff; height: 12px; border-radius: 999px; overflow: hidden; }
        .bar > span { display: block; height: 100%; background: linear-gradient(90deg, var(--brand), var(--brand2)); border-radius: 999px; box-shadow: inset 0 0 0 2px rgba(255,255,255,.4); }
        .skill { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 14px; border: 1px solid #e5e7eb; background: #fff; border-radius: 14px; box-shadow: 0 16px 30px -24px rgba(0,0,0,.25); }
        .skill + .skill { margin-top: 14px; }

        /* Work */
        .work-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .work-card { background: #fff; border: 1px solid rgba(0,0,0,.06); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px -28px rgba(0,0,0,.25); }
        .work-card img { width: 100%; height: 180px; object-fit: cover; display: block; }

        /* Contact */
        .contact form { max-width: 560px; margin: 0 auto; display: grid; gap: 14px; }
        .input, .textarea { width: 100%; border: 1px solid #cbd5e1; padding: 12px 14px; border-radius: 10px; font: inherit; }
        .textarea { min-height: 200px; resize: vertical; }
        .btn { background: var(--brand); color: white; border: 0; padding: 12px 18px; border-radius: 12px; cursor: pointer; box-shadow: 0 10px 24px -8px var(--ring); }

        /* Utilities */
        .lead { font-size: 18px; color: var(--muted); }

        /* Responsive */
        @media (max-width: 980px) {
          .nav-inner { padding: 12px 14px; }
          .links { gap: 16px; }
          main { padding: 18px 16px 56px; }
          section { padding: 56px 0; }
          h2 { font-size: 32px; }
          .hero { grid-template-columns: 1fr; text-align: center; }
          .about { grid-template-columns: 1fr; }
          .skills { grid-template-columns: 1fr; }
          .work-grid { grid-template-columns: 1fr 1fr; }
          .work-card img { height: 160px; }
        }
        @media (max-width: 640px) {
          .title { font-size: clamp(24px, 6vw, 36px); }
          .cta { padding: 10px 14px; }
          .work-grid { grid-template-columns: 1fr; }
          .work-card img { height: 150px; }
          main { padding: 16px 14px 48px; }
          section { padding: 48px 0; scroll-margin-top: 72px; }
        }
        @media (max-width: 420px) {
          .links { gap: 12px; }
          .skill { grid-template-columns: 1fr auto; row-gap: 10px; }
          .skill > div:first-child { order: -1; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">James</div>
          <div className="links">
            {sections.map((id) => (
              <span
                key={id}
                className={`link ${active === id ? 'active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {/* Home */}
        <section id="home" ref={(el) => { refs.current['home'] = el }}>
          <div className="hero">
            <div>
              <p className="lead">Hi,</p>
              <h1 className="title">I'm <span style={{ color: '#ffffff' }}>James Daumar</span><br/>Frontend Developer & Graphic Designer</h1>
              <div className="socials">
                <a href="#" aria-label="LinkedIn" className="social-link" target="_blank" rel="noreferrer">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 0H5C3.343 0 2 1.343 2 3v18c0 1.657 1.343 3 3 3h14c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM8.09 20.452H5.337V9h2.753v11.452zM6.713 7.651a1.593 1.593 0 1 1 0-3.186 1.593 1.593 0 0 1 0 3.186zM20.452 20.452h-2.751v-5.573c0-1.329-.027-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.944v5.668H11.96V9h2.64v1.561h.037c.367-.695 1.262-1.429 2.597-1.429 2.778 0 3.292 1.829 3.292 4.205v7.115z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-link" target="_blank" rel="noreferrer">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/>
                  </svg>
                </a>
                <a href="#" aria-label="GitHub" className="social-link" target="_blank" rel="noreferrer">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.262.793-.582 0-.287-.01-1.045-.016-2.052-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.758-1.333-1.758-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.304.76-1.604-2.665-.305-5.466-1.333-5.466-5.93 0-1.31.47-2.382 1.236-3.22-.124-.304-.535-1.526.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.004 2.047.138 3.006.404 2.29-1.553 3.297-1.23 3.297-1.23.653 1.65.242 2.872.119 3.176.77.838 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.476 5.922.43.37.813 1.102.813 2.222 0 1.604-.015 2.896-.015 3.29 0 .322.19.699.8.58C20.565 21.796 24 17.297 24 12 24 5.37 18.627 0 12 0z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="blob">
              <img src={heroPhoto} alt="James Daumar" />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" ref={(el) => { refs.current['about'] = el }}>
          <h2>About</h2>
          <div className="about">
            <div className="card">
              <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=900&auto=format&fit=crop" alt="About" style={{ width: '100%', borderRadius: 12 }} />
            </div>
            <div>
              <h3 style={{ marginTop: 0 }}>I'm James Daumar 👋</h3>
              <p className="lead">I’m a passionate Web Designer, Frontend Developer, Funnel Designer, and Graphic Designer with a focus on creating clean, responsive, and user-friendly designs.</p>
              <p>I specialize in building modern websites and web applications using React, Node.js, Supabase, Tailwind CSS, and strong UI/UX principles. Alongside development, I craft Graphic Designs and strategic Funnel Designs that help brands and businesses grow, converting ideas into impactful digital solutions.</p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" ref={(el) => { refs.current['skills'] = el }}>
          <h2>Skills</h2>
          <div className="skills">
            <div>
              {[
                { name: 'HTML5', pct: 95 },
                { name: 'CSS3', pct: 85 },
                { name: 'JavaScript', pct: 65 },
                { name: 'UX/UI Design', pct: 85 },
                { name: 'Funnel Design', pct: 80 },
                { name: 'Graphic Design', pct: 85 },
                { name: 'React / Node.js / Supabase', pct: 75 },
              ].map((s) => (
                <div key={s.name} className="skill">
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div className="bar"><span style={{ width: s.pct + '%' }} /></div>
                  <div style={{ fontWeight: 700 }}>{s.pct}%</div>
                </div>
              ))}
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop" alt="Laptop" style={{ width: '100%', borderRadius: 12 }} />
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" ref={(el) => { refs.current['work'] = el }}>
          <h2>Work</h2>
          <div className="work-grid">
            {[
              'photo-1454165804606-c3d57bc86b40',
              'photo-1515378791036-0648a3ef77b2',
              'photo-1517433456452-f9633a875f6f',
              'photo-1521737604893-d14cc237f11d',
              'photo-1504384308090-c894fdcc538d',
              'photo-1481277542470-605612bd2d61',
            ].map((id) => (
              <div key={id} className="work-card">
                <img
                  src={`https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`}
                  alt="Work"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" ref={(el) => { refs.current['contact'] = el }} className="contact">
          <h2>Contact</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input className="input" placeholder="Name" />
            <input className="input" placeholder="Email" type="email" />
            <textarea className="textarea" placeholder="Message" />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button className="btn" type="submit">Enviar</button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}

export default App
