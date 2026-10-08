# Wrench and Soul — Hortense, Georgia

Single-page marketing website for **Wrench and Soul**, an independent auto repair shop serving
Hortense, Nahunta and the rest of Brantley County, Georgia.

- **Phone:** (321) 246-9545
- **Location:** Hortense, GA 31543 (Brantley County)
- **Google Maps listing:** <https://www.google.com/maps/place/Wrench+and+Soul/data=!4m2!3m1!1s0x0:0xb8f2bd69424b3a3>

## Stack

Plain vanilla HTML, CSS and JavaScript. No build step, no dependencies, no external APIs.

| File | Purpose |
| --- | --- |
| `index.html` | The whole page: hero, trust strip, services, why-us, testimonials, contact + form, footer. |
| `styles.css` | All styling, responsive breakpoints, focus states, reduced-motion support. |
| `script.js` | Mobile nav, footer year, `_page` injection, `?submitted=1` confirmation, `fetch()` form submit. |
| `favicon.svg` | Local SVG favicon (wrench mark). No external requests. |
| `robots.txt` | Allows indexing. |

## Sections

1. **Hero** — business name, tagline, "Call Now" and "Get a Quote" calls to action.
2. **Trust strip** — what customers can expect.
3. **Services** — brakes, oil changes & maintenance, diagnostics, suspension & steering,
   batteries/starters/alternators, A/C & heating, general repair, pre-purchase checks.
4. **Why Us / How it works** — plain-English process from first call to follow-up.
5. **Testimonials** — reviews from drivers around Brantley County.
6. **Contact** — phone, service area, Google Maps link, and a request-a-quote form.
7. **Footer** — navigation and contact recap.

No FAQ section is included: no FAQ content was supplied for this business.

## Forms

The contact/quote form posts to LeadrVision:

- Action: `https://vision.leadrai.com/api/forms/efad320e9c8bc61157864b93b2bd4b11`
- Hidden fields: `_form=Contact`, `_page` (set to `window.location.href`), `_gotcha` honeypot.
- Field names: `name`, `phone`, `email`, `Vehicle`, `Service needed`, `Message`.
- With JavaScript: submitted via `fetch()` as JSON to the same endpoint; on `{"ok": true}` an
  inline "Thanks, your message was sent" confirmation is shown.
- Without JavaScript: a normal HTML POST, returning to the page with `?submitted=1`, which also
  shows the confirmation banner.

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```
