const menuButton = document.querySelector('#menu');
const mobileNav = document.querySelector('#mobile-nav');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

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
    if (opening && !reducedMotion.matches) answer.animate([{opacity: 0, transform: 'translateY(-6px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 180, easing: 'ease-out'});
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
  if (!reducedMotion.matches) lightbox.animate([{opacity: 0}, {opacity: 1}], {duration: 180, easing: 'ease-out'});
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

