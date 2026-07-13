# Michael Aquinde — Personal Website

Source for my personal site: writing, a biweekly defensive-security podcast,
tools, and an about page. Built as plain HTML + small `.jsx` scripts with
**no build step** — edit a list, commit, push, and GitHub Pages redeploys in about a
minute.

## ✏️ Editing the site

**Start here → [`HOW-TO-EDIT-THE-SITE.md`](HOW-TO-EDIT-THE-SITE.md)** — the complete,
plain-English guide to adding or changing content in every section (Writing, Podcast,
Tools, About), plus the full GitHub + VSCode + Claude Code workflow.

Two deep-dive companion guides for the more involved sections:

- [`HOW-TO-ADD-ARTICLES.md`](HOW-TO-ADD-ARTICLES.md) — Writing
- [`HOW-TO-ADD-EPISODES.md`](HOW-TO-ADD-EPISODES.md) — Podcast

### The 30-second version
Almost all content lives as simple lists in **`v3-shared.jsx`** (`POSTS`, `EPISODES`,
`TOOLS`, `ABOUT_META`). Add an item to a list → a card appears. Then:

```bash
git add -A
git commit -m "describe your change"
git push
```

Wait ~1 minute, refresh the live site. Done.

> **Previewing locally:** don't double-click the HTML files — serve the folder instead
> (VSCode **Live Server**, or `python3 -m http.server 8000`), or the `.jsx` scripts
> won't load.

## 📁 Project layout

| Path                     | What it is                                                       |
| ------------------------ | --------------------------------------------------------------- |
| `*.html`                 | The pages (Writing, Podcast, Tools, About, Article).             |
| `v3-shared.jsx`          | The content "database" — all the lists. Edited most often.      |
| `article-bodies.jsx`     | Full text of each Writing article, keyed by slug.               |
| `page-*.jsx`             | Per-page layout (e.g. About bio text lives in `page-about.jsx`).|
| `v3-brutalist.jsx`       | Shared visual components.                                        |
| `images/`, `covers/`     | Media files. Podcast audio is hosted on GitHub Releases, not a folder. |
