/* ===========================
   PORTFOLIO JAVASCRIPT
   Ankit Kumar Portfolio
=========================== */

// ── 1. CUSTOM CURSOR ──────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth follower
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .btn, .tag, .project-card, .skill-category, .cert-card, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.background = 'var(--accent2)';
    follower.style.width = '50px';
    follower.style.height = '50px';
    follower.style.borderColor = 'rgba(192, 132, 252, 0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    follower.style.width = '36px';
    follower.style.height = '36px';
    follower.style.borderColor = 'rgba(124, 106, 247, 0.5)';
  });
});


// ── 2. NAVBAR SCROLL ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ── 3. HAMBURGER MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');

  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ── 4. SCROLL REVEAL ──────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on position in parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ── 5. TYPED TEXT EFFECT ──────────────────────────────────────────
const typedEl = document.getElementById('typed');
const phrases = [
  'Full-Stack Developer',
  'Frontend Enthusiast',
  'React.js Developer',
  'Problem Solver',
  'CS Student @ Sharda'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 90;

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 50;
      setTimeout(type, 1800); // pause before deleting
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 90;
    }
  }

  setTimeout(type, typingSpeed);
}

type();


// ── 6. ACTIVE NAV HIGHLIGHT ───────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ── 7. CONTACT FORM ───────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // ✅ YAHAN APNI FORMSPREE URL PASTE KARO
    // Step 1: formspree.io pe free account banao
    // Step 2: New Form create karo
    // Step 3: Jo URL mile (e.g. https://formspree.io/f/xyzabcde) wo neeche paste karo
    const FORMSPREE_URL = 'https://formspree.io/f/mwvrarzw';

    btn.textContent = 'Sending... ⏳';
    btn.disabled = true;

    try {
      const formData = new FormData(contactForm);

      // FormData ke fields manually add karo (id se)
      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
      };

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        btn.textContent = '✅ Sent!';
        formSuccess.classList.add('show');
        contactForm.reset();
      } else {
        btn.textContent = '❌ Failed. Try again.';
      }
    } catch (err) {
      btn.textContent = '❌ Error. Check connection.';
      console.error('Form error:', err);
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      formSuccess.classList.remove('show');
    }, 4000);
  });
}


// ── 8. SKILL TAG HOVER TOOLTIP ────────────────────────────────────
document.querySelectorAll('.tag[data-level]').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    const level = this.getAttribute('data-level');
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.textContent = `Proficiency: ${level}%`;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--accent);
      color: white;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
      transform: translateY(-6px);
      box-shadow: 0 4px 12px rgba(124, 106, 247, 0.4);
    `;
    this.style.position = 'relative';
    this.appendChild(tooltip);
  });

  tag.addEventListener('mouseleave', function () {
    const tooltip = this.querySelector('.skill-tooltip');
    if (tooltip) tooltip.remove();
  });
});


// ── 9. SMOOTH SCROLL ENHANCEMENT ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── 10. PARALLAX HERO BG TEXT ─────────────────────────────────────
const bgText = document.querySelector('.hero-bg-text');
if (bgText) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    bgText.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
  });
}


// ── 11. CARD TILT EFFECT ──────────────────────────────────────────
document.querySelectorAll('.project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});


// ── 12. PAGE LOAD ANIMATION ───────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});