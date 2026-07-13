# How to edit this site

A complete, plain-English guide to adding and changing content in every section:
**Writing, Podcast, Tools, and About.**

This site has **no build step**. The pages are plain HTML files that load a few
`.jsx` scripts in the browser. Almost all of your content lives as simple lists in
one file — **`v3-shared.jsx`** — so "adding a project" really just means adding one
line to a list and saving. You commit, you push, and (on GitHub Pages) the live site
redeploys in about a minute.

> There are two companion guides that go deeper on the two most involved sections:
> **`HOW-TO-ADD-ARTICLES.md`** (Writing) and **`HOW-TO-ADD-EPISODES.md`** (Podcast).
> This document is the overview of *everything* and the single place to start.

---

## Table of contents

1. [How the site is wired (read this once)](#1-how-the-site-is-wired)
2. [Your editing workflow: GitHub + VSCode + Claude Code](#2-your-editing-workflow)
3. [Writing](#3-writing)
4. [Podcast](#4-podcast)
5. [Tools](#5-tools)
6. [About](#6-about)
7. [Search (it's automatic)](#7-search)
8. [Analytics (Google Analytics)](#8-analytics)
9. [Images & files: where things go](#9-images--files)
10. [Common gotchas](#10-common-gotchas)
11. [Quick reference card](#11-quick-reference-card)

---

## 1. How the site is wired

You don't need to be a developer to edit this site, but a 60-second mental model
makes everything else obvious.

**The files, grouped by job:**

| File(s)                         | What it is                                                              |
| ------------------------------- | ----------------------------------------------------------------------- |
| `index.html`, `Writing.html`, `Podcast.html`, `Tools.html`, `About.html`, `Article.html` | The actual pages. You rarely touch these. |
| **`v3-shared.jsx`**             | **The content database.** All the lists — posts, episodes, tools, the About meta table — live here. **This is the file you'll edit most.** |
| `article-bodies.jsx`            | The full text of each Writing article, keyed by slug.                   |
| `page-*.jsx`                    | The layout/markup for each page (e.g. `page-about.jsx`). The bio paragraphs on About live here. |
| `v3-brutalist.jsx`              | Shared visual components used across the site.                          |
| `images/`, `covers/`           | Where your media files live. Podcast audio is hosted on GitHub Releases, not in a folder. |

**The key idea:** in `v3-shared.jsx`, near the top, there are named lists:

```js
const POSTS    = [ … ];   // → Writing
const EPISODES = [ … ];   // → Podcast
const TOOLS    = [ … ];   // → Tools
const ABOUT_META = [ … ]; // → the meta table on About
```

Each item in a list is one card/row on the page. **Add an item → a card appears.
Remove an item → the card disappears.** The pages count and lay out whatever is in
the list automatically, so you never edit HTML to add a project or a tool.

**A few syntax rules that apply everywhere** (they're all in [section 9](#9-common-gotchas)
too, but they matter from the first edit):

- Every item is wrapped in `{ … }` and **ends with a comma**.
- Text values go inside `"double quotes"`.
- If your text contains a straight `"`, escape it: `\"`. Curly quotes `“ ”` and
  apostrophes `’` are fine as-is.
- Keep the commas between fields. A missing comma is the #1 cause of a blank page.

---

## 2. Your editing workflow

Here's the end-to-end loop once the site is in a GitHub repo and you're editing in
VSCode with Claude Code.

### One-time setup
1. **Create a GitHub repo** and push this folder to it.
2. **Turn on GitHub Pages**: repo → *Settings* → *Pages* → *Build and deployment* →
   Source: *Deploy from a branch*, Branch: `main`, folder: `/ (root)`. Save.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.
4. **Clone it locally**: in VSCode, *Source Control* → *Clone Repository*, paste the
   repo URL.

### The everyday loop
1. **Open the folder in VSCode.**
2. **Make your edit** — usually a line in `v3-shared.jsx`. You can ask Claude Code in
   plain English, e.g. *"Add a new tool called RULEDIFF, written in Go, that diffs
   Sigma rules — link it to github.com/me/rulediff"* and it'll edit the right list.
3. **Preview locally before pushing.** Because the pages load `.jsx` over the network,
   don't just double-click the HTML file — serve the folder. Easiest options:
   - VSCode **Live Server** extension → right-click `index.html` → *Open with Live Server*, or
   - a terminal in the folder: `python3 -m http.server 8000` then open
     `http://localhost:8000`.
4. **Commit & push** when it looks right:
   ```bash
   git add -A
   git commit -m "Add RULEDIFF tool"
   git push
   ```
   (Or use VSCode's *Source Control* panel: stage → type a message → *Commit* → *Sync/Push*.)
5. **Wait ~1 minute** and refresh the live URL. Done.

> **Tip — let Claude Code do the mechanical parts.** Point it at this file and the two
> companion guides. It understands the list structure and the field names, so requests
> like *"add an episode"* or *"remove the third project"* are safe and fast. Always
> preview locally before pushing.

---

## 3. Writing

**Where:** the card lives in `POSTS` (`v3-shared.jsx`); the article text lives in
`article-bodies.jsx`. There is **one** `Article.html` that renders any post via
`?p=<slug>` — you never create a new HTML file per article.

**Full details:** see **`HOW-TO-ADD-ARTICLES.md`**. Short version below.

### Step 1 — add the card (newest goes first)
In `v3-shared.jsx`, find `const POSTS = [` and add your entry as the **new first line**:

```js
{ date: "06.20.26", title: "Your article title", tags: ["detection","cloud"], read: "8 min", n: 49, slug: "your-article-slug", cover: "images/your-cover.png" },
```

| Field   | What it does                                       | Notes                                  |
| ------- | -------------------------------------------------- | -------------------------------------- |
| `date`  | Date on the card (shows as MM/DD/YY)               | enter `MM.DD.YY`                       |
| `title` | Headline (card + article page)                     |                                        |
| `tags`  | Small green tag chips                              | array of short strings                 |
| `read`  | Read-time label                                    | free text, e.g. `"8 min"`              |
| `n`     | Big number stamped on the card art                 | next number up; keep unique            |
| `slug`  | URL id + link to the body                          | lowercase-with-hyphens, **must match** the key in `article-bodies.jsx` |
| `cover` | Cover image (optional)                             | omit it and a generated pattern shows instead |

### Step 2 — add the body
In `article-bodies.jsx`, add an entry to `ARTICLES` whose **key is the exact same slug**:

```js
"your-article-slug": {
  dek: "One or two sentences under the headline.",
  body: [
    { t: "p", c: "Opening paragraph." },
    { t: "h", c: "A section heading" },
    { t: "ul", c: ["First point.", "Second point."] },
    { t: "quote", c: "A line worth pulling out." },
    { t: "code", c: "some --command\n  --flag value" },
    { t: "img", src: "images/diagram.png", alt: "…", caption: "Fig 1 — …", wide: true },
    { t: "p", c: "Closing paragraph." },
  ],
},
```

**The one rule:** the `slug` in `POSTS` and the key in `ARTICLES` must match exactly —
that string is the link, and it's the URL (`Article.html?p=your-article-slug`).

---

## 4. Podcast

**Where:** everything is in `v3-shared.jsx` — the `EPISODES` list, plus the `AUDIO`
and `BUY` blocks just above it.

**Full details:** see **`HOW-TO-ADD-EPISODES.md`**. Short version below.

### Step 1 — drop in your files
- **Audio** → upload the `.m4a` as an asset on a **GitHub Release** (repo → *Releases*
  → *Draft a new release* → attach file → publish), then copy its asset URL.
- **Cover image** → the `covers/` folder, e.g. `covers/ep002-my-episode.jpeg`

### Step 2 — register the audio path
In the `AUDIO` block, add a line:

```js
const AUDIO = {
  ep0: "",
  ep1: "",
  ep2: "https://github.com/<user>/<repo>/releases/download/<tag>/ep02-my-episode.m4a",   // ← add this
};
```

(You can paste a URL from any other host/CDN too. Leave it `""` and the
player shows a tidy "AUDIO COMING SOON" state.)

**Optional — book affiliate link** in the `BUY` block:

```js
ep2: "https://www.amazon.com/dp/XXXXXXXXXX?tag=YOUR-AFFILIATE-TAG-20",
```

### Step 3 — add the episode (newest goes first)
Find `const EPISODES = [` and add your episode as the **new first line**. The first
item is automatically the big featured "Latest Episode"; everything below it is the
archive grid.

```js
{ num: 2, title: "Your episode title", guest: "with A. Guest", date: "06.20.26", duration: 0, src: AUDIO.ep2, cover: "covers/ep002-my-episode.jpeg", desc: "Show notes paragraph.", buy: BUY.ep2 },
```

| Field      | What it does                          | Notes                                            |
| ---------- | ------------------------------------- | ------------------------------------------------ |
| `num`      | Episode number (shows as EP/002)      |                                                  |
| `title`    | Episode title                         |                                                  |
| `guest`    | Italic subtitle line                  | use `""` if there's no guest                      |
| `date`     | Date (shows exactly as entered)       | enter `MM.DD.YY`                                  |
| `duration` | **Leave `0`**                         | fills in automatically from the audio file        |
| `src`      | Audio path                            | reference `AUDIO.ep2`, or paste a path directly  |
| `cover`    | Cover image path                      | optional — omit and no image shows               |
| `desc`     | Show-notes paragraph                  | optional — only the featured episode shows it    |
| `buy`      | Amazon affiliate URL                  | optional — reference `BUY.ep2`                   |

**The one rule:** always paste a new episode at the **top** of the list. "Latest"
means *position in the list*, not the `date` — the top item always wins.

---

## 5. Tools

**Where:** the `TOOLS` list in `v3-shared.jsx`. Each item is one card in the
GitHub-style grid, and the whole card links out to the repo.

Find `const TOOLS = [` and add a line:

```js
{ name: "RULEDIFF", desc: "Diffs Sigma rules and flags drift between snapshots.", lang: "GO", href: "https://github.com/maquinde/rulediff" },
```

| Field  | What it does                              | Notes                                        |
| ------ | ----------------------------------------- | -------------------------------------------- |
| `name` | Tool name (card title)                    | uppercase reads best                         |
| `desc` | One-line description                      |                                              |
| `lang` | Small language/type tag (top-right)       | e.g. `"GO"`, `"PYTHON"`, `"DATA"`            |
| `href` | Where the card links                      | full URL; opens in a new tab. Each card shows a "VIEW ON GITHUB ↗" link. |

**To remove a tool**, delete its `{ … }` line. The "N Utilities" count in the header
updates itself.

---

## 6. About

The About page has three editable parts, in two files.

### A) The bio paragraphs — `page-about.jsx`
Open `page-about.jsx` and find the `<div className="v3-about-body">` block. The two
paragraphs of prose are written directly there. Edit the text between the tags. A blank
line between paragraphs is created with `<br/><br/>`:

```jsx
<div className="v3-about-body">
  Your first paragraph of bio text goes here…
  <br/><br/>
  Your second paragraph goes here…
</div>
```

The short blurb under the big "About" title is the `blurb="…"` value on the `PageHero`
just above it — edit that string to change it.

### B) The meta table (FOCUS / STACK / WRITES …) — `v3-shared.jsx`
This is the list of label/value rows on the right. Find `const ABOUT_META = [` and edit,
add, or remove rows. Each row is `["LABEL", "Value"]`:

```js
const ABOUT_META = [
  ["FOCUS","Detection · Cloud · Network"],
  ["STACK","Splunk · Elastic · Sigma · Suricata"],
  ["WRITES","Go · Python · Rust"],
  ["READS","Papers · Postmortems"],
  ["BASED","Pacific Time"],
  ["PGP","0xA1B2 C3D4 E5F6 7890"],
  // ["SPEAKS","English · Spanish"],   // ← add a row like this
];
```

The label (first string) renders in green; the value (second string) in white. The
`·` is just a middle-dot separator you can type or copy.

### C) The portrait — `images/`
The portrait is `images/portrait.png`, referenced in `page-about.jsx`. To swap it,
replace that file (keep the same name and it just works), or put a new file in
`images/` and update the `src` on the `<img className="v3-about-portrait-img" …>` line.
A roughly square image looks best — it's cropped to a square slot.

---

## 7. Search

**There is nothing to maintain here — search builds itself.**

The site has a **Search** page (linked in the top nav) with one box that filters
*live* across every section at once — Writing, Podcast, and Tools. It
matches on **titles, descriptions, and tag/language labels**, highlights the matched
words, groups results by section, and shows a tidy "no results" message when nothing
matches.

### Why you never have to touch it
Search reads the **same lists** you already edit (`POSTS`, `EPISODES`,
`TOOLS` in `v3-shared.jsx`). So the moment you add a tool, post, or episode
using the steps above, it's **automatically searchable** — no separate index to
rebuild, no extra file to update. Add the item, commit, push; it shows up in search
on the next load.

### Good to know
- **The query is in the URL.** Typing puts `?q=…` on the address (e.g.
  `Search.html?q=aws`), so a search is shareable and bookmarkable.
- **Multiple words narrow the results.** `aws python` only matches entries that
  contain *both* words.
- **Where results go:** Writing and Podcast results open inside the site; Tools
  links open the repo in a new tab.
- **The files behind it** (you won't normally open these): `Search.html` and
  `page-search.jsx`. The only reason to touch them would be to change how search
  *looks* or *behaves* — not to add content.

> Want a new section to be searchable later? If it follows the same list pattern,
> tell Claude Code "include the X section in search" and it'll wire the new list into
> `page-search.jsx` the same way the existing three are.

---

## 8. Analytics

The site is wired for **Google Analytics 4 (GA4)** on every page, but it stays
completely **off until you add your Measurement ID** — so there's nothing collecting
data (and nothing that can break) until you flip it on.

### Turning it on — one line, one file
1. Create a GA4 property at **[analytics.google.com](https://analytics.google.com/)**,
   then go to **Admin → Data streams → Web** and copy the **Measurement ID**. It looks
   like `G-ABCD1234XY`.
2. Open **`analytics.js`** and paste it into the single `GA_ID` line:
   ```js
   var GA_ID = "G-ABCD1234XY"; // ← paste your GA4 Measurement ID here
   ```
3. Commit & push. Every page already loads `analytics.js`, so analytics switches on
   **site-wide at once** — you never edit the individual HTML files.

### Why it's safe to leave as-is
- **Placeholder = inert.** While the value is the default `G-XXXXXXXXXX` (or empty),
  the script loads nothing and sends no data. No errors, no stray hits.
- **Respects Do Not Track.** If a visitor's browser sends a "Do Not Track" signal,
  the script skips loading analytics for them.
- **Pageviews are automatic.** Because each page is a full load, GA4 records a
  pageview per page with no extra setup. Navigating between sections just works.

### Good to know
- **One source of truth.** The ID lives only in `analytics.js` — it is *not* repeated
  across the eight HTML files, so there's only ever one place to change it.
- **Verifying it works:** after pushing with a real ID, open the live site, then in
  GA4 check **Reports → Realtime** — you should see yourself as an active user within
  a minute. (It can take 24–48 hours for the standard reports to populate.)
- **Turning it back off:** set `GA_ID` back to `"G-XXXXXXXXXX"` (or `""`) and push.

---

## 9. Images & files

Everything lives in folders next to your HTML files. Reference them with **relative
paths** (no leading slash):

| Folder    | What goes here                          | Referenced as                  |
| --------- | --------------------------------------- | ------------------------------ |
| `images/` | Article images, post covers, portrait   | `images/your-file.png`         |
| `covers/` | Podcast episode cover art               | `covers/ep002-slug.jpeg`       |

Create a folder if it doesn't exist yet. Any common image format works (PNG, JPG, SVG,
WebP). Use PNG for screenshots/diagrams, JPG for photos. **Filenames are case-sensitive
on GitHub Pages** — `Cover.JPG` ≠ `cover.jpg`, so match the case exactly in your path.

**Podcast audio doesn't live in a folder** — `.m4a`/`.mp3` files are too large for a
normal git commit, so they're uploaded as assets on a **GitHub Release** and referenced
by their asset URL in the `AUDIO` block (see [section 4](#4-podcast)).

---

## 10. Common gotchas

- **Blank page after an edit?** It's almost always a syntax slip in the list. Check for:
  a **missing comma** at the end of a line, a **missing closing `"`**, or a missing
  `}` / `]`. Open the browser console (F12 → *Console*) — it usually points at the line.
- **Straight quotes in text** must be escaped: `\"`. Curly quotes `“ ”` and
  apostrophes `’` are fine as-is.
- **`slug` mismatch (Writing):** if the `POSTS` slug and the `ARTICLES` key don't match
  exactly, the card opens a "No such article" page.
- **Episode not featured:** new episodes must go at the **top** of `EPISODES`. The page
  doesn't sort by date — top of the list wins.
- **Image/audio not loading:** check the path is relative (`images/x.png`, not `/images/x.png`)
  and the **case matches** the real filename.
- **Don't double-click HTML files to preview** — serve the folder (Live Server or
  `python3 -m http.server`). Opening the file directly can stop the `.jsx` scripts from loading.
- **Commit small, push often.** One change per commit with a clear message makes it
  easy to undo if something looks off on the live site.

---

## 11. Quick reference card

| I want to add a…  | Edit this file        | Edit this list / place                 | Newest goes… |
| ----------------- | --------------------- | -------------------------------------- | ------------ |
| Writing article   | `v3-shared.jsx` + `article-bodies.jsx` | `POSTS` + `ARTICLES` (slug must match) | **first**    |
| Podcast episode   | `v3-shared.jsx`       | `AUDIO` + (opt.) `BUY` + `EPISODES`    | **first**    |
| Tool              | `v3-shared.jsx`       | `TOOLS`                                | top (manual) |
| About meta row    | `v3-shared.jsx`       | `ABOUT_META`                           | —            |
| About bio text    | `page-about.jsx`      | `<div className="v3-about-body">`      | —            |

> **Search needs no row here** — it indexes the lists above automatically, so
> anything you add is searchable with no extra step.

**Then, every time:**
```bash
git add -A
git commit -m "describe your change"
git push
```
Wait ~1 minute, refresh the live site. That's the whole loop.
