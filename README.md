# Desi Events website

Light themed, responsive website for Desi Events. The root `index.html` runs without a build step. The site also includes an events index (`events/index.html`), next event preview (`events/next/index.html`), and current privacy information (`privacy/index.html`). Event listings, ticket availability, gallery images, policies, contact details, and email signup are explicitly marked as previews until the organiser provides real information.

## Run

Open `index.html` directly, or serve the project folder with any static HTTP server. A small `server.mjs` is included and runs with Node.js:

```sh
node server.mjs
```

The homepage uses `src/site.js` for its interactions. GSAP handles the hero entrance; Motion handles interaction feedback and selected scroll reveals; PhotoSwipe handles the gallery; Embla handles event preview swiping; dotLottie renders the namaste halo; and Three.js renders a subtle hero background. These optional enhancements load from pinned CDN imports with static fallbacks. The inner pages use `src/inner-pages.js` for their mobile menus. All nonessential movement is disabled by `prefers-reduced-motion`.

## Content to replace before launch

- Confirmed event names, dates, start times, venue, arrondissement, prices, and booking URLs in the homepage and event pages.
- Real Desi Events photos in `public/images/`.
- Confirmed age, dress, group, and refund policies.
- Mailing list backend, consent wording, organiser identity, privacy contact, service provider details, and final privacy policy wording.
- Official social, contact, and legal links.

## Design and licences

Palette: paper `#f8f8f6`, ink `#171717`, magenta `#da3d7b`, saffron `#ffdd53`, orange `#ec5c28`, deep plum `#241b30`. Space Grotesk carries headlines; DM Sans carries body copy. The layout pairs a clean white editorial surface with a vibrant poster composition and a single dark experience section.

The identity includes a scalable [brand mark](public/images/desi-events-mark.svg) used in the header, footer, and favicon, plus a [standalone wordmark](public/images/desi-events-logo.svg). The symbol depicts a young woman greeting visitors with her palms together in a namaste gesture. The generated illustration was used as a concept reference; the site uses a simplified SVG mark for clarity at small sizes.

The three photographs in `public/images/` were generated specifically for this project and are labelled as illustrative reference imagery throughout the site. They do not depict Desi Events events.

Design guidance consulted: UI UX Pro Max (MIT) and Anthropic Frontend Design (Apache 2.0). Animation dependencies: Motion (MIT) and GSAP (standard no-charge license, including commercial use). No code or assets were copied from the other referenced component libraries.


