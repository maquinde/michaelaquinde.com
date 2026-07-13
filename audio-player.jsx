// Shared functional audio player hook + helpers.
// No real audio file — simulates playback state, progress, seek, volume.
// Exposes useFakeAudio({ duration }) -> { playing, currentTime, toggle, seek, fmt }

(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  // Page-wide registry so starting one player pauses any other that's playing.
  const activePlayers = new Map(); // token -> pause()
  function stopOtherPlayers(token) {
    activePlayers.forEach((pause, key) => { if (key !== token) pause(); });
  }

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function useFakeAudio({ duration = 1800, rate = 1 } = {}) {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const raf = useRef(null);
    const last = useRef(null);
    const tokenRef = useRef();
    if (!tokenRef.current) tokenRef.current = {};

    useEffect(() => {
      const token = tokenRef.current;
      activePlayers.set(token, () => setPlaying(false));
      return () => activePlayers.delete(token);
    }, []);

    useEffect(() => {
      if (!playing) {
        last.current = null;
        return;
      }
      const tick = (ts) => {
        if (last.current == null) last.current = ts;
        const dt = (ts - last.current) / 1000;
        last.current = ts;
        setCurrentTime((t) => {
          const next = t + dt * rate;
          if (next >= duration) {
            setPlaying(false);
            return duration;
          }
          return next;
        });
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf.current);
    }, [playing, duration, rate]);

    const toggle = useCallback(() => {
      if (!playing || currentTime >= duration) stopOtherPlayers(tokenRef.current);
      setPlaying((p) => (currentTime >= duration ? (setCurrentTime(0), true) : !p));
    }, [playing, currentTime, duration]);

    const seek = useCallback(
      (t) => {
        setCurrentTime(Math.max(0, Math.min(duration, t)));
      },
      [duration]
    );

    return { playing, currentTime, duration, toggle, seek, fmt };
  }

  // Real audio backed by an <audio> element. Same shape as useFakeAudio.
  function useRealAudio({ src, duration: fallbackDuration = 0 } = {}) {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(fallbackDuration);
    const elRef = useRef(null);
    const tokenRef = useRef();
    if (!tokenRef.current) tokenRef.current = {};

    if (!elRef.current && typeof Audio !== "undefined") {
      const el = new Audio();
      el.preload = "metadata";
      elRef.current = el;
    }

    useEffect(() => {
      const token = tokenRef.current;
      activePlayers.set(token, () => elRef.current && elRef.current.pause());
      return () => activePlayers.delete(token);
    }, []);

    useEffect(() => {
      const el = elRef.current;
      if (!el) return;
      el.src = src || "";
      const onTime = () => setCurrentTime(el.currentTime);
      const onMeta = () => { if (isFinite(el.duration)) setDuration(el.duration); };
      const onEnd = () => { setPlaying(false); setCurrentTime(0); };
      const onPlay = () => setPlaying(true);
      const onPause = () => setPlaying(false);
      el.addEventListener("timeupdate", onTime);
      el.addEventListener("loadedmetadata", onMeta);
      el.addEventListener("durationchange", onMeta);
      el.addEventListener("ended", onEnd);
      el.addEventListener("play", onPlay);
      el.addEventListener("pause", onPause);
      return () => {
        el.pause();
        el.removeEventListener("timeupdate", onTime);
        el.removeEventListener("loadedmetadata", onMeta);
        el.removeEventListener("durationchange", onMeta);
        el.removeEventListener("ended", onEnd);
        el.removeEventListener("play", onPlay);
        el.removeEventListener("pause", onPause);
      };
    }, [src]);

    const toggle = useCallback(() => {
      const el = elRef.current;
      if (!el) return;
      if (el.paused) {
        stopOtherPlayers(tokenRef.current);
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }, []);

    const seek = useCallback((t) => {
      const el = elRef.current;
      if (!el) return;
      const d = isFinite(el.duration) ? el.duration : duration;
      el.currentTime = Math.max(0, Math.min(d || 0, t));
      setCurrentTime(el.currentTime);
    }, [duration]);

    return { playing, currentTime, duration: duration || fallbackDuration, toggle, seek, fmt };
  }

  // Unified player: real <audio> when `src` is given, else simulated.
  function usePlayer({ src, duration } = {}) {
    const real = useRealAudio({ src: src || "", duration });
    const fake = useFakeAudio({ duration });
    return src ? real : fake;
  }

  // Click on a progress bar element to seek (returns 0..1)
  function seekFromEvent(e) {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  }

  window.useFakeAudio = useFakeAudio;
  window.useRealAudio = useRealAudio;
  window.usePlayer = usePlayer;
  window.fmtTime = fmt;
  window.seekFromEvent = seekFromEvent;
})();
