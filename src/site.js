const menuButton = document.querySelector('#menu');
const mobileNav = document.querySelector('#mobile-nav');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionAnimate = null;

function animateFeedback(element, from, to, duration = 0.22) {
  if (reducedMotion.matches || !element) return;
  if (motionAnimate) {
    const values = Object.fromEntries(Object.keys(to).map(key => [key, [from[key], to[key]]]));
    return motionAnimate(element, values, { duration, ease: 'easeOut' });
  }
  return element.animate([from, to], { duration: duration * 1000, easing: 'ease-out' });
}

function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.textContent = '\u2630';
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  menuButton.textContent = opening ? '\u2715' : '\u2630';
  if (opening) animateFeedback(mobileNav, { opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }, 0.24);
  if (opening) mobileNav.querySelector('a')?.focus();
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});

const faqItems = [...document.querySelectorAll('.faq-item')];
faqItems.forEach((item, index) => {
  const button = item.querySelector('button');
  const answer = item.querySelector('.faq-answer');
  answer.id = `answer-${index}`;
  button.setAttribute('aria-controls', answer.id);
  button.addEventListener('click', () => {
    const opening = answer.hidden;
    faqItems.forEach(other => {
      other.querySelector('.faq-answer').hidden = true;
      other.querySelector('button').setAttribute('aria-expanded', 'false');
      other.querySelector('button span').textContent = '+';
    });
    answer.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
    button.querySelector('span').textContent = opening ? '\u2212' : '+';
    if (opening) animateFeedback(answer, { opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }, 0.18);
  });
});

const galleryButtons = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('img');
const closeButton = lightbox.querySelector('.lightbox-close');
const previousButton = lightbox.querySelector('.lightbox-prev');
const nextButton = lightbox.querySelector('.lightbox-next');
let activeImage = -1;
let previousFocus = null;
function showImage(index) {
  activeImage = (index + galleryButtons.length) % galleryButtons.length;
  const sourceImage = galleryButtons[activeImage].querySelector('img');
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
}
function openLightbox(index) {
  previousFocus = galleryButtons[index];
  showImage(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  closeButton.focus();
  animateFeedback(lightbox, { opacity: 0 }, { opacity: 1 }, 0.2);
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  activeImage = -1;
  previousFocus?.focus();
}
galleryButtons.forEach((button, index) => button.addEventListener('click', () => openLightbox(index)));
closeButton.addEventListener('click', closeLightbox);
previousButton.addEventListener('click', () => showImage(activeImage - 1));
nextButton.addEventListener('click', () => showImage(activeImage + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!lightbox.hidden) closeLightbox();
    else if (!mobileNav.hidden) closeMenu(true);
  }
  if (lightbox.hidden) return;
  if (event.key === 'ArrowRight') showImage(activeImage + 1);
  if (event.key === 'ArrowLeft') showImage(activeImage - 1);
  if (event.key === 'Tab') {
    const controls = [closeButton, previousButton, nextButton];
    const current = controls.indexOf(document.activeElement);
    if (current >= 0) { event.preventDefault(); controls[(current + (event.shiftKey ? 2 : 1)) % controls.length].focus(); }
  }
});

const signup = document.querySelector('#signup');
signup.addEventListener('submit', event => {
  event.preventDefault();
  signup.querySelector('.signup-status').hidden = false;
});

// GSAP owns only the hero entrance. The page stays fully visible if the CDN fails.
if (!reducedMotion.matches && window.gsap) {
  window.gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-kicker', { opacity: 0, y: 16, duration: 0.48 })
    .from('.hero-line', { opacity: 0, yPercent: 105, duration: 0.8, stagger: 0.12 }, '-=0.22')
    .from('.hero-copy > p', { opacity: 0, y: 24, duration: 0.55 }, '-=0.42')
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5 }, '-=0.32')
    .from('.poster', { opacity: 0, clipPath: 'inset(0 100% 0 0)', rotate: -7, duration: 1.05 }, 0.2)
    .from('.art-sticker', { opacity: 0, scale: 0.55, rotate: -38, duration: 0.68, ease: 'back.out(1.5)' }, 0.82);
}

// Motion owns interaction feedback and two distinct scroll reveals.
function initScrollReveals() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (entry.target.classList.contains('featured')) {
        animateFeedback(entry.target.querySelector('img'),
          { opacity: 0.65, transform: 'scale(1.08)' },
          { opacity: 1, transform: 'scale(1)' }, 0.9);
      } else if (entry.target.classList.contains('experience-list')) {
        [...entry.target.children].forEach((child, index) => setTimeout(() =>
          animateFeedback(child, { opacity: 0, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' }, 0.58), index * 100));
      } else if (entry.target.classList.contains('gallery-grid')) {
        [...entry.target.children].forEach((child, index) => setTimeout(() =>
          animateFeedback(child, { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0)' }, 0.55), index * 85));
      }
    }
  }, { threshold: 0.18 });
  ['.featured', '.experience-list', '.gallery-grid'].forEach(selector => {
    const element = document.querySelector(selector);
    if (element) observer.observe(element);
  });
}

import('https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm')
  .then(module => { motionAnimate = module.animate; initScrollReveals(); })
  .catch(() => initScrollReveals());

