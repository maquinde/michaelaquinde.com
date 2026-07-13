# How to add a new article

Each writing entry has two parts that live in two files:

1. **The card** (title, date, tags, read-time, slug) → `v3-shared.jsx`, in the `POSTS` list.
2. **The article body** (dek + the actual prose) → `article-bodies.jsx`, keyed by the slug.

There's a **single article page** (`Article.html`) that reads `?p=<slug>` from the URL
and renders whichever post matches. You never create a new `.html` file per article —
you just add data. No build step; commit and push and GitHub Pages redeploys in about a minute.

---

## The 2-step recipe

### 1. Add the card to `POSTS`
Near the top of `v3-shared.jsx` find `const POSTS = [`. **Newest goes first** — the
list order is the order shown on the Index and Writing pages. Add your entry as the new
first line:

```js
{ date: "06.18.26", title: "Your article title", tags: ["detection","cloud"], read: "8 min", n: 48, slug: "your-article-slug" },
```

### 2. Add the body to `article-bodies.jsx`
Open `article-bodies.jsx` and add an entry to the `ARTICLES` object whose **key is the
exact same `slug`** you used above:

```js
"your-article-slug": {
  dek: "One or two sentences that sit under the headline and set up the piece.",
  body: [
    { t: "p", c: "Your opening paragraph." },
    { t: "h", c: "A section heading" },
    { t: "p", c: "More prose." },
  ],
},
```

Then **commit & push.** The card on the Index/Writing pages now links straight to the
full article at `Article.html?p=your-article-slug`.

> **The one rule that ties it together:** the `slug` in `POSTS` and the key in
> `ARTICLES` must match **exactly**. That string is the link between the card and the
> body — and it's what appears in the URL. If they don't match, the card opens a clean
> "No such article" 404 page.

---

## The card fields (`POSTS`)

| Field   | What it does                                  | Notes                                              |
| ------- | --------------------------------------------- | -------------------------------------------------- |
| `date`  | Date shown on the card (displays as MM/DD/YY) | enter `MM.DD.YY` or `MM/DD/YY`                      |
| `title` | The headline (card + article page)            |                                                    |
| `tags`  | Small green tag chips                         | array of short strings, e.g. `["detection","k8s"]` |
| `read`  | Read-time label                               | free text, e.g. `"8 min"`                          |
| `n`     | The big number stamped on the card art        | use the next number up; keep them unique           |
| `slug`  | URL id + link to the body                     | lowercase-with-hyphens, no spaces                  |

**Picking a slug:** keep it short, lowercase, hyphenated, and unique — e.g.
`hardening-eks`, `slow-dns-exfil`. It becomes the public URL (`Article.html?p=hardening-eks`),
so it's worth making it readable.

---

## Writing the body — the block types

The `body` is an **array of blocks**, rendered top to bottom. Each block is an object
with a type `t` and its content. These are the available types:

```js
// Paragraph
{ t: "p", c: "Plain body text." },

// Section heading (renders with a green § prefix, automatically)
{ t: "h", c: "Start with connection regularity" },

// Bulleted list (green → bullets) — c is an ARRAY of strings
{ t: "ul", c: ["First point.", "Second point.", "Third point."] },

// Pull-quote (big, green left rule)
{ t: "quote", c: "A beacon you can explain is just software." },

// Code / monospace block (line breaks with \n; preserves spacing)
{ t: "code", c: "filter eventName = \"CreateUser\"\n  and userIdentity.type = \"AssumedRole\"" },

// Image (see the next section)
{ t: "img", src: "images/diagram.png", alt: "…", caption: "Fig 1 — …", wide: true },
```

Mix and match in any order — that ordering *is* the article layout.

---

## Adding images

**1. Put the file in the `images/` folder** (it sits next to your `.html` files —
create it if it's missing), e.g. `images/my-diagram.png`.

**2. Add an `img` block** wherever you want it in the `body` array:

```js
{ t: "img",
  src: "images/my-diagram.png",   // path to the file (required)
  alt: "Short description",        // for screen readers (recommended)
  caption: "Fig 1 — what it shows",// small mono caption below (optional)
  wide: true },                    // break out wider than the text (optional)
```

| Field     | What it does                                              | Notes                       |
| --------- | -------------------------------------------------------- | --------------------------- |
| `src`     | Path to the image file                                   | **required**                |
| `alt`     | Accessibility description                                 | recommended                 |
| `caption` | Small uppercase mono caption under the image             | optional — omit for none    |
| `wide`    | Image spans a wider band (~1040px) past the text column  | optional — great for diagrams/screenshots; leave off to keep it at text width |

Images get the brutalist border automatically and lazy-load, so you can use several
without slowing the page. Any format works (PNG, JPG, SVG, WebP) — PNG for
screenshots/diagrams, JPG for photos. There's a live example in the **"Hunting
beaconing in a noisy SOC"** article (`slug: "hunting-beaconing"`) you can copy from.

---

## One gotcha: quotes and line breaks inside text

All the `c`, `dek`, `caption`, and `alt` values live inside `"` quotes. If your text
contains a straight double-quote, escape it with a backslash:

```js
{ t: "p", c: "She called it \"detection-as-code\" and never looked back." },
```

Curly quotes (“ ”) and apostrophes (’) are fine as-is. Inside `code` blocks, use `\n`
to start a new line.

---

## Copy-paste template

```js
// 1) New FIRST line of POSTS in v3-shared.jsx:
{ date: "MM.DD.YY", title: "Title here", tags: ["tag1","tag2"], read: "N min", n: NN, slug: "your-slug" },

// 2) New entry in ARTICLES in article-bodies.jsx (key === slug):
"your-slug": {
  dek: "One- or two-sentence standfirst under the headline.",
  body: [
    { t: "p", c: "Opening paragraph." },
    { t: "h", c: "First section" },
    { t: "p", c: "Prose." },
    { t: "ul", c: ["Point one.", "Point two."] },
    { t: "img", src: "images/your-image.png", alt: "…", caption: "Fig 1 — …", wide: true },
    { t: "quote", c: "A line worth pulling out." },
    { t: "code", c: "some --command\n  --flag value" },
    { t: "p", c: "Closing paragraph." },
  ],
},
```
