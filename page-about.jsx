// ABOUT page — bio, portrait slot, and meta table.
(function () {
  const V = window.V3;
  const { C, MonoTxt, Header, Footer, PageHero, useTeleport, ABOUT_META, ensureStyles } = V;

  function PageAbout() {
    React.useEffect(ensureStyles, []);
    const { go, TeleportOverlay } = useTeleport("ABOUT");
    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="ABOUT" go={go} />
        <PageHero
          file="FILE/04 — ABOUT"
          title="About"
          blurb="Security engineer, 4+ years defensive. Endpoint monitoring → identity & access → the architecture that connects cloud, identity, and endpoint into one posture."
        />
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
        <Footer />
      </div>
    );
  }

  window.PageAbout = PageAbout;
})();
