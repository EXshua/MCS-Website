# Marine Compliance Solutions — Website

Static site for [marinecompliancesolutions.co.uk](https://marinecompliancesolutions.co.uk).

## Deploy to Vercel

1. Push this folder to a GitHub repository (or drag-drop the folder into [vercel.com/new](https://vercel.com/new))
2. Vercel auto-detects static files — no build settings needed, click **Deploy**
3. Add your custom domain in **Project → Settings → Domains**

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `services.html` | Service tiers detail |
| `about.html` | About MCS |
| `contact.html` | Contact form |
| `styles.css` | Shared stylesheet |
| `script.js` | Mobile nav, smooth scroll, form handling |
| `vercel.json` | Vercel config (clean URLs) |

## Contact Form

The contact form uses a `mailto:` fallback — no backend required. When a user submits the form, their email client opens with the enquiry pre-filled and addressed to `admin@marinecompliancesolutions.co.uk`. To add a proper backend later, replace the `submit` handler in `script.js` with a `fetch()` call to a form API (e.g. Formspree, Resend, or a Vercel serverless function).
