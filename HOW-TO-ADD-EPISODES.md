# How to add a new podcast episode

Adding an episode means editing **one file — `v3-shared.jsx`** — uploading your
audio to a GitHub Release, and dropping a cover image into a folder. No build step
and no tools required; GitHub Pages serves the site as-is, so you just commit and
push.

---

## The 3-step recipe

### 1. Host your audio, add your cover image
- **Audio** → audio files are too large for a normal git commit, so they're hosted
  as assets on a **GitHub Release** instead of in the repo. On the repo page: *Releases*
  → *Draft a new release* → attach your `.m4a` file → publish. Copy the resulting
  asset URL (looks like `https://github.com/<user>/<repo>/releases/download/<tag>/<file>.m4a`).
- **Cover image** → the `covers/` folder, e.g. `covers/ep033-my-episode.jpeg`.

(You can reuse one Release with multiple episodes' audio attached as assets, or cut
a new Release per episode — either works.)

### 2. Register the audio path
Near the top of `v3-shared.jsx` there's a boxed comment **"AUDIO FILES — UPDATE
THESE WHEN YOU HOST THE SHOW."** Add a line to the `AUDIO` block:

```js
const AUDIO = {
  ep0: "",
  ep33: "https://github.com/<user>/<repo>/releases/download/<tag>/ep33-my-episode.m4a",   // ← add this line
};
```

You can also paste a URL from any other host/CDN instead.

**Optional — Amazon affiliate link.** If the episode is about a book, add a line to
the `BUY` block (the boxed **"BUY LINKS"** comment just below `AUDIO`):

```js
const BUY = {
  ep0: "https://www.amazon.com/dp/1119642787?tag=YOUR-AFFILIATE-TAG-20",
  ep33: "https://www.amazon.com/dp/XXXXXXXXXX?tag=YOUR-AFFILIATE-TAG-20",  // ← add this line
};
```

Replace `YOUR-AFFILIATE-TAG-20` with your real Amazon Associates tag. This becomes a
clickable **"BUY ON AMAZON ↗"** link under the book cover. Leave it out if there's no book.

### 3. Add one line to the EPISODES list
Find `const EPISODES = [` just below. **Newest episode goes first** — the first
item in the list becomes the big "Latest Episode," and everything below it is the
archive. Add your episode as the new first line:

```js
{ num: 33, title: "Your episode title", guest: "with A. Guest", date: "06.18.26", duration: 0, src: AUDIO.ep33, cover: "covers/ep033-my-episode.jpeg", desc: "Your show notes paragraph here…" },
```

Then **commit & push** — GitHub Pages redeploys in about a minute.

---

## How "Latest" vs "Archive" works (it's automatic)

You don't manage these two sections by hand — the page does it for you:

- The **first** item in `EPISODES` is shown as the big **"Latest Episode."**
- **Everything after it** is rendered in the **archive** grid, in list order.
- The episode count in the header updates itself automatically.

So when you paste a new episode at the **top** of the list, it becomes the featured
Latest Episode and the one that used to be first slides down into the archive — no
other edits needed.

> **The one rule:** always paste a new episode at the **top** of the list. If you
> add it lower down, an older episode stays featured.

**Note:** "latest" means *position in the list*, not the `date` field — the page does
**not** sort by date. The top item always wins, whatever its date. This keeps the order
predictable, but it means the order is whatever you type, not auto-sorted by date.

---

## The fields explained

| Field      | What it does                              | Notes                                            |
| ---------- | ----------------------------------------- | ------------------------------------------------ |
| `num`      | Episode number (shows as EP/033)          |                                                  |
| `title`    | Episode title                             |                                                  |
| `guest`    | Italic subtitle line                      | use `""` if there's no guest                     |
| `date`     | Date shown                                | enter `MM.DD.YY` — displays exactly as entered, dots and all |
| `duration` | **Leave `0`**                             | fills in automatically from the real audio file  |
| `src`      | Audio path                                | reference `AUDIO.ep33`, or paste a path directly |
| `cover`    | Cover image path                          | **optional** — omit it and no image shows        |
| `desc`     | Show-notes paragraph                      | **optional** — only the top/featured episode shows it |
| `buy`      | Amazon affiliate URL for the cover        | **optional** — reference `BUY.epNN`; adds a "BUY ON AMAZON ↗" link under the cover |

---

## Two handy shortcuts

- **No cover or notes?** The older episodes use the minimal format — just
  `{ num, title, guest, date, duration }`. Use that when you don't have art or notes.
- **Audio not ready yet?** Leave `src: ""` and the player shows a tidy
  **"AUDIO COMING SOON"** state instead of a broken bar (exactly like EP/000 does now).

---

## One gotcha: quotes inside text

The `title`, `guest`, and `desc` values live inside `"` quotes. If your text
itself contains a double-quote, escape it with a backslash:

```js
desc: "She called it \"detection-as-code\" and never looked back.",
```

Curly quotes (“ ”) and apostrophes (’) are fine as-is — only straight `"` needs escaping.

---

## Copy-paste template

```js
// 1) in the AUDIO block:
epNN: "https://github.com/<user>/<repo>/releases/download/<tag>/epNN-slug.m4a",

// 2) in the BUY block (optional, for book episodes):
epNN: "https://www.amazon.com/dp/XXXXXXXXXX?tag=YOUR-AFFILIATE-TAG-20",

// 3) as the new FIRST line of EPISODES:
{ num: NN, title: "Title here", guest: "with Guest Name", date: "MM.DD.YY", duration: 0, src: AUDIO.epNN, cover: "covers/epNNN-slug.jpeg", desc: "Show notes here.", buy: BUY.epNN },
```
