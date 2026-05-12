# Aum Builds — Website

AI-Assisted Architecture landing site for [aumbuilds.in](https://aumbuilds.in)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main HTML structure |
| `style.css` | All styles |
| `script.js` | Three.js scenes, modal, overlays, cursor |
| `vercel.json` | Vercel deployment config |

## Deploying to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up / log in with GitHub
2. Push this folder to a GitHub repo:
   ```
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/aum-builds.git
   git push -u origin main
   ```
3. In Vercel → **New Project** → import the GitHub repo
4. Framework: **Other** (static) — click **Deploy**
5. Done! Your site will be live on a `.vercel.app` URL

## Deploying to Render (Free)

1. Push to GitHub (same as above)
2. Go to [render.com](https://render.com) → **New Static Site**
3. Connect your GitHub repo
4. Build Command: *(leave blank)*
5. Publish Directory: `.`
6. Click **Create Static Site**

## Customisation Checklist

- [ ] Replace Google Drive portfolio link in `index.html` (search for `#PASTE_YOUR_DRIVE_LINK_HERE`)
- [ ] Add team photo — replace `.about-img-placeholder` section with an `<img>` tag
- [ ] Update contact email — search for `hello@aumbuilds.in`
- [ ] Update city/address in footer
- [ ] Connect form to Google Forms (replace `submitForm` in `script.js` with your Form action URL)
- [ ] Replace `[ Client Name ]` testimonial placeholders with real client videos

## Tech Stack

- Vanilla HTML + CSS + JavaScript (no build step needed)
- Three.js r128 via CDN
- Google Fonts: Cormorant Garamond, Space Mono, Outfit
