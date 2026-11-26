const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Each enhancement is optional: links, event details and the logo remain usable without a CDN.
async function initGallery() {
  try {
    const { default: PhotoSwipeLightbox } = await import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.js');
    const lightbox = new PhotoSwipeLightbox({
      gallery: '.gallery-grid',
      children: 'a.gallery-item',
      pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.js'),
      bgOpacity: 0.95,
      showHideAnimationType: reducedMotion.matches ? 'none' : 'zoom',
      wheelToZoom: true,
    });
    lightbox.on('uiRegister', () => {
      lightbox.pswp.ui.registerElement({
        name: 'reference-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '<div class="pswp-reference-caption">Illustrative reference imagery · not a photograph of a Desi Events party</div>',
      });
    });
    lightbox.init();
  } catch (error) {
    console.warn('Gallery enhancement unavailable; image links still work.', error);
  }
}

async function initEventCarousel() {
  const viewport = document.querySelector('.embla');
  if (!viewport) return;
  try {
    const { default: EmblaCarousel } = await import('https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/+esm');
    const embla = EmblaCarousel(viewport, { align: 'start', containScroll: 'trimSnaps', watchDrag: true });
    const prev = document.querySelector('.events-prev');
    const next = document.querySelector('.events-next');
    const count = document.querySelector('.events-count');
    function update() {
      prev.disabled = !embla.canScrollPrev();
      next.disabled = !embla.canScrollNext();
      count.textContent = `${embla.selectedScrollSnap() + 1} / ${embla.scrollSnapList().length}`;
    }
    prev.addEventListener('click', () => embla.scrollPrev());
    next.addEventListener('click', () => embla.scrollNext());
    embla.on('select', update).on('reInit', update);
    viewport.classList.add('embla-ready');
    update();
  } catch (error) {
    document.querySelector('.event-controls')?.remove();
    console.warn('Event carousel unavailable; cards remain visible.', error);
  }
}

async function initBrandAnimation() {
  if (reducedMotion.matches) return;
  const canvas = document.querySelector('#brand-halo');
  if (!canvas) return;
  try {
    const { DotLottie } = await import('https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.79.0/+esm');
    const animation = new DotLottie({
      canvas,
      src: 'public/images/namaste-halo.json',
      autoplay: true,
      loop: true,
      renderConfig: { autoResize: true },
    });
    reducedMotion.addEventListener('change', event => event.matches ? animation.pause() : animation.play());
  } catch (error) {
    console.warn('Brand animation unavailable; static logo remains visible.', error);
  }
}

initGallery();
initEventCarousel();
initBrandAnimation();

