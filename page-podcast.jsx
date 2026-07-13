// PODCAST page — featured episode + full episode log, all with working players.
(function () {
  const V = window.V3;
  const { C, MonoTxt, Header, Footer, PageHero, PodcastPlayer, useTeleport, EPISODES, ensureStyles } = V;

  function PagePodcast() {
    React.useEffect(ensureStyles, []);
    const { go, TeleportOverlay } = useTeleport("PODCAST");
    return (
      <div className="v3-root">
        {TeleportOverlay}
        <Header current="PODCAST" go={go} />
        <PageHero
          file="FILE/02 — PODCAST"
          title="Afterhours"
          blurb="A biweekly conversation about defensive security — detection, on-call, cloud forensics, and the human side of the blue team. Hit play on any episode below."
        />
        <div className="v3-secheader">
          <MonoTxt color={C.green}>§LATEST</MonoTxt>
          <div className="v3-secheader-title">Latest Episode</div>
          <span className="v3-secheader-meta"><MonoTxt color={C.dim}>BIWEEKLY · {EPISODES.length} SHOWN</MonoTxt></span>
        </div>
        <div className="v3-podcast">
          <PodcastPlayer big ep={EPISODES[0]} />
        </div>
        {EPISODES.length > 1 ? (
          <React.Fragment>
            <div className="v3-secheader">
              <MonoTxt color={C.green}>§ARCHIVE</MonoTxt>
              <div className="v3-secheader-title">Episode Archive</div>
              <span className="v3-secheader-meta"><MonoTxt color={C.dim}>NEWEST FIRST</MonoTxt></span>
            </div>
            <div className="v3-podcast">
              <div className="v3-pod-small-grid">
                {EPISODES.slice(1).map((ep) => <PodcastPlayer key={ep.num} ep={ep} />)}
              </div>
            </div>
          </React.Fragment>
        ) : null}
        <Footer />
      </div>
    );
  }

  window.PagePodcast = PagePodcast;
})();
