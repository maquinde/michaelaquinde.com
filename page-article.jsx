// page-article.jsx — single reading view. Reads ?p=<slug>, renders the matching
// POST (meta from V3.POSTS) + body (from V3_ARTICLES). Falls back to a 404 panel.
(function () {
  const V = window.V3;
  const { C, MONO, DISPLAY, MonoTxt, GridBand, Header, Footer, useTeleport,
          POSTS, NAV, ensureStyles } = V;

  function getSlug() {
    const p = new URLSearchParams(window.location.search).get("p");
    return p ? p.trim() : "";
  }

  const { useState } = React;

  function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
      let ok = false;
      // execCommand path first — works inside sandboxed/cross-origin iframes
      // where the async Clipboard API is often blocked.
      try {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.left = "0";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, code.length);
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) { ok = false; }
      // Also attempt the modern API (no-op if it throws/rejects).
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(() => {}, () => {});
        }
      } catch (e) { /* ignore */ }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    return (
      <div className="v3-article-code">
        <button type="button" className={`v3-code-copy${copied ? " is-copied" : ""}`} onClick={copy} aria-label="Copy code">
          {copied ? "COPIED ✓" : "COPY"}
        </button>
        <pre>{code}</pre>
      </div>
    );
  }

  function Block({ b, onZoom }) {
    switch (b.t) {
      case "h":     return <h2>{b.c}</h2>;
      case "code":  return <CodeBlock code={b.c} />;
      case "quote": return <blockquote className="v3-article-quote">{b.c}</blockquote>;
      case "ul":    return <ul>{b.c.map((li, i) => <li key={i}>{li}</li>)}</ul>;
      case "img":   return (
        <figure className={`v3-article-fig${b.wide ? " v3-article-fig-wide" : ""}`}>
          <img src={b.src} alt={b.alt || ""} loading="lazy" onClick={() => onZoom(b.src, b.alt)} style={{ cursor: "zoom-in" }} />
          {b.caption ? <figcaption>{b.caption}</figcaption> : null}
        </figure>
      );
      case "p":
      default:      return <p>{b.c}</p>;
    }
  }

  function Lightbox({ src, alt, onClose }) {
    if (!src) return null;
    return (
      <div className="v3-lightbox" onClick={onClose}>
        <img src={src} alt={alt || ""} />
      </div>
    );
  }

  function NotFound({ go }) {
    return (
      <div className="v3-root">
        <Header current="WRITING" go={go} />
        <div className="v3-article-404">
          <MonoTxt color={C.green}>ERROR/404 — ENTRY NOT FOUND</MonoTxt>
          <h1 style={{ fontFamily: DISPLAY, textTransform: "uppercase", color: C.fg, fontSize: "clamp(36px,7vw,72px)", lineHeight: 0.92, letterSpacing: "-0.03em", margin: "16px 0 0" }}>
            No such<br/>article<span style={{ color: C.green }}>.</span>
          </h1>
          <p style={{ color: C.fgDim, fontSize: 17, lineHeight: 1.6, maxWidth: 520, marginTop: 22 }}>
            That writing entry doesn't exist or has moved. Head back to the index of everything I've published.
          </p>
          <a className="v3-article-back" style={{ marginTop: 28 }} href="Writing.html">← ALL WRITING</a>
        </div>
        <Footer />
      </div>
    );
  }

  function PageArticle() {
    React.useEffect(ensureStyles, []);
    // Highlight WRITING in the nav, but use a non-nav id for teleport so clicking
    // any nav link (including WRITING) navigates away instead of scrolling in-page.
    const { go, TeleportOverlay } = useTeleport("ARTICLE");
    const [zoom, setZoom] = useState(null);
    const slug = getSlug();
    const post = POSTS.find((p) => p.slug === slug);
    const article = (window.V3_ARTICLES || {})[slug];

    React.useEffect(() => {
      document.title = post ? `${post.title} — Michael Aquinde` : "Not found — Michael Aquinde";
    }, [post]);

    if (!post || !article) return <NotFound go={go} />;

    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="WRITING" go={go} />

        <GridBand lines={12}>
          <div className="v3-article">
            <div className="v3-crumb">
              <a className="v3-article-back" href="Writing.html">← WRITING</a>
              <MonoTxt color={C.dim}>/ ENTRY {String(post.n).padStart(2, "0")}</MonoTxt>
            </div>
            <h1 style={{ fontFamily: DISPLAY, textTransform: "uppercase", color: C.fg, fontSize: "clamp(34px,5.4vw,68px)", lineHeight: 0.96, letterSpacing: "-0.03em", margin: "20px 0 0", maxWidth: 900, textWrap: "balance" }}>
              {post.title}<span style={{ color: C.green }}>.</span>
            </h1>
            {article.dek ? <p className="v3-article-dek">{article.dek}</p> : null}
            <div className="v3-article-meta">
              <MonoTxt color={C.green}>{post.date}</MonoTxt>
              <MonoTxt color={C.dim}>{post.read}</MonoTxt>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {post.tags.map((t) => <span key={t} className="v3-post-tag">{t}</span>)}
              </div>
            </div>
            {post.cover ? (
              <div className="v3-article-cover">
                <img src={post.cover} alt={post.title} loading="lazy" onClick={() => setZoom({ src: post.cover, alt: post.title })} style={{ cursor: "zoom-in" }} />
              </div>
            ) : null}
          </div>
        </GridBand>

        <article className="v3-article-body">
          {article.body.map((b, i) => <Block key={i} b={b} onZoom={(src, alt) => setZoom({ src, alt })} />)}
        </article>

        <Lightbox src={zoom && zoom.src} alt={zoom && zoom.alt} onClose={() => setZoom(null)} />

        <div className="v3-article-foot">
          <a className="v3-article-back" href="Writing.html">← ALL WRITING</a>
          <a className="v3-article-back" href="index.html">INDEX →</a>
        </div>

        <Footer />
      </div>
    );
  }

  window.PageArticle = PageArticle;
})();
