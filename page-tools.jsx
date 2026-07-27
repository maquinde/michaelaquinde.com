// TOOLS page — GitHub-style grid of small tools / scripts.
(function () {
  const V = window.V3;
  const { C, MonoTxt, Header, Footer, PageHero, useTeleport, TOOLS, TOOL_CATEGORIES, ensureStyles } = V;

  function PageTools() {
    React.useEffect(ensureStyles, []);
    const { go, TeleportOverlay } = useTeleport("TOOLS");

    const groups = TOOL_CATEGORIES
      .map((cat, i) => ({ cat, no: String(i + 1).padStart(2, "0"), items: TOOLS.filter((t) => t.category === cat) }))
      .filter((g) => g.items.length > 0);

    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="TOOLS" go={go} />
        <PageHero
          file="FILE/03 — TOOLS"
          title="Tools"
          blurb="Small, sharp command-line utilities and config I reach for daily. Each does one thing — extract, audit, normalize, or stay out of the way."
        />
        <div className="v3-secheader">
          <MonoTxt color={C.green}>§ALL</MonoTxt>
          <div className="v3-secheader-title">{TOOLS.length} Utilities</div>
          <span className="v3-secheader-meta"><MonoTxt color={C.dim}>OPEN SOURCE</MonoTxt></span>
        </div>
        {groups.map((g) => (
          <React.Fragment key={g.cat}>
            <div className="v3-secheader">
              <MonoTxt color={C.green}>§{g.no}</MonoTxt>
              <div className="v3-secheader-title">{g.cat}</div>
              <span className="v3-secheader-meta"><MonoTxt color={C.dim}>{g.items.length} tool{g.items.length === 1 ? "" : "s"}</MonoTxt></span>
            </div>
            <div className="v3-tools">
              {g.items.map((t) => (
                <a key={t.name} className="v3-tool" href={t.href} target="_blank" rel="noopener noreferrer">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                    <span className="v3-tool-name">{t.name}</span>
                    <MonoTxt color={C.dim}>{t.lang}</MonoTxt>
                  </div>
                  <div style={{ color: C.fgDim, fontSize: 14, marginTop: 10 }}>{t.desc}</div>
                  <div style={{ marginTop: 16 }}><span className="v3-tool-arrow">{t.href && t.href.includes("github.com") ? "VIEW ON GITHUB ↗" : "VIEW PROJECT ↗"}</span></div>
                </a>
              ))}
            </div>
          </React.Fragment>
        ))}
        <Footer />
      </div>
    );
  }

  window.PageTools = PageTools;
})();
