import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const navItems = [['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Certifications', 'certifications'], ['Contact', 'contact']]
const projects = [
  { title: 'Sign Language Recognition', description: 'A frontend interface for a sign-language project, designed to present gesture recognition results in a clear and accessible experience.', highlights: ['Accessible user interface', 'Responsive frontend design', 'Clear gesture-result presentation'], tech: ['React.js', 'JavaScript', 'Tailwind CSS'], link: 'https://github.com/the-ankitkumar/sign-language-recognition' },
  { title: 'PromptVeil', subtitle: 'Ongoing', description: 'Dual-layer AI security platform that detects & blocks prompt injection attacks across AI chat interfaces and web agents in real time.', highlights: ['Prompt injection detection', 'AI chat interface protection', 'Real-time web-agent security'], tech: ['AI Security', 'React.js', 'JavaScript'], link: 'https://github.com/the-ankitkumar', status: 'Ongoing' },
  { title: 'ShaadiNagar', subtitle: 'Tent House & Event Management', description: 'A polished event-management experience for discovering tent house services, planning celebrations, and presenting event offerings clearly.', highlights: ['Service-focused event browsing', 'Responsive, user-friendly experience', 'Reusable React components'], tech: ['React.js', 'Tailwind CSS'], link: 'https://github.com/the-ankitkumar/ShaadiNagar-Tent-House-Event-Management', liveDemo: 'https://shaadi-nagar-tent-house-event-manag.vercel.app/' },
]
const skills = [['🖥️', 'Frontend', ['React.js', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS']], ['💻', 'Programming', ['Java', 'Python', 'C', 'Dart (basic)']], ['☁️', 'Tools', ['Git & GitHub', 'VS Code', 'Eclipse IDE']]]
const certifications = [['Udemy', 'Full Stack Web Development', 'Hands-on experience building responsive web applications with modern frontend tools.', '/udemy-full-stack-certificate.pdf'], ['Oracle', 'Applied Database Systems using Oracle AI Database', 'Award of Completion for successfully completing the Oracle database systems course.', '/oracle-applied-database-systems-certificate.pdf']]

function SkillIcon({ title }) {
  const paths = {
    Frontend: 'M4 5h16v12H4z M8 21h8 M12 17v4 M8 9l2 2-2 2 M13 13h3',
    Backend: 'M5 4h14v5H5z M5 11h14v5H5z M5 18h14v2H5z M8 6h.01 M8 13h.01',
    Programming: 'M8 8l-4 4 4 4 M16 8l4 4-4 4 M14 5l-4 14',
    Tools: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4L15 11l-2-2z',
  }
  return <svg className="skill-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[title]} /></svg>
}

function ContactIcon({ type }) {
  const paths = { email: 'M3 5h18v14H3z M3 6l9 7 9-7', phone: 'M5 4h3l2 5-2 2a15 15 0 0 0 5 5l2-2 5 2v3c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z', location: 'M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z M12 11a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 12 11Z', linkedin: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.35V9h3.41v1.6h.05c.48-.9 1.66-1.86 3.41-1.86 3.65 0 4.33 2.41 4.33 5.54v6.17ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.11 20.45H3.56V9h3.55v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0Z', github: 'M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z' }
  return <svg className={`contact-svg ${type}`} viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type]} /></svg>
}

function PdfPreview({ url }) {
  const previewRef = useRef(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    const renderPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise
        if (!previewRef.current || cancelled) return
        previewRef.current.innerHTML = ''
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 1.35 })
          const canvas = document.createElement('canvas')
          canvas.className = 'pdf-page'
          canvas.width = viewport.width
          canvas.height = viewport.height
          previewRef.current.appendChild(canvas)
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        }
      } catch { if (!cancelled) setError('Unable to display this document. Please use Download File.') }
    }
    renderPdf()
    return () => { cancelled = true }
  }, [url, previewRef])
  return <div className="pdf-preview" ref={previewRef}>{error ? <p className="pdf-error">{error}</p> : null}</div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [photo, setPhoto] = useState(() => localStorage.getItem('ankit-profile-photo') || '/profile-photo.jpeg')
  const [messageSent, setMessageSent] = useState(false)
  const [documentViewer, setDocumentViewer] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id) }), { threshold: 0.35 })
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const cursor = document.querySelector('.cursor')
    const follower = document.querySelector('.cursor-follower')
    if (!cursor || !follower) return undefined
    const moveCursor = (event) => {
      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
      follower.style.left = `${event.clientX}px`
      follower.style.top = `${event.clientY}px`
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) } }), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  const handlePhoto = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { setPhoto(reader.result); localStorage.setItem('ankit-profile-photo', reader.result) }; reader.readAsDataURL(file) }
  const submitContact = (event) => { event.preventDefault(); setMessageSent(true); event.currentTarget.reset(); setTimeout(() => setMessageSent(false), 4000) }

  return <>
    <div className="cursor" /><div className="cursor-follower" />
    <nav className={`navbar ${activeSection !== 'home' ? 'scrolled' : ''}`}><a className="nav-logo" href="#home">Ankit Kumar<span className="dot">.</span></a><button className="hamburger" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button><ul className={`nav-links ${menuOpen ? 'open' : ''}`}>{navItems.map(([label, id]) => <li key={id}><a className={activeSection === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a></li>)}</ul></nav>
    <main>
      <section className="hero" id="home"><div className="hero-bg-text">DEVELOPER</div><div className="hero-content"><h1 className="hero-name reveal">Hello I'm <span className="hero-name-highlight">Ankit Kumar</span></h1><p className="hero-role reveal"><span className="typed-text">Frontend Developer</span><span className="cursor-blink">|</span></p><p className="hero-desc reveal">Frontend Developer crafting responsive, user-friendly web experiences with React.js, JavaScript, and Tailwind CSS.</p><div className="availability-card reveal"><div className="availability-heading"><span className="availability-dot" /> <strong>Currently Available</strong></div><p>For Frontend Developer · Full-time / Part-time · On-site / Hybrid / Remote</p></div><div className="hero-btns reveal"><a href="#projects" className="btn btn-primary">View My Work</a><a href="#contact" className="btn btn-outline">Let's Connect</a></div></div><div className="hero-photo-card reveal"><img src="/profile-photo.jpeg" alt="Ankit Kumar" /></div><div className="scroll-hint"><span>Scroll</span><div className="scroll-line" /></div></section>
      <section className="section about" id="about"><div className="container"><div className="section-label">01 / About</div><div className="about-grid"><div className="about-text"><h2 className="section-title reveal">Who I <span className="accent">Am</span></h2><p className="reveal">I'm a Computer Science student at Sharda University, Greater Noida, pursuing my B.Tech in Computer Science with a CGPA of 7.7. I have a passion for building beautiful and functional web applications and creating polished frontend experiences with React.js.</p><p className="reveal">I believe in writing clean, efficient code and creating interfaces that people actually enjoy using. Currently focused on growing as a frontend developer — one component at a time.</p><div className="resume-actions reveal"><button className="resume-download" onClick={() => setDocumentViewer({ title: 'Ankit Kumar Resume', url: '/Ankit-Kumar-Resume.pdf' })}>▣&nbsp; View Resume</button><a className="resume-download" href="/Ankit-Kumar-Resume.pdf" download="Ankit-Kumar-Resume.pdf">⇩&nbsp; Download Resume</a></div></div><div className="about-side reveal"><div className="photo-field"><div className="photo-frame">{photo ? <img src={photo} alt="Ankit Kumar" /> : <span>AK</span>}</div></div></div></div></div></section>
      <section className="section skills" id="skills"><div className="container"><div className="section-label">02 / Skills</div><h2 className="section-title reveal">My Tech <span className="accent">Stack</span></h2><div className="skills-grid">{skills.map(([, title, tags]) => <div className="skill-category reveal" key={title}><div className="skill-cat-header"><span className="skill-icon"><SkillIcon title={title} /></span><h3>{title}</h3></div><div className="skill-tags">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>)}</div></div></section>
      <section className="section projects" id="projects"><div className="container"><div className="section-label">03 / Projects</div><h2 className="section-title reveal">What I've <span className="accent">Built</span></h2><div className="projects-grid">{projects.map((project, index) => <article className="project-card reveal" key={project.title}><div className="project-top"><span className="project-number">0{index + 1}</span>{project.status && <span className="project-status">{project.status}</span>}<div className="project-actions"><a className="project-source-btn" href={project.link} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.25c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg> SOURCE CODE</a>{project.liveDemo && <a className="project-demo-btn" href={project.liveDemo} target="_blank" rel="noreferrer">Live Demo ↗</a>}</div></div><h3 className="project-title">{project.title}</h3>{project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}<p className="project-desc">{project.description}</p><ul className="project-highlights">{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul><div className="project-tech">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div></article>)}</div></div></section>
      <section className="section certifications" id="certifications"><div className="container"><div className="section-label">04 / Certifications</div><h2 className="section-title reveal">My <span className="accent">Credentials</span></h2><div className="certs-grid">{certifications.map(([issuer, title, desc, link]) => <div className="cert-card reveal" key={title}><div className="cert-info"><span className="cert-issuer">{issuer}</span><h3>{title}</h3><p>{desc}</p>{link && <div className="certificate-actions"><button className="certificate-link" onClick={() => setDocumentViewer({ title: `${issuer} — ${title}`, url: link })}>View Certificate ↗</button><a className="certificate-download" href={link} download>Download Certificate</a></div>}</div><div className="cert-badge">Certified</div></div>)}</div></div></section>
      <section className="section contact" id="contact"><div className="container"><div className="section-label">05 / Contact</div><h2 className="section-title reveal">Let's <span className="accent">Talk</span></h2><p className="contact-sub reveal">Have a project in mind? I'd love to collaborate. Reach out and let's build something great together.</p><div className="contact-grid"><div className="contact-items reveal"><a href="mailto:Ankitkumar8076084342@gmail.com" className="contact-item"><span className="contact-icon"><ContactIcon type="email" /></span><div><span className="contact-label">Email</span><span className="contact-val">Ankitkumar8076084342@gmail.com</span></div></a><a href="tel:+917463056002" className="contact-item"><span className="contact-icon"><ContactIcon type="phone" /></span><div><span className="contact-label">Phone</span><span className="contact-val">+91 7463056002</span></div></a><a href="https://www.linkedin.com/in/ankit-kumar1002" target="_blank" rel="noreferrer" className="contact-item"><span className="contact-icon"><ContactIcon type="linkedin" /></span><div><span className="contact-label">LinkedIn</span><span className="contact-val">ankit-kumar1002</span></div></a><a href="https://github.com/the-ankitkumar" target="_blank" rel="noreferrer" className="contact-item"><span className="contact-icon"><ContactIcon type="github" /></span><div><span className="contact-label">GitHub</span><span className="contact-val">the-ankitkumar</span></div></a><div className="contact-item location-card"><span className="contact-icon"><ContactIcon type="location" /></span><div><span className="contact-label">Location</span><span className="contact-val">Greater Noida, Uttar Pradesh, India</span></div></div></div><form className="contact-form reveal" onSubmit={submitContact}><div className="form-group"><input type="text" id="name" name="name" placeholder=" " required /><label htmlFor="name">Your Name</label></div><div className="form-group"><input type="email" id="email" name="email" placeholder=" " required /><label htmlFor="email">Your Email</label></div><div className="form-group"><textarea id="message" name="message" rows="4" placeholder=" " required /><label htmlFor="message">Your Message</label></div><button type="submit" className="btn btn-primary full-width">Send Message</button>{messageSent && <p className="form-success show">✅ Message sent! I'll get back to you soon.</p>}</form></div></div></section>
    </main>{documentViewer && <div className="document-modal" role="dialog" aria-modal="true" aria-label={documentViewer.title}><div className="document-modal-header"><strong>{documentViewer.title}</strong><button onClick={() => setDocumentViewer(null)} aria-label="Close document">×</button></div><PdfPreview url={documentViewer.url} /><div className="document-modal-footer"><a className="certificate-download" href={documentViewer.url} download>Download File</a><button className="btn btn-outline" onClick={() => setDocumentViewer(null)}>Close</button></div></div>}<footer className="footer"><div className="footer-inner"><div className="footer-copy"><strong>Ankit Kumar</strong><span>© 2026 All rights reserved.</span></div><div className="footer-socials"><a href="https://www.linkedin.com/in/ankit-kumar1002" target="_blank" rel="noreferrer"><ContactIcon type="linkedin" /></a><a href="mailto:Ankitkumar8076084342@gmail.com"><ContactIcon type="email" /></a><a href="https://github.com/the-ankitkumar" target="_blank" rel="noreferrer"><ContactIcon type="github" /></a></div></div></footer>
  </>
}
export default App
