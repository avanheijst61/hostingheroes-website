/* ============================================================
   HOSTING HEROES — script.js
   ============================================================ */

/* 1. NAVBAR — scrolled state
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* 2. HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* 3. ANIMATE ON SCROLL
   ============================================================ */
const animatedEls = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
    setTimeout(() => entry.target.classList.add('is-visible'), delay);
    scrollObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

animatedEls.forEach(el => scrollObserver.observe(el));

/* 4. COUNTER ANIMATION
   ============================================================ */
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const step   = Math.ceil(target / (duration / 16));
    let current  = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

/* 5. PRICING TABS
   ============================================================ */
/* Main pricing tabs */
const tabBtns          = document.querySelectorAll('.tab-btn');
const tabWebsite       = document.getElementById('tab-website');
const tabCarousel      = document.getElementById('tab-carousel');
const tabReviewbooster = document.getElementById('tab-reviewbooster');

const allMainTabs = [tabWebsite, tabCarousel, tabReviewbooster];

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    allMainTabs.forEach(t => { if (t) t.style.display = 'none'; });
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) target.style.display = '';
  });
});

// init: hide carousel + reviewbooster
[tabCarousel, tabReviewbooster].forEach(t => { if (t) t.style.display = 'none'; });

/* Sub-tabs inside Website & Hosting */
const subtabBtns   = document.querySelectorAll('.subtab-btn');
const tabEenmalig  = document.getElementById('tab-eenmalig');
const tabMaandelijks = document.getElementById('tab-maandelijks');

subtabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    subtabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.subtab === 'eenmalig') {
      tabEenmalig.classList.remove('hidden');
      tabMaandelijks.classList.add('hidden');
    } else {
      tabMaandelijks.classList.remove('hidden');
      tabEenmalig.classList.add('hidden');
    }
  });
});

/* 6. FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('is-open');

    // Close all
    document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
      openItem.classList.remove('is-open');
      openItem.querySelector('.faq-answer').style.maxHeight = '0';
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* 7. CONTACT FORM — Formspree
   ============================================================ */
const FORMSPREE_ID  = 'mgorywev';
const contactForm   = document.getElementById('contact-form');
const formFeedback  = document.getElementById('form-feedback');
const submitBtn     = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    contactForm.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-error');
      const err = g.querySelector('.error-msg');
      if (err) err.remove();
    });

    const showError = (id, msg) => {
      const input = document.getElementById(id);
      const group = input.closest('.form-group');
      group.classList.add('has-error');
      const span = document.createElement('span');
      span.className = 'error-msg';
      span.textContent = msg;
      group.appendChild(span);
      valid = false;
    };

    const naam     = document.getElementById('naam').value.trim();
    const email    = document.getElementById('email').value.trim();
    const telefoon = document.getElementById('telefoon').value.trim();
    const bericht  = document.getElementById('bericht').value.trim();

    if (!naam)    showError('naam',    'Vul je naam in.');
    if (!email)   showError('email',   'Vul een geldig e-mailadres in.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                  showError('email',   'Dit e-mailadres ziet er niet juist uit.');
    if (!bericht) showError('bericht', 'Beschrijf kort jouw project.');

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen…';

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ naam, email, telefoon, bericht })
      });

      if (res.ok) {
        contactForm.innerHTML = `
          <div class="success-msg">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style="margin:0 auto 1rem;display:block">
              <circle cx="12" cy="12" r="10" stroke="#22c55e" stroke-width="2"/>
              <path stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/>
            </svg>
            Bedankt! We nemen binnen 24 uur contact op.
          </div>`;
      } else {
        throw new Error('Fout bij verzenden');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Verstuur aanvraag`;
      formFeedback.innerHTML = '<p class="error-msg" style="margin-top:0.75rem">Er ging iets mis. Probeer het opnieuw of mail ons direct.</p>';
    }
  });
}

/* 8. FLOATING MOBILE CTA — hide near contact section
   ============================================================ */
const mobileFab   = document.getElementById('mobile-fab');
const contactSection = document.getElementById('contact');

if (mobileFab && contactSection) {
  const fabObserver = new IntersectionObserver(entries => {
    mobileFab.classList.toggle('hidden-fab', entries[0].isIntersecting);
  }, { threshold: 0.1 });
  fabObserver.observe(contactSection);
}
