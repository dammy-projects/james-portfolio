import { useEffect, useRef, useState } from 'react'
import heroPhoto from './assets/sssssaaaa.png'
import myImage from './assets/my-image.jpg'
import './App.css'

function App() {
  const sections = ['home', 'about', 'skills', 'work', 'contact'] as const
  const [active, setActive] = useState<(typeof sections)[number]>('home')
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const [aboutVisible, setAboutVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id')
          if (!id) return
          if (entry.isIntersecting) {
            setActive(id as (typeof sections)[number])
            // Trigger about section animation
            if (id === 'about') {
              setAboutVisible(true)
            }
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

        /* Mobile menu toggle */
        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
          gap: 4px;
        }
        .mobile-menu-toggle span {
          width: 25px;
          height: 3px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-menu-toggle.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }
        .mobile-menu-toggle.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        main { max-width: 1100px; margin: 0 auto; padding: 24px 20px 80px; }
        section { padding: 80px 0; scroll-margin-top: 80px; }
        h2 { font-size: 40px; margin: 0 0 28px; }
        .muted { color: var(--muted); }

        /* Hero with morphing blob */
        .hero { display: grid; grid-template-columns: 1.2fr .9fr; gap: 40px; align-items: center; }
        .title { font-size: clamp(28px, 4vw + 8px, 54px); line-height: 1.05; margin: 0 0 18px; }

        /* Introduction text animations */
        .intro-text {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease-out 0.2s forwards;
        }

        .name-highlight {
          background: linear-gradient(45deg, #ffffff, var(--brand), #ffffff);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite, fadeInUp 0.8s ease-out 0.6s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .role-text {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease-out 1s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
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
        
        /* About section animations */
        .about-image {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s ease-out;
        }
        .about-image.animate {
          opacity: 1;
          transform: translateX(0);
        }
        
        .about-text {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s ease-out;
        }
        .about-text.animate {
          opacity: 1;
          transform: translateX(0);
        }
        
        /* About section animations */
        .about-image {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s ease-out;
        }
        .about-image.animate {
          opacity: 1;
          transform: translateX(0);
        }
        
        .about-text {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s ease-out;
        }
        .about-text.animate {
          opacity: 1;
          transform: translateX(0);
        }

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

        /* Mobile menu responsive styles */
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
          }
          
          .links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(75, 45, 127, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 20px;
            gap: 20px;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 100;
          }
          
          .links.show {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .link {
            font-size: 18px;
            padding: 12px 0;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            white-space: nowrap;
          }
          
          .link:last-child {
            border-bottom: none;
          }
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
          <button className="mobile-menu-toggle" onClick={() => document.querySelector('.links')?.classList.toggle('show')}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <main>
        {/* Home */}
        <section id="home" ref={(el) => { refs.current['home'] = el }}>
          <div className="hero">
            <div>
              <p className="lead intro-text" style={{ color: '#ffffff' }}>Hi,</p>
              <h1 className="title">I'm <span className="name-highlight" style={{ color: '#ffffff' }}>James Daumar</span><br/><span className="role-text">Frontend Developer & Graphic Designer</span></h1>
              <div className="socials">
                <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile" aria-label="LinkedIn" className="social-link" target="_blank" rel="noreferrer">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 0H5C3.343 0 2 1.343 2 3v18c0 1.657 1.343 3 3 3h14c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM8.09 20.452H5.337V9h2.753v11.452zM6.713 7.651a1.593 1.593 0 1 1 0-3.186 1.593 1.593 0 0 1 0 3.186zM20.452 20.452h-2.751v-5.573c0-1.329-.027-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.944v5.668H11.96V9h2.64v1.561h.037c.367-.695 1.262-1.429 2.597-1.429 2.778 0 3.292 1.829 3.292 4.205v7.115z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/james_dam_art/#" aria-label="Instagram" className="social-link" target="_blank" rel="noreferrer">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/>
                  </svg>
                </a>
                <a href="https://github.com/dammy-projects" aria-label="GitHub" className="social-link" target="_blank" rel="noreferrer">
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
            <div className={`card about-image ${aboutVisible ? 'animate' : ''}`}>
              <img src={myImage} alt="About" style={{ width: '100%', borderRadius: 12 }} />
            </div>
            <div className={`about-text ${aboutVisible ? 'animate' : ''}`}>
              <h3 style={{ marginTop: 0 }}>I'm James Daumar 👋</h3>
              <p className="lead" style={{ color: '#ffffff' }}>I'm a passionate Web Designer, Frontend Developer, Funnel Designer, and Graphic Designer with a focus on creating clean, responsive, and user-friendly designs.</p>
              <p>I specialize in building modern websites and web applications using React, Node.js, Supabase, Tailwind CSS, and strong UI/UX principles. Alongside development, I craft Graphic Designs and strategic Funnel Designs that help brands and businesses grow, converting ideas into impactful digital solutions.</p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" ref={(el) => { refs.current['skills'] = el }}>
          <h2>Skills</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '16px', maxWidth: '800px' }}>
              {[
                { name: 'React', icon: <svg width="20" height="20" viewBox="0 0 122.88 109.43" xmlns="http://www.w3.org/2000/svg"><g><path d="M122.88,54.73c0-8.14-10.19-15.85-25.82-20.64c3.61-15.93,2-28.6-5.06-32.66c-1.63-0.95-3.53-1.4-5.61-1.4 v5.59c1.15,0,2.08,0.23,2.86,0.65c3.41,1.95,4.88,9.39,3.73,18.96c-0.28,2.35-0.73,4.83-1.28,7.36c-4.91-1.2-10.27-2.13-15.9-2.73 c-3.38-4.63-6.89-8.84-10.42-12.52C73.54,9.74,81.2,5.59,86.41,5.59V0l0,0c-6.89,0-15.9,4.91-25.02,13.43 C52.27,4.96,43.26,0.1,36.37,0.1v5.59c5.18,0,12.87,4.13,21.04,11.67c-3.51,3.68-7.01,7.86-10.34,12.5 c-5.66,0.6-11.02,1.53-15.93,2.75c-0.58-2.5-1-4.93-1.3-7.26c-1.18-9.57,0.28-17.01,3.66-18.99c0.75-0.45,1.73-0.65,2.88-0.65V0.13 l0,0c-2.1,0-4.01,0.45-5.66,1.4c-7.04,4.06-8.62,16.71-4.98,32.59C10.14,38.92,0,46.61,0,54.73c0,8.14,10.19,15.85,25.82,20.64 c-3.61,15.93-2,28.6,5.06,32.66c1.63,0.95,3.53,1.4,5.64,1.4c6.89,0,15.9-4.91,25.02-13.43c9.12,8.47,18.13,13.33,25.02,13.33 c2.1,0,4.01-0.45,5.66-1.4c7.04-4.06,8.62-16.71,4.98-32.59C112.74,70.56,122.88,62.84,122.88,54.73L122.88,54.73z M72.86,54.73 c0-6.32-5.12-11.45-11.45-11.45c-6.32,0-11.45,5.12-11.45,11.45s5.12,11.45,11.45,11.45C67.74,66.17,72.86,61.05,72.86,54.73 L72.86,54.73z M36.34,0.1L36.34,0.1L36.34,0.1L36.34,0.1z M90.27,38.02c-0.93,3.23-2.08,6.56-3.38,9.89c-1.03-2-2.1-4.01-3.28-6.01 c-1.15-2-2.38-3.96-3.61-5.86C83.56,36.57,86.99,37.22,90.27,38.02L90.27,38.02z M78.8,64.7c-1.95,3.38-3.96,6.59-6.04,9.57 c-3.73,0.33-7.51,0.5-11.32,0.5c-3.78,0-7.56-0.18-11.27-0.48c-2.08-2.98-4.11-6.16-6.06-9.52c-1.9-3.28-3.63-6.61-5.21-9.97 c1.55-3.36,3.31-6.71,5.18-9.99c1.95-3.38,3.96-6.59,6.04-9.57c3.73-0.33,7.51-0.5,11.32-0.5c3.78,0,7.56,0.18,11.27,0.48 c2.08,2.98,4.11,6.16,6.06,9.52c1.9,3.28,3.63,6.61,5.21,9.97C82.4,58.06,80.68,61.41,78.8,64.7L78.8,64.7z M86.89,61.44 c1.35,3.36,2.5,6.71,3.46,9.97c-3.28,0.8-6.74,1.48-10.32,2c1.23-1.93,2.45-3.91,3.61-5.94C84.78,65.47,85.86,63.44,86.89,61.44 L86.89,61.44z M61.49,88.16c-2.33-2.4-4.66-5.08-6.96-8.01c2.25,0.1,4.56,0.18,6.89,0.18c2.35,0,4.68-0.05,6.96-0.18 C66.12,83.08,63.79,85.76,61.49,88.16L61.49,88.16z M42.86,73.41c-3.56-0.53-6.99-1.18-10.27-1.98c0.93-3.23,2.08-6.56,3.38-9.89 c1.03,2,2.1,4.01,3.28,6.01C40.43,69.56,41.63,71.51,42.86,73.41L42.86,73.41z M61.36,21.29c2.33,2.4,4.66,5.08,6.96,8.01 c-2.25-0.1-4.56-0.18-6.89-0.18c-2.35,0-4.68,0.05-6.96,0.18C56.73,26.37,59.06,23.69,61.36,21.29L61.36,21.29z M42.83,36.04 c-1.23,1.93-2.45,3.91-3.61,5.94c-1.15,2-2.23,4.01-3.26,6.01c-1.35-3.36-2.5-6.71-3.46-9.97C35.79,37.24,39.25,36.57,42.83,36.04 L42.83,36.04z M20.16,67.4c-8.87-3.78-14.6-8.74-14.6-12.67c0-3.93,5.74-8.92,14.6-12.67c2.15-0.93,4.51-1.75,6.94-2.53 c1.43,4.91,3.31,10.02,5.64,15.25c-2.3,5.21-4.16,10.29-5.56,15.18C24.7,69.18,22.34,68.33,20.16,67.4L20.16,67.4z M33.64,103.19 c-3.41-1.95-4.88-9.39-3.73-18.96c0.28-2.35,0.73-4.83,1.28-7.36c4.91,1.2,10.27,2.13,15.9,2.73c3.38,4.63,6.89,8.84,10.42,12.52 c-8.17,7.59-15.83,11.75-21.04,11.75C35.34,103.84,34.39,103.62,33.64,103.19L33.64,103.19z M93.05,84.11 c1.18,9.57-0.28,17.01-3.66,18.99c-0.75,0.45-1.73,0.65-2.88,0.65c-5.18,0-12.87-4.13-21.04-11.67c3.51-3.68,7.01-7.86,10.34-12.5 c5.66-0.6,11.02-1.53,15.93-2.76C92.32,79.35,92.77,81.78,93.05,84.11L93.05,84.11z M102.69,67.4c-2.15,0.93-4.51,1.75-6.94,2.53 c-1.43-4.91-3.31-10.02-5.64-15.25c2.3-5.21,4.16-10.29,5.56-15.18c2.48,0.78,4.83,1.63,7.04,2.55c8.87,3.78,14.6,8.74,14.6,12.67 C117.29,58.66,111.56,63.64,102.69,67.4L102.69,67.4z" fill="#00D8FF"/></g></svg> },
                { name: 'HTML', icon: <svg width="20" height="20" viewBox="0 0 108.35 122.88" xmlns="http://www.w3.org/2000/svg"><g><polygon points="108.35,0 98.48,110.58 54.11,122.88 9.86,110.6 0,0 108.35,0" fill="#E44D26"/><polygon points="54.17,113.48 90.03,103.54 98.46,9.04 54.17,9.04 54.17,113.48" fill="#F16529"/><path d="M34.99,36.17h19.19V22.61H20.16l0.32,3.64l3.33,37.38h30.35V50.06H36.23L34.99,36.17L34.99,36.17L34.99,36.17z M38.04,70.41H24.43l1.9,21.3l27.79,7.71l0.06-0.02V85.29l-0.06,0.02l-15.11-4.08L38.04,70.41L38.04,70.41L38.04,70.41z" fill="#EBEBEB"/><path d="M54.13,63.63h16.7l-1.57,17.59L54.13,85.3v14.11l27.81-7.71l0.2-2.29l3.19-35.71l0.33-3.64H54.13V63.63 L54.13,63.63z M54.13,36.14v0.03h32.76l0.27-3.05l0.62-6.88l0.32-3.64H54.13V36.14L54.13,36.14L54.13,63.63z" fill="#FFFFFF"/></g></svg> },
                { name: 'CSS', icon: <svg width="20" height="20" viewBox="0 0 296297 333333" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"><defs><linearGradient id="id4" gradientUnits="userSpaceOnUse" x1="54128.7" y1="79355.5" x2="240318" y2="79355.5"><stop offset="0" stopColor="#e8e7e5"/><stop offset="1" stopColor="#fff"/></linearGradient><linearGradient id="id5" gradientUnits="userSpaceOnUse" x1="62019.3" y1="202868" x2="233515" y2="202868"><stop offset="0" stopColor="#e8e7e5"/><stop offset="1" stopColor="#fff"/></linearGradient><linearGradient id="id6" gradientUnits="userSpaceOnUse" x1="104963" y1="99616.9" x2="104963" y2="171021"><stop offset="0" stopColor="#d1d3d4"/><stop offset=".388" stopColor="#d1d3d4"/><stop offset="1" stopColor="#d1d3d4"/></linearGradient><linearGradient id="id7" gradientUnits="userSpaceOnUse" xlinkHref="#id6" x1="194179" y1="61185.8" x2="194179" y2="135407"/><mask id="id0"><linearGradient id="id1" gradientUnits="userSpaceOnUse" x1="104963" y1="99616.9" x2="104963" y2="171021"><stop offset="0" stopOpacity="0" stopColor="#fff"/><stop offset=".388" stopColor="#fff"/><stop offset="1" stopOpacity=".831" stopColor="#fff"/></linearGradient><path fill="url(#id1)" d="M61737 99467h86453v71704H61737z"/></mask><mask id="id2"><linearGradient id="id3" gradientUnits="userSpaceOnUse" x1="194179" y1="61185.8" x2="194179" y2="135407"><stop offset="0" stopOpacity="0" stopColor="#fff"/><stop offset=".388" stopColor="#fff"/><stop offset="1" stopOpacity=".831" stopColor="#fff"/></linearGradient><path fill="url(#id3)" d="M147890 61036h92578v74521h-92578z"/></mask></defs><g id="Layer_x0020_1"><g id="_513085304"><path fill="#2062af" d="M268517 300922l-120369 32411-120371-32411L0 0h296297z"/><path fill="#3c9cd7" d="M148146 24374v283109l273 74 97409-26229 22485-256954z"/><path fill="#fff" d="M148040 99617l-86153 35880 2857 35524 83296-35614 88604-37883 3674-36339-92278 38432z"/><path mask="url(#id0)" fill="url(#id6)" d="M61887 135497l2857 35524 83295-35614V99617z"/><path mask="url(#id2)" fill="url(#id7)" d="M240318 61186l-92278 38431v35790l88604-37883z"/><path fill="url(#id5)" d="M62019 135497l2858 35524 127806 407-2859 47365-42055 11840-40428-10208-2450-29399H67327l4900 56756 75950 22457 75538-22050 9800-112692z"/><path fill="#000" fillOpacity=".05098" d="M148040 135497H61888l2857 35524 83295 266v-35790zm0 95022l-408 114-40422-10208-2450-29399H67197l4899 56756 75944 22457v-39720z"/><path fill="url(#id4)" d="M54129 61186h186189l-3674 36339H58620l-4491-36339z"/><path fill="#000" fillOpacity=".05098" d="M148040 61186H54129l4491 36339h89420z"/></g></g></svg> },
                { name: 'JavaScript', icon: <svg width="20" height="20" viewBox="0 0 122.88 122.88" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><g><polygon points="0,0 122.88,0 122.88,122.88 0,122.88 0,0" fill="#F7DF1E"/><path d="M32.31,102.69l9.4-5.69c1.81,3.22,3.46,5.94,7.42,5.94c3.79,0,6.19-1.48,6.19-7.26V56.41h11.55v39.43 c0,11.96-7.01,17.4-17.24,17.4C40.39,113.24,35.03,108.46,32.31,102.69L32.31,102.69L32.31,102.69z M73.14,101.45l9.4-5.44 c2.48,4.04,5.69,7.01,11.38,7.01c4.78,0,7.84-2.39,7.84-5.69c0-3.96-3.13-5.36-8.41-7.67l-2.89-1.24c-8.33-3.55-13.86-8-13.86-17.4 c0-8.66,6.6-15.26,16.91-15.26c7.34,0,12.62,2.56,16.41,9.24l-8.99,5.77c-1.98-3.55-4.12-4.95-7.42-4.95 c-3.38,0-5.53,2.14-5.53,4.95c0,3.46,2.14,4.87,7.09,7.01l2.89,1.24c9.82,4.21,15.34,8.5,15.34,18.15 c0,10.39-8.17,16.08-19.14,16.08C83.45,113.25,76.52,108.13,73.14,101.45L73.14,101.45L73.14,101.45L73.14,101.45z M73.14,101.45L73.14,101.45 L73.14,101.45L73.14,101.45z"/></g></svg> },
                { name: 'Supabase', icon: <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#prefix___Linear1)" fillRule="nonzero" transform="translate(19.834 12.62) scale(4.33237)"/><path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#prefix___Linear2)" fillRule="nonzero" transform="translate(19.834 12.62) scale(4.33237)"/><path d="M216.165 21.593c12.386-15.6 37.51-7.053 37.804 12.867l1.915 291.356H62.426c-35.486 0-55.277-40.984-33.208-68.776L216.165 21.593z" fill="#3ecf8e" fillRule="nonzero"/><defs><linearGradient id="prefix___Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(22.753 -109.622 161.61) scale(43.5812)"><stop offset="0" stopColor="#249361"/><stop offset="1" stopColor="#3ecf8e"/></linearGradient><linearGradient id="prefix___Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="scale(39.0687) rotate(62.022 -.188 1.161)"><stop offset="0" stopOpacity=".2"/><stop offset="1" stopOpacity="0"/></linearGradient></defs></svg> },
                { name: 'MySQL', icon: <svg width="20" height="20" viewBox="0 0 122.88 83.67" xmlns="http://www.w3.org/2000/svg"><defs><style>{`.cls-1,.cls-4{fill:#00758f;}.cls-2,.cls-3{fill:#f29111;}.cls-3,.cls-4{fill-rule:evenodd;}`}</style></defs><title>mysql</title><path className="cls-1" d="M29.54,76.23H24.8q-.24-12-1.38-22.64h0L16.16,76.23H12.55L5.37,53.59h0q-.79,10.19-1,22.64H0Q.42,61.08,2.1,47.82H8l6.84,20.87h0l6.88-20.87h5.62q1.84,15.52,2.18,28.41Zm0,0Z"/><path className="cls-1" d="M50.11,55.27Q47.22,71,42.47,78.17q-3.69,5.51-8.1,5.5a7.89,7.89,0,0,1-2.89-.7V80.44a14.05,14.05,0,0,0,2,.12,4.74,4.74,0,0,0,3.31-1.14,4.13,4.13,0,0,0,1.51-3.11,20.77,20.77,0,0,0-1.17-4.84l-5.2-16.2h4.65l3.74,12.12q1.26,4.13,1.05,5.76a79.31,79.31,0,0,0,4.28-17.88Zm0,0Z"/><path className="cls-2" d="M70.88,68.35a7.56,7.56,0,0,1-2.64,5.94,10.42,10.42,0,0,1-7.09,2.31A14.22,14.22,0,0,1,53.09,74l1.22-2.44a13.76,13.76,0,0,0,6.08,1.68,6.39,6.39,0,0,0,4-1.13,3.9,3.9,0,0,0,1.54-3.16c0-1.68-1.17-3.12-3.33-4.33-2-1.1-6-3.38-6-3.38a6.79,6.79,0,0,1-3.24-6,7.09,7.09,0,0,1,2.42-5.58,9.06,9.06,0,0,1,6.23-2.13,12.87,12.87,0,0,1,7.17,2.11L68.15,52a13.74,13.74,0,0,0-5.45-1.18,4.87,4.87,0,0,0-3.36,1,3.55,3.55,0,0,0-1.27,2.7c0,1.68,1.2,3.14,3.41,4.37,2,1.09,6.08,3.42,6.08,3.42,2.22,1.57,3.32,3.25,3.32,6Zm0,0Z"/><path className="cls-3" d="M79.35,70.54c-1.14-1.85-1.72-4.82-1.72-8.91q0-10.74,6.51-10.73a5.45,5.45,0,0,1,5,2.56q1.73,2.77,1.72,8.84,0,10.82-6.5,10.81a5.47,5.47,0,0,1-5-2.56Zm16.87,6.37L91,74.34a9.72,9.72,0,0,0,1.3-1.27q3.32-3.91,3.32-11.57,0-14.1-11-14.1A10.44,10.44,0,0,0,76.16,51q-3.31,3.92-3.31,11.53t2.94,11c1.78,2.1,4.48,3.16,8.09,3.16a13.16,13.16,0,0,0,3.71-.5l6.78,3.95,1.85-3.19Zm0,0Z"/><polygon className="cls-2" points="113.22 76.23 99.75 76.23 99.75 47.82 104.28 47.82 104.28 72.73 113.22 72.73 113.22 76.23 113.22 76.23"/><path className="cls-2" d="M116.45,76.22h.75V73.33h1v-.59h-2.76v.59h1v2.89Zm5.72,0h.71V72.74h-1.07l-.87,2.38L120,72.74h-1v3.48h.67V73.58h0l1,2.64h.51l1-2.64v2.64Zm0,0Z"/><path className="cls-4" d="M118.91,38.31a15.86,15.86,0,0,0-6.64,1c-.51.21-1.33.21-1.4.86.27.27.3.72.55,1.1a7.87,7.87,0,0,0,1.77,2.09c.72.55,1.44,1.1,2.2,1.58,1.33.82,2.84,1.3,4.13,2.13.76.48,1.51,1.09,2.27,1.61.37.27.61.72,1.09.89v-.1c-.24-.31-.31-.76-.55-1.1l-1-1a16.49,16.49,0,0,0-3.56-3.47c-1.1-.76-3.5-1.79-3.94-3l-.07-.07a13.51,13.51,0,0,0,2.36-.56c1.17-.3,2.23-.23,3.42-.54.55-.14,1.1-.31,1.65-.48v-.31c-.62-.62-1.06-1.44-1.71-2a46.9,46.9,0,0,0-5.65-4.22c-1.06-.68-2.43-1.13-3.56-1.71-.41-.21-1.09-.31-1.33-.66a13.87,13.87,0,0,1-1.41-2.64c-1-1.88-2-4-2.8-6A37.42,37.42,0,0,0,103,17.72,34.56,34.56,0,0,0,89.71,4.88a16.08,16.08,0,0,0-4.38-1.4c-.85,0-1.71-.11-2.56-.14a13.4,13.4,0,0,1-1.58-1.2c-2-1.24-7-3.91-8.42-.38C71.85,4,74.14,6.19,74.93,7.32a16.35,16.35,0,0,1,1.74,2.57c.24.59.31,1.21.55,1.82A41.7,41.7,0,0,0,79,16.31a16.86,16.86,0,0,0,1.27,2.13c.27.38.75.55.85,1.17a9.9,9.9,0,0,0-.78,2.57c-1.24,3.88-.76,8.68,1,11.53.54.86,1.85,2.75,3.59,2,1.54-.61,1.2-2.57,1.65-4.28.1-.42,0-.69.23-1v.06c.48,1,1,1.89,1.41,2.85A19.65,19.65,0,0,0,92.66,38c.82.62,1.47,1.68,2.5,2.06V40h-.07a4,4,0,0,0-.79-.69,16.31,16.31,0,0,1-1.78-2.06A43.24,43.24,0,0,1,88.69,31c-.55-1.07-1-2.24-1.47-3.3-.21-.41-.21-1-.55-1.23A12,12,0,0,0,85,28.77a19,19,0,0,0-1,5.18c-.14,0-.07,0-.14.07-1.09-.28-1.47-1.41-1.88-2.37a14.85,14.85,0,0,1-.31-9.16c.24-.72,1.27-3,.85-3.67-.2-.66-.89-1-1.26-1.55a12.77,12.77,0,0,1-1.23-2.19c-.82-1.93-1.24-4.05-2.12-6a19.24,19.24,0,0,0-1.72-2.64,16.78,16.78,0,0,1-1.88-2.67c-.17-.38-.41-1-.14-1.41a.55.55,0,0,1,.48-.45c.45-.38,1.71.1,2.16.31A17.11,17.11,0,0,1,80.27,4c.48.34,1,1,1.6,1.16h.72c1.1.24,2.33.07,3.36.38a21.63,21.63,0,0,1,4.93,2.37,30.37,30.37,0,0,1,10.67,11.74c.42.78.59,1.51,1,2.33.72,1.68,1.61,3.4,2.33,5a22.85,22.85,0,0,0,2.43,4.6c.52.72,2.57,1.1,3.49,1.48a23.92,23.92,0,0,1,2.37,1c1.16.72,2.32,1.54,3.42,2.33.54.42,2.26,1.27,2.36,2Zm0,0Z"/><path className="cls-4" d="M84,8.48a5.2,5.2,0,0,0-1.41.18v.07h.07a12.56,12.56,0,0,0,1.1,1.4c.27.55.51,1.1.78,1.65l.07-.07A1.93,1.93,0,0,0,85.33,10c-.2-.24-.24-.48-.41-.72s-.65-.51-.92-.79Zm0,0Z"/></svg> },
                { name: 'Next.js', icon: <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><g transform="translate(.722 .64) scale(6.375)"><circle cx="40" cy="40" r="40"/><path d="M66.448 70.009L30.73 24H24v31.987h5.384v-25.15l32.838 42.427a40.116 40.116 0 004.226-3.255z" fill="url(#prefix___Linear1)" fillRule="nonzero"/><path fill="url(#prefix___Linear2)" d="M51.111 24h5.333v32h-5.333z"/></g><defs><linearGradient id="prefix___Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(51.103 -29.93 76.555) scale(25.1269)"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><linearGradient id="prefix___Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90.218 14.934 38.787) scale(23.50017)"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs></svg> },
                { name: 'Vue', icon: <svg width="20" height="20" viewBox="0 0 122.88 106.42" xmlns="http://www.w3.org/2000/svg"><g><polygon points="75.63,0 61.44,24.58 47.25,0 0,0 61.44,106.42 122.88,0 75.63,0" fill="#4DBA87"/><polygon points="75.63,0 61.44,24.58 47.25,0 24.58,0 61.44,63.85 98.3,0 75.63,0" fill="#425466"/></g></svg> },
                { name: 'Vite', icon: <svg width="20" height="20" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(0 .937) scale(.3122)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#41d1ff"/><stop offset="1" stopColor="#bd34fe"/></linearGradient><linearGradient id="b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(0 .937) scale(.3122)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffea83"/><stop offset=".083" stopColor="#ffdd35"/><stop offset="1" stopColor="#ffa800"/></linearGradient></defs><path fill="url(#a)" d="M124.766 19.52 67.324 122.238c-1.187 2.121-4.234 2.133-5.437.024L3.305 19.532c-1.313-2.302.652-5.087 3.261-4.622L64.07 25.187a3.09 3.09 0 0 0 1.11 0l56.3-10.261c2.598-.473 4.575 2.289 3.286 4.594Zm0 0"/><path fill="url(#b)" d="M91.46 1.43 48.954 9.758a1.56 1.56 0 0 0-1.258 1.437l-2.617 44.168a1.563 1.563 0 0 0 1.91 1.614l11.836-2.735a1.562 1.562 0 0 1 1.88 1.836l-3.517 17.219a1.562 1.562 0 0 0 1.985 1.805l7.308-2.223c1.133-.344 2.223.652 1.985 1.812l-5.59 27.047c-.348 1.692 1.902 2.614 2.84 1.164l.625-.968 34.64-69.13c.582-1.16-.421-2.48-1.69-2.234l-12.185 2.352a1.558 1.558 0 0 1-1.793-1.965l7.95-27.562A1.56 1.56 0 0 0 91.46 1.43Zm0 0"/></svg> },
                { name: 'MongoDB', icon: <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M361.079 206.46c-25.576-112.83-78.884-142.866-92.482-164.1a241.402 241.402 0 01-14.868-29.1c-.719 10.023-2.038 16.338-10.558 23.939-17.107 15.252-89.76 74.456-95.873 202.655-5.697 119.528 87.87 193.233 100.233 200.851 9.506 4.678 21.082.1 26.729-4.193 45.105-30.956 106.732-113.481 86.869-230.052" fill="#10aa50" fillRule="nonzero"/><path d="M257.604 377.057c-2.355 29.585-4.042 46.775-10.023 63.681 0 0 3.926 28.166 6.682 58.002h9.756a542.483 542.483 0 0110.642-62.462c-12.63-6.214-16.572-33.26-17.057-59.221z" fill="#b8c4c2" fillRule="nonzero"/><path d="M274.644 436.295c-12.763-5.897-16.455-33.512-17.023-59.238a1212.794 1212.794 0 002.757-127.547c-.669-22.319.317-206.715-5.497-233.711a224.383 224.383 0 0013.716 26.545c13.598 21.25 66.922 51.286 92.482 164.116 19.913 116.37-41.38 198.679-86.435 229.835z" fill="#12924f" fillRule="nonzero"/></svg> },
                { name: 'n8n', icon: <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><path d="M512 179.2c0 28.267-23.51 51.2-52.522 51.2-24.448 0-45.014-16.32-50.86-38.4h-73.3c-12.843 0-23.787 9.045-25.9 21.397l-2.154 12.63A50.917 50.917 0 01290.197 256c8.79 7.552 15.02 18.005 17.067 29.973l2.133 12.63c2.262 12.458 13.291 21.546 25.942 21.397h20.8c5.824-22.08 26.39-38.4 50.859-38.4 29.013 0 52.5 22.933 52.5 51.2 0 28.267-23.53 51.2-52.5 51.2-24.47 0-45.014-16.32-50.86-38.4h-20.8c-25.685 0-47.573-18.09-51.797-42.773l-2.154-12.63c-2.262-12.437-13.27-21.525-25.899-21.397h-21.461c-6.57 20.992-26.582 36.267-50.262 36.267s-43.69-15.275-50.24-36.267h-30.762c-6.571 20.992-26.582 36.267-50.24 36.267-29.014 0-52.523-22.934-52.523-51.2 0-28.267 23.51-51.2 52.523-51.2 25.237 0 46.336 17.386 51.37 40.533h28.523c5.035-23.147 26.133-40.533 51.37-40.533 25.26 0 46.337 17.386 51.371 40.533h20.31c12.821 0 23.786-9.045 25.877-21.397l2.176-12.63c4.224-24.682 26.133-42.773 51.798-42.773h73.3c5.846-22.08 26.412-38.4 50.86-38.4C488.49 128 512 150.933 512 179.2zm-26.24 0c0 14.144-11.776 25.6-26.282 25.6-14.507 0-26.24-11.456-26.24-25.6 0-14.144 11.733-25.6 26.24-25.6 14.506 0 26.26 11.456 26.26 25.6h.022zM52.501 279.467c14.507 0 26.24-11.456 26.24-25.6 0-14.144-11.733-25.6-26.24-25.6-14.506 0-26.261 11.456-26.261 25.6 0 14.144 11.733 25.6 26.24 25.6h.021zm131.264 0c14.507 0 26.262-11.456 26.262-25.6 0-14.144-11.734-25.6-26.24-25.6-14.507 0-26.262 11.456-26.262 25.6 0 14.144 11.734 25.6 26.24 25.6zm223.19 78.933c14.507 0 26.24-11.456 26.24-25.6 0-14.144-11.733-25.6-26.24-25.6-14.507 0-26.24 11.456-26.24 25.6 0 14.144 11.733 25.6 26.24 25.6z" fill="#ea4b71"/></svg> },
                { name: 'GitHub', icon: <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 640 640"><path d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z"/></svg> }
               ].map((skill, index) => (
                 <span key={index} style={{ 
                   fontSize: '18px', 
                   fontWeight: '600',
                   color: '#ffffff',
                   padding: '12px 20px',
                   backgroundColor: 'rgba(255, 255, 255, 0.1)',
                   borderRadius: '25px',
                   border: '1px solid rgba(255, 255, 255, 0.2)',
                   backdropFilter: 'blur(10px)',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px'
                 }}>
                   <span style={{ fontSize: '20px' }}>{skill.icon}</span>
                   {skill.name}
                 </span>
               ))}
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
