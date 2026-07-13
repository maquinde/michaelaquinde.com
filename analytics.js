// ============================================================================
//  GOOGLE ANALYTICS (GA4)  —  edit ONE line below, nothing else.
// ----------------------------------------------------------------------------
//  1. Create a GA4 property at https://analytics.google.com/ (Admin → Data
//     streams → Web). Copy its Measurement ID — it looks like "G-ABCD1234XY".
//  2. Paste it between the quotes on the GA_ID line below.
//  3. Commit & push. Every page already loads this file, so analytics turns on
//     site-wide at once. Until a real ID is set, this script does nothing.
// ============================================================================
(function () {
  var GA_ID = "G-XXXXXXXXXX"; // ← paste your GA4 Measurement ID here

  // Not configured yet (still the placeholder, or empty) → stay completely inert.
  if (!GA_ID || GA_ID === "G-XXXXXXXXXX" || GA_ID.indexOf("G-") !== 0) return;

  // Respect a browser "Do Not Track" signal — skip loading analytics.
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  // Standard gtag.js bootstrap.
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
})();
