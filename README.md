# Ganpati Bappa Morya — Invitation Site

A self-contained, animated invitation site for Ganesh Chaturthi. No build
tools, no server, no database — just three files that any free static
host can serve.

## What's interactive

- A "tap to open" entrance that reveals the invitation
- A live countdown to Sthapana
- Diyas you can tap to light, one by one
- A photo gallery with a tap-to-enlarge lightbox
- One-tap "Get directions" and "Add to calendar" (downloads a real `.ics` file)
- RSVP that opens WhatsApp with a pre-filled message
- A "Share this invitation" button
- Background music toggle
- Drifting marigold petals in the background

## 1. Add your own details

Open **`script.js`** and edit the `CONFIG` block at the very top — family
name, dates, venue, aarti timings, and your WhatsApp number (country code
+ number, digits only, e.g. `919812345678`). Everything on the page
updates automatically from this one place; you don't need to touch the
HTML.

The default dates are already set to the real 2026 festival dates
(Sthapana: Mon 14 Sept, Visarjan: Fri 25 Sept) — change them if your own
celebration is shorter (1.5, 5, or 7 days is common) or you're using a
different year.

## 2. Add your own photos and music (optional)

The site works fine without these — it shows tasteful placeholders — but
it'll feel a lot more like *your* celebration with your own images:

| What | Where it goes |
|---|---|
| Main idol/décor photo | `assets/ganpati-photo.jpg` |
| Gallery photos | `assets/gallery/1.jpg`, `2.jpg`, … up to `galleryCount` in `script.js` |
| Background bhajan/music | `assets/bhajan.mp3` |

Just create an `assets` folder (and `assets/gallery` inside it) next to
`index.html`, and drop your files in with those exact names.

> Note: the `og:image` tag near the top of `index.html` controls the
> preview image WhatsApp shows when you share the link — point it at your
> photo once you've added one.

## 3. Preview it

Double-click `index.html` to open it straight in a browser — no server
needed for a first look.

## 4. Host it free on GitHub Pages

1. Create a new **public** repository on GitHub.
2. Upload `index.html`, `style.css`, `script.js`, and your `assets`
   folder to it (drag-and-drop on the repo's "Add file" page works fine).
3. Go to the repo's **Settings** tab → **Pages** (under "Code and
   automation" in the sidebar).
4. Under **Build and deployment → Source**, choose **Deploy from a
   branch**, set the branch to **main** and the folder to **/ (root)**,
   then **Save**.
5. Your site goes live at `https://<your-username>.github.io/<repo-name>/`
   within a few minutes.

## Free alternatives

If you'd rather skip GitHub entirely:

- **Netlify Drop** (app.netlify.com/drop) — drag the whole folder in, get
  a live link instantly.
- **Cloudflare Pages** or **Vercel** — connect a GitHub repo the same way
  as GitHub Pages, or upload directly.

All of these are free for a small static site like this one.

## About the RSVP button

Since this is a static site with no backend, "Send RSVP" opens WhatsApp
with the guest's details pre-filled so they send it straight to you — it
doesn't store responses anywhere. If you'd rather collect RSVPs in a
spreadsheet, swap that button for a link to a free Google Form instead.
