// WRITING page — full card grid of all posts.
(function () {
  const V = window.V3;
  const { C, MonoTxt, Header, Footer, PageHero, useTeleport, POSTS, ensureStyles, articleHref } = V;

  function PageWriting() {
    React.useEffect(ensureStyles, []);
    const { go, TeleportOverlay } = useTeleport("WRITING");
    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="WRITING" go={go} />
        <PageHero
          file="FILE/01 — WRITING"
          title="Writing"
          blurb="Field notes from the defensive side — detection engineering, cloud hardening, incident response, and the unglamorous operational work that keeps a SOC honest."
        />
        <div className="v3-secheader">
          <MonoTxt color={C.green}>§ALL</MonoTxt>
          <div className="v3-secheader-title">{POSTS.length} Entries</div>
          <span className="v3-secheader-meta"><MonoTxt color={C.dim}>SORTED — NEWEST FIRST</MonoTxt></span>
        </div>
        <div className="v3-writing">
          <div className="v3-writing-grid">
            {POSTS.map((p, i) => (
              <div key={i} className="v3-post" onClick={() => { window.location.href = articleHref(p.slug); }}>
                <div className="v3-post-visual" style={p.cover ? { padding: 0, height: "auto", aspectRatio: "2172 / 724" } : {
                  background: i % 3 === 0
                    ? `repeating-linear-gradient(0deg, ${C.line} 0 1px, transparent 1px 8px)`
                    : i % 3 === 1
                    ? `repeating-linear-gradient(90deg, ${C.line} 0 1px, transparent 1px 12px)`
                    : `radial-gradient(circle at 50% 50%, ${C.green}22, transparent 65%)`,
                }}>
                  {p.cover
                    ? <img className="v3-post-cover" src={p.cover} alt="" />
                    : <span className="v3-post-num">{String(p.n).padStart(2, "0")}</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <MonoTxt color={C.dim}>{p.date}</MonoTxt>
                  <MonoTxt color={C.dim}>{p.read}</MonoTxt>
                </div>
                <div className="v3-post-title">
                  <a className="v3-post-title-link" href={articleHref(p.slug)} onClick={(e) => e.stopPropagation()}>{p.title}</a>
                </div>
                <div className="v3-post-tags">{p.tags.map((t) => <span key={t} className="v3-post-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  window.PageWriting = PageWriting;
})();
