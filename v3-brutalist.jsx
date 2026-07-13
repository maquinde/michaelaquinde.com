// Home / INDEX overview — composes the shared brutalist chrome and shows a
// preview of each section. Section headers deep-link to the dedicated pages.
(function () {
  const V = window.V3;
  const { C, MonoTxt, GridBand, SectionHeader, PodcastPlayer, Header, Footer, useTeleport,
          POSTS, EPISODES, TOOLS, ABOUT_META, NAV, ensureStyles, articleHref } = V;

  const hrefFor = (id) => NAV.find((n) => n.id === id).href;

  function V3Brutalist() {
    React.useEffect(ensureStyles, []);
    const { go, jump, TeleportOverlay } = useTeleport("INDEX");

    // A "VIEW ALL" link that routes through the teleport transition.
    const viewAll = (id) => ({
      href: hrefFor(id),
      onClick: (e) => { e.preventDefault(); go(NAV.find((n) => n.id === id)); },
    });

    const posts = POSTS.slice(0, 6);

    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="INDEX" go={go} jump={jump} />

        {/* HERO */}
        <GridBand lines={12}>
          <div className="v3-hero">
            <div className="v3-hero-grid">
              <div>
                <MonoTxt color={C.green}>FILE/00 — IDENT</MonoTxt>
                <h1>Michael<br/>Aquinde<span style={{ color: C.green }}>.</span></h1>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "baseline", marginTop: 28, borderTop: `1px solid ${C.line}`, paddingTop: 20 }}>
                  <MonoTxt color={C.green}>ROLE</MonoTxt>
                  <div className="v3-hero-role">Security Engineer — Cloud Security, Identity & Access, Endpoint Detection</div>
                </div>
              </div>
              <div className="v3-hero-stats">
                <MonoTxt color={C.dim}>// LIVE STATS</MonoTxt>
                <div style={{ marginTop: 18, display: "grid", rowGap: 18 }}>
                  {[["POSTS",String(POSTS.length)],["EPISODES",String(EPISODES.length)],["TOOLS",String(TOOLS.length)]].map(([k, v]) => (
                    <div key={k}>
                      <MonoTxt color={C.dim}>{k}</MonoTxt>
                      <div className="v3-hero-stat-num">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GridBand>

        {/* WRITING preview */}
        <section id="sec-WRITING" className="v3-section">
          <SectionHeader no="01" title="Writing" viewAll={viewAll("WRITING")} />
          <div className="v3-writing">
            <div className="v3-writing-grid">
              {posts.map((p, i) => (
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
        </section>

        {/* PODCAST preview */}
        <section id="sec-PODCAST" className="v3-section">
          <SectionHeader no="02" title="Podcast — Afterhours" viewAll={viewAll("PODCAST")} />
          <div className="v3-podcast">
            <PodcastPlayer big ep={EPISODES[0]} />
            <div className="v3-pod-small-grid">
              {EPISODES.slice(1, 4).map((ep) => <PodcastPlayer key={ep.num} ep={ep} />)}
            </div>
          </div>
        </section>

        {/* TOOLS preview */}
        <section id="sec-TOOLS" className="v3-section">
          <SectionHeader no="03" title="Tools" viewAll={viewAll("TOOLS")} />
          <div className="v3-tools">
            {TOOLS.map((t) => (
              <div key={t.name} className="v3-tool">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <span className="v3-tool-name">{t.name}</span>
                  <MonoTxt color={C.dim}>{t.lang}</MonoTxt>
                </div>
                <div style={{ color: C.fgDim, fontSize: 14, marginTop: 10 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT preview */}
        <section id="sec-ABOUT" className="v3-section">
          <SectionHeader no="04" title="About" viewAll={viewAll("ABOUT")} />
          <div className="v3-about">
            <div className="v3-about-portrait">
              <svg className="v3-about-portrait-silhouette" viewBox="0 0 200 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
                <circle cx="100" cy="72" r="46" />
                <path d="M100 128c-54 0-92 34-92 84v28h184v-28c0-50-38-84-92-84z" />
              </svg>
            </div>
            <div className="v3-about-body">
              I'm Michael, a Security Engineer who builds and defends enterprise security architectures across cloud,
              identity, and endpoint domains.
              <br/><br/>
              For the past 4+ years, I've worked across the full security stack: AWS cloud security, identity and access
              management, endpoint detection and response, and data protection. My specialty is designing systems that
              reduce risk without slowing the business down.
              <br/><br/>
              Outside of work: rock climbing, boxing, and tinkering with AI tools.
            </div>
            <div className="v3-about-meta">
              {ABOUT_META.map(([k, v]) => (
                <div key={k} className="v3-meta-row">
                  <MonoTxt color={C.green}>{k}</MonoTxt>
                  <MonoTxt color={C.fg} size={12}>{v}</MonoTxt>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  window.V3Brutalist = V3Brutalist;
})();
