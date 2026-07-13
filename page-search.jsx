// SEARCH page — one live, type-as-you-go search across every section:
// Writing, Podcast, and Tools. Matches on titles, descriptions,
// and tag/language labels. Filters live with a sticky search box pinned at
// the top; shows a tidy empty state when nothing matches.
(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  const V = window.V3;
  const {
    C, MonoTxt, Header, Footer, PageHero, useTeleport, ensureStyles,
    POSTS, EPISODES, TOOLS, articleHref,
  } = V;

  // ---- Build one flat, searchable index from all three data sources -------
  function buildIndex() {
    const items = [];

    POSTS.forEach((p) => {
      items.push({
        type: "WRITING",
        title: p.title,
        desc: "Article" + (p.tags && p.tags.length ? " · " + p.tags.join(" · ") : ""),
        tags: p.tags || [],
        meta: [p.read, p.date ? p.date.replace(/\./g, "/") : null].filter(Boolean),
        href: articleHref(p.slug),
        external: false,
      });
    });

    EPISODES.forEach((ep) => {
      items.push({
        type: "PODCAST",
        title: ep.title,
        desc: ep.desc || ep.guest || "",
        tags: [ep.guest].filter(Boolean),
        meta: ["EP/" + String(ep.num).padStart(3, "0"), ep.date || null].filter(Boolean),
        href: "Podcast.html",
        external: false,
      });
    });

    TOOLS.forEach((t) => {
      items.push({
        type: "TOOLS",
        title: t.name,
        desc: t.desc || "",
        tags: [t.lang].filter(Boolean),
        meta: [t.lang].filter(Boolean),
        href: t.href,
        external: !!(t.href && /^https?:/i.test(t.href)),
      });
    });

    // Precompute a lowercase haystack per item for fast matching.
    items.forEach((it) => {
      it.haystack = [it.title, it.desc, it.tags.join(" "), it.type].join(" ").toLowerCase();
    });
    return items;
  }

  const GROUPS = [
    { type: "WRITING", no: "01", label: "Writing" },
    { type: "PODCAST", no: "02", label: "Podcast" },
    { type: "TOOLS", no: "03", label: "Tools" },
  ];

  // ---- Highlight matched tokens inside a string --------------------------
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function highlight(text, tokens) {
    if (!tokens.length || !text) return text;
    const re = new RegExp("(" + tokens.map(escapeRe).join("|") + ")", "ig");
    const parts = String(text).split(re);
    return parts.map((part, i) =>
      part && tokens.some((t) => t.toLowerCase() === part.toLowerCase())
        ? <mark className="v3-hl" key={i}>{part}</mark>
        : <React.Fragment key={i}>{part}</React.Fragment>
    );
  }

  function ResultRow({ item, tokens }) {
    const ext = item.external;
    return (
      <a
        className="v3-search-item"
        href={item.href}
        target={ext ? "_blank" : undefined}
        rel={ext ? "noopener noreferrer" : undefined}
      >
        <MonoTxt color={C.green} size={11}>{item.type}</MonoTxt>
        <div style={{ minWidth: 0 }}>
          <div className="v3-search-title">{highlight(item.title, tokens)}</div>
          {item.desc ? <div className="v3-search-desc">{highlight(item.desc, tokens)}</div> : null}
        </div>
        <div className="v3-search-meta">
          {item.meta.map((m, i) => <MonoTxt key={i} color={C.dim} size={11}>{m}</MonoTxt>)}
          <span className="v3-search-arrow">{ext ? "OPEN ↗" : "VIEW →"}</span>
        </div>
      </a>
    );
  }

  function PageSearch() {
    useEffect(ensureStyles, []);
    const { go, TeleportOverlay } = useTeleport("SEARCH");

    const index = useMemo(buildIndex, []);

    // Seed the query from ?q= so searches are shareable / bookmarkable.
    const initialQ = (() => {
      try { return new URLSearchParams(window.location.search).get("q") || ""; }
      catch (e) { return ""; }
    })();
    const [q, setQ] = useState(initialQ);
    const inputRef = useRef(null);

    // Keep the sticky search bar pinned just under the (variable-height) header.
    const [headerH, setHeaderH] = useState(56);
    useEffect(() => {
      const measure = () => {
        const h = document.querySelector(".v3-header");
        if (h) setHeaderH(h.offsetHeight);
      };
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, []);

    // Autofocus the box on load so you can just start typing.
    useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

    // Reflect the query in the URL without adding history entries.
    useEffect(() => {
      try {
        const url = new URL(window.location.href);
        if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
        window.history.replaceState(null, "", url);
      } catch (e) {}
    }, [q]);

    const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = tokens.length
      ? index.filter((it) => tokens.every((t) => it.haystack.includes(t)))
      : index;

    const groups = GROUPS
      .map((g) => ({ ...g, items: filtered.filter((it) => it.type === g.type) }))
      .filter((g) => g.items.length > 0);

    const total = filtered.length;

    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="SEARCH" go={go} />
        <PageHero
          file="FILE/05 — SEARCH"
          title="Search"
          blurb="One box, everything indexed — writing, podcast episodes, projects, and tools. Type to filter live across titles, descriptions, and tags."
        />

        {/* Sticky live-filter bar */}
        <div className="v3-searchbar" style={{ top: headerH }}>
          <div className="v3-search-inputwrap">
            <span className="v3-search-glyph" aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              className="v3-search-input"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search everything…"
              aria-label="Search the site"
              autoComplete="off"
              spellCheck="false"
            />
            {q ? (
              <button className="v3-search-clear" onClick={() => { setQ(""); if (inputRef.current) inputRef.current.focus(); }}>
                CLEAR ✕
              </button>
            ) : null}
          </div>
        </div>

        {/* Status line */}
        <div className="v3-search-status">
          {tokens.length ? (
            <React.Fragment>
              <MonoTxt color={C.green} size={12}>{total} RESULT{total === 1 ? "" : "S"}</MonoTxt>
              <MonoTxt color={C.dim} size={12}>for "{q.trim()}"</MonoTxt>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <MonoTxt color={C.green} size={12}>{total} ENTRIES</MonoTxt>
              <MonoTxt color={C.dim} size={12}>start typing to filter</MonoTxt>
            </React.Fragment>
          )}
        </div>

        {/* Results, grouped by section */}
        {total > 0 ? (
          <div className="v3-search-results">
            {groups.map((g) => (
              <div key={g.type}>
                <div className="v3-secheader">
                  <MonoTxt color={C.green}>§{g.no}</MonoTxt>
                  <div className="v3-secheader-title">{g.label}</div>
                  <span className="v3-secheader-meta"><MonoTxt color={C.dim}>{g.items.length} match{g.items.length === 1 ? "" : "es"}</MonoTxt></span>
                </div>
                {g.items.map((it, i) => <ResultRow key={i} item={it} tokens={tokens} />)}
              </div>
            ))}
          </div>
        ) : (
          <div className="v3-search-empty">
            <div className="v3-search-empty-title">No results for "{q.trim()}"</div>
            <div className="v3-search-empty-body">
              Nothing matched across writing, podcast, projects, or tools. Try a shorter or
              different term — search looks at titles, descriptions, and tag/language labels.
            </div>
            <div style={{ marginTop: 22 }}>
              <button className="v3-search-clear" onClick={() => { setQ(""); if (inputRef.current) inputRef.current.focus(); }}>
                CLEAR SEARCH ✕
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    );
  }

  window.PageSearch = PageSearch;
})();
