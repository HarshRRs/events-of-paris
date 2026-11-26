const menu = document.querySelector('#menu');
const mobileNav = document.querySelector('#mobile-nav');

if (menu && mobileNav) {
  function closeMenu(returnFocus = false) {
    mobileNav.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    menu.textContent = '☰';
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menu.setAttribute('aria-expanded', String(opening));
    menu.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    menu.textContent = opening ? '×' : '☰';
    if (opening) mobileNav.querySelector('a')?.focus();
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
  });
}

