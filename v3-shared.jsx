// v3-shared.jsx — shared brutalist chrome, data, and components for all pages.
// Exposes everything on window.V3 so each Babel-scoped page can destructure it.
(function () {
  const { useState, useEffect, useRef } = React;

  const C = {
    bg: "#0a0a0a",
    fg: "#f0f0f0",
    fgDim: "#9e9e9e",
    dim: "#5a5a5a",
    line: "#2a2a2a",
    lineSoft: "#1a1a1a",
    green: "#00ff66",
  };

  const DISPLAY = '"Archivo Black","Arial Black",sans-serif';
  const SANS = '"Archivo","Inter",ui-sans-serif,system-ui,sans-serif';
  const MONO = '"JetBrains Mono","IBM Plex Mono",ui-monospace,Menlo,monospace';

  // Each nav item points at a real page file. INDEX is the home overview.
  const NAV = [
    { id: "INDEX",    href: "index.html" },
    { id: "WRITING",  href: "Writing.html" },
    { id: "PODCAST",  href: "Podcast.html" },
    { id: "TOOLS",    href: "Tools.html" },
    { id: "ABOUT",    href: "About.html" },
    { id: "SEARCH",   href: "Search.html" },
  ];

  // ---- Data -------------------------------------------------------------
  const POSTS = [
    { date: "07.11.26", title: "flaws2.cloud Walkthrough, Level 1: Leaked Credentials and Open S3 Buckets", tags: ["aws","cloud-security","ctf","s3","iam","offensive-security"], read: "7 min", n: 4, slug: "flaws2-level1", cover: "images/flaws2-level1-cover.png" },
    { date: "07.04.26", title: "Identity Management on AWS: Building a Secure Login System with Amazon Cognito", tags: ["aws","cloud-security","cognito","iam","oidc","mfa"], read: "10 min", n: 3, slug: "identity-management-cognito", cover: "images/identity-management-cognito-cover.png" },
    { date: "07.04.26", title: "Building a Secure Serverless Website on AWS: S3, CloudFront, WAF, and IAM", tags: ["aws","cloud-security","s3","cloudfront","waf","iam"], read: "9 min", n: 2, slug: "secure-serverless-website", cover: "images/secure-serverless-website-cover.png" },
    { date: "06.20.26", title: "Build a Virtual Private Cloud", tags: ["cloud","aws","networking"], read: "10 min", n: 1, slug: "build-a-vpc", cover: "images/build-a-vpc-cover.png" },
  ];

  // Article permalink — a single Article.html reads ?p=<slug> and renders the post.
  const articleHref = (slug) => `Article.html?p=${encodeURIComponent(slug)}`;
  // ╔══════════════════════════════════════════════════════════════════╗
  // ║  AUDIO FILES — UPDATE THESE WHEN YOU HOST THE SHOW                  ║
  // ║                                                                    ║
  // ║  Audio files are too large for a normal git commit, so they're     ║
  // ║  hosted as assets on a GitHub Release instead of in this repo.     ║
  // ║  Upload the .m4a to a Release, then paste its asset URL here:      ║
  // ║      "https://github.com/<user>/<repo>/releases/download/         ║
  // ║        <tag>/<file>.m4a"                                           ║
  // ║  …or paste a URL to any other host/CDN.                            ║
  // ║                                                                    ║
  // ║  Leave the value as "" (empty string) and the player shows an      ║
  // ║  "AUDIO COMING SOON" state instead of a broken 0:00 / 0:00 bar.    ║
  // ╚══════════════════════════════════════════════════════════════════╝
  const AUDIO = {
    ep0: "https://github.com/maquinde/michaelaquinde.com/releases/download/podcast-audio/Security_Engineering.m4a",
    ep1: "https://github.com/maquinde/michaelaquinde.com/releases/download/podcast-audio/Zero_Trust_Networks.m4a",
    // ep33: "https://github.com/maquinde/michaelaquinde.com/releases/download/podcast-audio/ep33-my-episode.m4a",  // ← next episode: uncomment & set path
  };

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║  BUY LINKS — Amazon affiliate URLs for episode book covers         ║
  // ║  Paste your tagged affiliate link, e.g.                            ║
  // ║      "https://www.amazon.com/dp/1119642787?tag=YOURTAG-20"         ║
  // ║  Leave "" and the cover simply isn't clickable.                    ║
  // ╚══════════════════════════════════════════════════════════════════╝
  const BUY = {
    ep0: "https://www.amazon.com/dp/1119642787?tag=YOUR-AFFILIATE-TAG-20", // ← replace with your affiliate link
    ep1: "https://www.amazon.com/dp/1492096598?tag=YOUR-AFFILIATE-TAG-20", // ← replace with your affiliate link
  };

  const EPISODES = [
    // ── NEXT EPISODE: copy this line, fill in the blanks, uncomment ──────────
    // { num: 33, title: "Title here", guest: "with Guest Name", date: "MM.DD.YY", duration: 0, src: AUDIO.ep33, cover: "covers/ep033-slug.jpeg", desc: "Show notes paragraph here." },
    // ────────────────────────────────────────────────────────────────────────
    { num: 1, title: "Zero Trust Networks: Building Secure Systems in Untrusted Networks (2nd Edition)", guest: "NotebookLM Speaker", date: "06.06.26", duration: 0, src: AUDIO.ep1, cover: "covers/ep001-zero-trust-networks.jpg", desc: "Authors Razi Rais, Christina Morillo, Evan Gilman, and Doug Barth present the zero trust security model, a paradigm shift that discards traditional perimeter-based defenses in favor of an \"always assume breach\" and \"never trust but always verify\" approach. The book provides practical guidance on building secure systems through in-depth explanations of trust engines, context-aware agents, and real-world case studies to help organizations navigate fundamentally untrusted networks.", buy: BUY.ep1 },
    { num: 0, title: "Security Engineering: A Guide to Building Dependable Distributed Systems Third Edition", guest: "NotebookLM Speaker", date: "06.03.26", duration: 0, src: AUDIO.ep0, cover: "covers/ep000-security-engineering.jpeg", desc: "Ross Anderson’s Security Engineering (Third Edition) provides a comprehensive framework for designing systems that remain robust against malice, error, and mischance. The text emphasizes that modern security requires a cross-disciplinary approach, integrating technical tools like cryptography with human factors such as psychology and economics. By examining diverse environments—including banking, military operations, and healthcare—the author illustrates how protection strategies must evolve alongside technology. A central theme is the analysis framework, which balances policy, mechanism, assurance, and incentives to move beyond \"security theatre\" toward genuine resilience. The book specifically addresses the growing convergence of safety and security as software becomes embedded in critical physical infrastructure. Ultimately, these sources serve as a foundational guide for engineers to anticipate and mitigate adversarial thinking in an increasingly interconnected world.", buy: BUY.ep0 },
  ];

  const TOOLS = [
    { name: "AWS SECURITY ARSENAL", desc: "Curated list of AWS security tools — offensive, defensive, audit, DFIR, and continuous monitoring.", lang: "REF", href: "https://github.com/toniblyx/my-arsenal-of-aws-security-tools" },
    { name: "RITA", desc: "Real Intelligence Threat Analytics — ingests Zeek logs to hunt C2 beaconing and DNS tunneling.", lang: "GO", href: "https://github.com/activecm/rita" },
    { name: "METERPRETER", desc: "Metasploit's in-memory, post-exploitation payload for interactive control of a target host.", lang: "REF", href: "https://github.com/rapid7/metasploit-framework/wiki/Meterpreter" },
    { name: "APPLOCKER BYPASS LIST", desc: "Reference list of known AppLocker bypass techniques and execution methods.", lang: "REF", href: "https://github.com/api0cradle/UltimateAppLockerByPassList" },
    { name: "OTHER TOOLS CHEATSHEET", desc: "dafthack's reference list of additional offensive-security tools, within CloudPentestCheatsheets.", lang: "REF", href: "https://github.com/dafthack/CloudPentestCheatsheets/blob/master/cheatsheets/OtherTools.md" },
    { name: "GITLEAKS", desc: "Detects and prevents hardcoded secrets — passwords, API keys, tokens — in Git repos.", lang: "GO", href: "https://github.com/zricethezav/gitleaks" },
    { name: "CLOUD_ENUM", desc: "Multi-cloud OSINT tool that enumerates public resources across AWS, Azure, and Google Cloud.", lang: "PYTHON", href: "https://github.com/initstring/cloud_enum" },
    { name: "PROWLER", desc: "Open-source security tool for AWS, Azure, GCP, and Kubernetes — assessments, audits, and compliance.", lang: "PYTHON", href: "https://github.com/prowler-cloud/prowler" },
    { name: "CLOUDFOX", desc: "Finds exploitable attack paths in cloud infrastructure (AWS, Azure) for offensive assessments.", lang: "GO", href: "https://github.com/BishopFox/cloudfox" },
    { name: "SCOUTSUITE", desc: "Multi-cloud security-auditing tool (AWS, Azure, GCP) that reports misconfigurations in one dashboard.", lang: "PYTHON", href: "https://github.com/nccgroup/ScoutSuite" },
    { name: "AZVIZ", desc: "PowerShell module that generates topology diagrams of Azure resources and their relationships.", lang: "POWERSHELL", href: "https://github.com/PrateekKumarSingh/AzViz" },
    { name: "CLOUDMAPPER", desc: "Analyzes AWS environments — visualizes network topology and audits for misconfigurations.", lang: "PYTHON", href: "https://github.com/duo-labs/cloudmapper" },
    { name: "PACU", desc: "AWS exploitation framework for testing the security of Amazon Web Services environments.", lang: "PYTHON", href: "https://github.com/RhinoSecurityLabs/pacu" },
    { name: "CLOUDPENTESTCHEATSHEETS", desc: "Cheatsheets for penetration testing across AWS, Azure, and GCP environments.", lang: "REF", href: "https://github.com/dafthack/CloudPentestCheatsheets/" },
    { name: "RESPONDER-WINDOWS", desc: "Windows build of Responder — an LLMNR/NBT-NS/mDNS poisoner for capturing network credentials.", lang: "PYTHON", href: "https://github.com/lgandx/Responder-Windows" },
    { name: "LOLBAS", desc: "Curated catalog of legitimate Windows binaries, scripts, and libraries that attackers can abuse.", lang: "REF", href: "https://lolbas-project.github.io/" },
    { name: "DEFENDERCHECK", desc: "Identifies which bytes in a binary Microsoft Defender flags as malicious to pinpoint AV signatures.", lang: "C#", href: "https://github.com/matterpreter/DefenderCheck" },
    { name: "SSRF-TESTING", desc: "Reference collection of SSRF payloads, tricks, and filter-bypass techniques.", lang: "PAYLOADS", href: "https://github.com/cujanovic/SSRF-Testing" },
    { name: "BASICBLOBFINDER", desc: "Hunts for public Azure storage containers and blobs using a wordlist of account/container names.", lang: "PYTHON", href: "https://github.com/joswr1ght/basicblobfinder" },
    { name: "GCPBUCKETBRUTE", desc: "Enumerates Google Cloud Storage buckets, checks access, and flags privilege-escalation paths.", lang: "PYTHON", href: "https://github.com/RhinoSecurityLabs/GCPBucketBrute" },
    { name: "DPAT", desc: "Domain Password Audit Tool — generates password-strength stats from cracked hashes and an AD dump.", lang: "PYTHON", href: "https://github.com/clr2of8/DPAT" },
    { name: "HASHCAT", desc: "The world's fastest password-recovery tool — GPU-accelerated cracking across hundreds of hash types.", lang: "C", href: "https://github.com/hashcat" },
    { name: "IMPACKET", desc: "Python classes for working with network protocols (SMB, MSRPC, Kerberos) — staple AD tooling.", lang: "PYTHON", href: "https://github.com/fortra/impacket" },
    { name: "MFASWEEP (FORK)", desc: "joswr1ght's PowerShell fork of MFASweep — checks Microsoft services for gaps in MFA enforcement.", lang: "POWERSHELL", href: "https://github.com/joswr1ght/MFASweep" },
    { name: "MFASWEEP", desc: "Checks a set of credentials against multiple Microsoft services to find where MFA isn't enforced.", lang: "POWERSHELL", href: "https://github.com/dafthack/MFASweep" },
    { name: "FIREPROX", desc: "Creates AWS API Gateway pass-through proxies that rotate the source IP per request.", lang: "PYTHON", href: "https://github.com/ustayready/fireprox" },
    { name: "MSOLSPRAY (PYTHON)", desc: "Python rewrite of MSOLSpray — password-spraying against Microsoft Online (Azure AD / O365).", lang: "PYTHON", href: "https://github.com/joswr1ght/MSOLSpray" },
    { name: "PACK", desc: "Password Analysis and Cracking Kit — analyzes password dumps and builds hashcat masks and rules.", lang: "PYTHON", href: "https://github.com/iphelix/pack/" },
    { name: "THC-HYDRA", desc: "Fast network login cracker supporting many protocols for brute-force and dictionary attacks.", lang: "C", href: "https://github.com/vanhauser-thc/thc-hydra" },
    { name: "HAYABUSA-RULES", desc: "Sigma-based detection rule set that powers the Hayabusa event-log hunting tool.", lang: "RULES", href: "https://github.com/Yamato-Security/hayabusa-rules" },
    { name: "SIGMA", desc: "Generic, vendor-agnostic signature format for writing SIEM detection rules in YAML.", lang: "RULES", href: "https://github.com/SigmaHQ/sigma" },
    { name: "HAYABUSA", desc: "Fast Windows event-log forensics and threat-hunting tool that builds timelines with Sigma rules.", lang: "RUST", href: "https://github.com/Yamato-Security/hayabusa" },
    { name: "DOMAINPASSWORDSPRAY", desc: "PowerShell tool for password-spraying against Active Directory domain users.", lang: "POWERSHELL", href: "https://github.com/dafthack/DomainPasswordSpray" },
    { name: "SMBEAGLE", desc: "Audits SMB file shares, hunting for readable/writable files across a network to surface exposure.", lang: "C#", href: "https://github.com/punk-security/SMBeagle" },
    { name: "EYEWITNESS", desc: "Captures screenshots of websites, RDP, and VNC services and gathers header info for recon.", lang: "PYTHON", href: "https://github.com/RedSiege/EyeWitness" },
    { name: "TLS-SCAN", desc: "Fast TLS/SSL scanner that collects X.509 certificate and cipher details from servers.", lang: "C", href: "https://github.com/prbinu/tls-scan" },
    { name: "MASSCAN", desc: "Internet-scale TCP port scanner — extremely fast, can scan the whole Internet in minutes.", lang: "C", href: "https://github.com/robertdavidgraham/masscan" },
    { name: "JQ", desc: "Lightweight command-line JSON processor — slice, filter, and transform JSON.", lang: "C", href: "https://github.com/jqlang/jq" },
    { name: "AADINTERNALS", desc: "PowerShell toolkit for administering, exploring, and attacking Azure AD / Microsoft 365.", lang: "POWERSHELL", href: "https://github.com/Gerenios/AADInternals" },
    { name: "CEWL", desc: "Custom wordlist generator — spiders a target site to build wordlists for password cracking.", lang: "RUBY", href: "https://github.com/digininja/CeWL" },
    { name: "WINPMEM", desc: "Windows physical-memory acquisition tool for forensic RAM capture.", lang: "C/C++", href: "https://github.com/Velocidex/WinPmem" },
    { name: "EZ TOOLS", desc: "Eric Zimmerman's suite of Windows digital-forensics & incident-response utilities.", lang: "DFIR", href: "https://ericzimmerman.github.io/" },
    { name: "CYBERCHEF", desc: "GCHQ's \"Cyber Swiss Army Knife\" — web app for encoding, encryption, and data analysis.", lang: "JS", href: "https://github.com/gchq/CyberChef" },
    { name: "ANSIBLE LOCKDOWN", desc: "Collection of Ansible roles that harden systems to CIS and STIG benchmarks.", lang: "ANSIBLE", href: "https://github.com/ansible-lockdown" },
    { name: "MSOLSPRAY", desc: "Password-spraying tool for Microsoft Online (Azure AD / O365) with detailed auth feedback.", lang: "POWERSHELL", href: "https://github.com/dafthack/MSOLSpray" },
    { name: "CORE RULE SET", desc: "OWASP generic attack-detection rules for ModSecurity and compatible WAFs.", lang: "RULES", href: "https://github.com/coreruleset/coreruleset" },
    { name: "DNSTWIST", desc: "Domain permutation engine for detecting typosquatting, phishing, and brand impersonation.", lang: "PYTHON", href: "https://github.com/elceef/dnstwist" },
    { name: "S3SCANNER", desc: "Simple scanner that tests a list of S3 bucket names for public exposure.", lang: "SHELL", href: "https://github.com/ryananicholson/s3scanner" },
    { name: "ATT&CK NAVIGATOR", desc: "Web tool for exploring and annotating the MITRE ATT&CK matrix — coverage, gaps, layers.", lang: "WEB", href: "https://mitre-attack.github.io/attack-navigator/" },
    { name: "THREAT DRAGON", desc: "OWASP threat-modeling tool for diagramming systems and recording threats.", lang: "JS", href: "https://github.com/OWASP/threat-dragon" },
    { name: "ZAP BASELINE SCAN", desc: "OWASP ZAP GitHub Action — quick passive scan of a web app in CI, no active attacks.", lang: "ACTION", href: "https://github.com/marketplace/actions/zap-baseline-scan" },
    { name: "ZAP FULL SCAN", desc: "OWASP ZAP GitHub Action — runs a full dynamic security scan against a web app in CI.", lang: "ACTION", href: "https://github.com/marketplace/actions/zap-full-scan" },
    { name: "CREDENTIAL-REPORT-PARSER", desc: "Parses AWS IAM credential reports to flag stale or misconfigured user accounts.", lang: "PYTHON", href: "https://github.com/ryananicholson/credential-report-parser" },
    { name: "BFG REPO-CLEANER", desc: "Strips large or sensitive files out of Git history, fast.", lang: "SCALA", href: "https://github.com/rtyley/bfg-repo-cleaner" },
    { name: "GIT-SECRETS", desc: "Scans commits to stop AWS credentials and secrets from being committed.", lang: "SHELL", href: "https://github.com/awslabs/git-secrets" },
    { name: "IAMLIVE", desc: "Generates least-privilege AWS IAM policies by watching your API calls live.", lang: "GO", href: "https://github.com/iann0036/iamlive" },
    { name: "SECLISTS", desc: "Security tester's companion — wordlists & payloads.", lang: "DATA", href: "https://github.com/danielmiessler/seclists" },
  ];

  const ABOUT_META = [
    ["FOCUS","Cloud Security · Identity & Access · Endpoint Detection"],
    ["WRITES","Detection Playbooks · Architecture Docs"],
    ["READS","Postmortems · Threat Intel"],
  ];

  // ---- Styles -----------------------------------------------------------
  function ensureStyles() {
    if (document.getElementById("v3b-styles")) return;
    const el = document.createElement("style");
    el.id = "v3b-styles";
    el.textContent = `
:root{
  --v3-pad:36px;
  --v3-bg:${C.bg}; --v3-fg:${C.fg}; --v3-dim:${C.dim};
  --v3-line:${C.line}; --v3-line-soft:${C.lineSoft};
  --v3-green:${C.green};
}
.v3-root{background:var(--v3-bg);color:var(--v3-fg);font-family:${SANS};min-height:100vh;}
.v3-mono{font-family:${MONO};letter-spacing:1px;text-transform:uppercase;}
.v3-disp{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.4px;}
.v3-section{scroll-margin-top:64px;}
a.v3-bare{color:inherit;text-decoration:none;}

/* Header — sticky */
.v3-header{position:sticky;top:0;z-index:50;background:rgba(10,10,10,0.92);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;padding:16px var(--v3-pad);border-bottom:1px solid var(--v3-line);}
.v3-navlink{background:none;border:none;padding:0;cursor:pointer;font:inherit;color:inherit;text-decoration:none;}
.v3-navlink:hover .v3-mono{color:var(--v3-green) !important;}
.v3-header .v3-nav{display:flex;gap:28px;justify-content:center;flex-wrap:wrap;}
.v3-header .v3-coords{justify-self:end;}
.v3-burger{display:none;background:none;border:1px solid var(--v3-line);color:var(--v3-fg);cursor:pointer;padding:8px 12px;font-family:${MONO};font-size:12px;letter-spacing:1px;justify-self:end;}
.v3-mobnav{display:none;}
@media (max-width: 900px){
  .v3-header{grid-template-columns:1fr auto;}
  .v3-header .v3-nav{display:none;}
  .v3-burger{display:block;}
  .v3-mobnav.open{display:flex;flex-direction:column;position:sticky;top:64px;z-index:49;background:var(--v3-bg);border-bottom:1px solid var(--v3-line);}
  .v3-mobnav.open .v3-navlink{padding:16px var(--v3-pad);border-top:1px solid var(--v3-line);text-align:left;}
}

/* Hero */
.v3-hero{padding:clamp(28px,6vw,48px) var(--v3-pad) clamp(36px,6vw,56px);border-bottom:1px solid var(--v3-line);position:relative;}
.v3-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,280px);gap:clamp(28px,5vw,56px);align-items:end;}
.v3-hero h1{font-family:${DISPLAY};text-transform:uppercase;color:var(--v3-fg);
  font-size:clamp(56px,12vw,138px);line-height:0.88;letter-spacing:-0.03em;margin:24px 0 0;}
.v3-hero-role{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.4px;color:var(--v3-fg);
  font-size:clamp(18px,2.4vw,28px);}
.v3-hero-stats{border-left:1px solid var(--v3-line);padding-left:24px;}
.v3-hero-stat-num{font-family:${DISPLAY};color:var(--v3-green);line-height:1;margin-top:4px;font-size:clamp(36px,4vw,48px);}
@media (max-width: 1024px){
  .v3-hero-grid{grid-template-columns:1fr;align-items:start;}
  .v3-hero-stats{border-left:none;border-top:1px solid var(--v3-line);padding-left:0;padding-top:20px;margin-top:8px;
    display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
}
@media (max-width: 520px){ .v3-hero-stats{grid-template-columns:repeat(2,1fr);} }

/* Page hero (sub-pages) */
.v3-pagehero{padding:clamp(28px,5vw,44px) var(--v3-pad) clamp(28px,4vw,40px);border-bottom:1px solid var(--v3-line);}
.v3-pagehero h1{font-family:${DISPLAY};text-transform:uppercase;color:var(--v3-fg);
  font-size:clamp(48px,9vw,104px);line-height:0.9;letter-spacing:-0.03em;margin:18px 0 0;}
.v3-pagehero-blurb{color:${C.fgDim};font-size:clamp(15px,1.5vw,18px);line-height:1.55;max-width:620px;margin-top:22px;}
.v3-crumb{display:flex;gap:12px;align-items:center;}

/* Section header */
.v3-secheader{border-top:2px solid var(--v3-fg);border-bottom:1px solid var(--v3-line);
  padding:20px var(--v3-pad);display:grid;grid-template-columns:120px 1fr auto;gap:24px;align-items:center;}
.v3-secheader-title{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.5px;color:var(--v3-fg);
  font-size:clamp(20px,2.6vw,28px);}
.v3-viewall{background:none;border:1px solid var(--v3-green);color:var(--v3-green);cursor:pointer;
  font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:8px 14px;text-decoration:none;white-space:nowrap;}
.v3-viewall:hover{background:var(--v3-green);color:${C.bg};}
@media (max-width: 600px){ .v3-secheader{grid-template-columns:auto 1fr;} .v3-secheader-meta{display:none;} }

/* About */
.v3-about{padding:40px var(--v3-pad) 60px;display:grid;grid-template-columns:200px 1fr 1fr;gap:36px;border-bottom:1px solid var(--v3-line);}
.v3-about-portrait{aspect-ratio:1;border:1px solid var(--v3-line);position:relative;overflow:hidden;
  background:repeating-linear-gradient(45deg,${C.line} 0 6px,transparent 6px 12px);}
.v3-about-portrait-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
.v3-about-portrait-label{position:absolute;inset:0;display:flex;align-items:flex-end;padding:12px;}
.v3-about-portrait-silhouette{position:absolute;inset:0;width:100%;height:100%;fill:${C.line};}
.v3-about-body{font-size:clamp(15px,1.4vw,18px);line-height:1.55;color:var(--v3-fg);}
.v3-about-meta{border-left:1px solid var(--v3-line);padding-left:24px;display:grid;row-gap:10px;align-content:start;}
.v3-meta-row{display:grid;grid-template-columns:90px 1fr;gap:12px;border-bottom:1px dashed var(--v3-line);padding-bottom:10px;}
@media (max-width: 1000px){
  .v3-about{grid-template-columns:160px 1fr;}
  .v3-about-meta{grid-column:1 / -1;border-left:none;border-top:1px solid var(--v3-line);padding-left:0;padding-top:20px;}
}
@media (max-width: 600px){
  .v3-about{grid-template-columns:1fr;gap:24px;padding:32px var(--v3-pad) 40px;}
  .v3-about-portrait{max-width:200px;}
}

/* Writing grid */
.v3-writing{padding:36px var(--v3-pad) 64px;border-bottom:1px solid var(--v3-line);}
.v3-writing-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--v3-line);border-left:1px solid var(--v3-line);}
.v3-post{border-right:1px solid var(--v3-line);border-bottom:1px solid var(--v3-line);padding:24px;cursor:pointer;background:var(--v3-bg);transition:background 120ms;}
.v3-post:hover{background:#101010;}
.v3-post-visual{height:160px;margin-bottom:22px;border:1px solid var(--v3-line);position:relative;
  display:flex;align-items:flex-end;justify-content:flex-end;padding:12px;}
.v3-post-num{font-family:${DISPLAY};font-size:64px;color:var(--v3-green);line-height:0.8;}
.v3-post-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#0d1b3a;}
.v3-post-title{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.4px;color:var(--v3-fg);
  font-size:clamp(18px,1.9vw,22px);line-height:1.1;min-height:72px;}
.v3-post-title-link{text-decoration:none;color:inherit;display:inline;transition:color 120ms;}
.v3-post-title-link:hover{color:var(--v3-green);}
.v3-post-tags{margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;}
.v3-post-tag{border:1px solid var(--v3-green);color:var(--v3-green);padding:3px 8px;
  font-family:${MONO};font-size:10px;letter-spacing:1px;text-transform:uppercase;}
@media (max-width: 1000px){ .v3-writing-grid{grid-template-columns:repeat(2,1fr);} }
@media (max-width: 600px){ .v3-writing-grid{grid-template-columns:1fr;} .v3-post-visual{height:140px;} }

/* Article (reading view) */
.v3-article{padding:clamp(28px,4vw,44px) var(--v3-pad) 0;}
.v3-article-meta{display:flex;gap:18px;flex-wrap:wrap;align-items:center;margin-top:20px;
  padding-top:18px;border-top:1px solid var(--v3-line);}
.v3-article-dek{max-width:680px;font-size:clamp(17px,1.8vw,21px);line-height:1.5;color:${C.fgDim};
  margin:24px 0 0;text-wrap:pretty;}
.v3-article-cover{margin-top:28px;border:1px solid var(--v3-line);background:${C.bg};overflow:hidden;}
.v3-article-cover img{display:block;width:100%;height:auto;}
.v3-lightbox{position:fixed;inset:0;z-index:999;background:rgba(0,0,0,0.88);
  display:flex;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;}
.v3-lightbox img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,0.5);}
.v3-article-body{max-width:680px;padding:clamp(32px,4vw,48px) var(--v3-pad) clamp(48px,6vw,72px);}
.v3-article-body p{font-size:clamp(16px,1.55vw,18px);line-height:1.7;color:var(--v3-fg);
  margin:0 0 22px;text-wrap:pretty;}
.v3-article-body h2{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.3px;
  font-size:clamp(20px,2.4vw,28px);line-height:1.1;color:var(--v3-fg);margin:42px 0 18px;}
.v3-article-body h2::before{content:"§ ";color:var(--v3-green);}
.v3-article-body ul{margin:0 0 24px;padding:0;list-style:none;}
.v3-article-body li{position:relative;padding-left:24px;margin-bottom:12px;
  font-size:clamp(15px,1.5vw,17px);line-height:1.6;color:var(--v3-fg);text-wrap:pretty;}
.v3-article-body li::before{content:"→";position:absolute;left:0;color:var(--v3-green);
  font-family:${MONO};}
.v3-article-code{background:var(--v3-line-soft);border:1px solid var(--v3-line);border-left:2px solid var(--v3-green);
  padding:18px 20px;margin:0 0 26px;overflow-x:auto;position:relative;}
.v3-code-copy{position:absolute;top:8px;right:8px;z-index:1;background:${C.bg};color:${C.fgDim};
  border:1px solid var(--v3-line);font-family:${MONO};font-size:10px;letter-spacing:1px;text-transform:uppercase;
  padding:5px 9px;cursor:pointer;opacity:0;transition:opacity 120ms,color 120ms,border-color 120ms;}
.v3-article-code:hover .v3-code-copy,.v3-code-copy:focus-visible{opacity:1;}
.v3-code-copy:hover{color:${C.green};border-color:${C.green};}
.v3-code-copy.is-copied{opacity:1;color:${C.green};border-color:${C.green};}
@media (hover: none){ .v3-code-copy{opacity:1;} }
.v3-article-code pre{margin:0;font-family:${MONO};font-size:13px;line-height:1.55;color:#cfe9d8;
  white-space:pre;}
.v3-article-quote{margin:0 0 28px;padding:6px 0 6px 24px;border-left:2px solid var(--v3-green);
  font-family:${DISPLAY};text-transform:none;font-size:clamp(19px,2.2vw,24px);line-height:1.3;
  color:var(--v3-fg);letter-spacing:-0.3px;text-wrap:pretty;}
.v3-article-fig{margin:8px 0 30px;}
.v3-article-fig img{display:block;width:100%;height:auto;border:1px solid var(--v3-line);}
.v3-article-fig figcaption{margin-top:10px;font-family:${MONO};font-size:11px;letter-spacing:0.5px;
  text-transform:uppercase;color:${C.dim};}
/* wide images keep their LEFT edge flush with the text and extend rightward */
.v3-article-fig-wide{width:min(1040px, calc(100vw - 2 * var(--v3-pad)));max-width:none;}
@media (max-width: 720px){ .v3-article-fig-wide{width:100%;} }
.v3-article-foot{max-width:680px;margin:0 var(--v3-pad);padding:26px 0 0;border-top:1px solid var(--v3-line);
  display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.v3-article-back{display:inline-flex;align-items:center;gap:8px;text-decoration:none;
  font-family:${MONO};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.fgDim};
  transition:color 120ms;}
.v3-article-back:hover{color:var(--v3-green);}
.v3-article-404{max-width:680px;padding:60px var(--v3-pad) 80px;}

/* Project rows */
.v3-projects{padding:0 var(--v3-pad) 56px;border-bottom:1px solid var(--v3-line);}
.v3-project-row{display:grid;grid-template-columns:80px 280px 1fr 100px 100px;gap:24px;padding:28px 0;
  border-top:1px solid var(--v3-line);align-items:baseline;text-decoration:none;transition:background 0.15s,padding 0.15s;}
.v3-project-row:first-child{border-top:none;}
.v3-gh-link{transition:color 0.15s;}
.v3-gh-link:hover, .v3-gh-link:hover *{color:var(--v3-green) !important;}
a.v3-project-row{cursor:pointer;}
a.v3-project-row:hover{background:var(--v3-line);padding-left:16px;padding-right:16px;}
a.v3-project-row:hover .v3-project-name{color:var(--v3-green);}
.v3-project-no{font-family:${DISPLAY};color:var(--v3-green);line-height:1;font-size:clamp(28px,3vw,36px);}
.v3-project-name{font-family:${DISPLAY};color:var(--v3-fg);letter-spacing:-0.6px;font-size:clamp(22px,2.5vw,32px);}
.v3-project-desc{color:${C.fgDim};font-size:15px;line-height:1.5;}
@media (max-width: 1000px){
  .v3-project-row{grid-template-columns:60px 1fr auto;grid-template-areas:"no name stars" "no desc stars" "no stack stars";row-gap:8px;column-gap:18px;}
  .v3-project-row > :nth-child(1){grid-area:no;}
  .v3-project-row > :nth-child(2){grid-area:name;}
  .v3-project-row > :nth-child(3){grid-area:desc;}
  .v3-project-row > :nth-child(4){grid-area:stack;}
  .v3-project-row > :nth-child(5){grid-area:stars;}
}
@media (max-width: 520px){
  .v3-project-row{grid-template-columns:1fr;grid-template-areas:"no" "name" "desc" "stack" "stars";}
}

/* Podcast */
.v3-podcast{padding:36px var(--v3-pad) 64px;border-bottom:1px solid var(--v3-line);}
.v3-pod-small-grid{margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
@media (max-width: 1000px){ .v3-pod-small-grid{grid-template-columns:repeat(2,1fr);} }
@media (max-width: 600px){ .v3-pod-small-grid{grid-template-columns:1fr;} }
.v3-pod-card{border:1px solid var(--v3-line);padding:22px;background:var(--v3-bg);}
.v3-pod-card.v3-pod-big{padding:28px;}
.v3-pod-title{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.4px;color:var(--v3-fg);line-height:1.08;}
.v3-pod-title.small{font-size:clamp(18px,2vw,22px);}
.v3-pod-title.big{font-size:clamp(24px,3vw,32px);}
.v3-pod-controls{margin-top:22px;display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;}
.v3-pod-desc-row{margin-top:16px;display:flex;gap:28px;align-items:flex-start;}
.v3-cover-wrap{flex:none;display:flex;flex-direction:column;gap:10px;align-items:center;}
.v3-cover-sm{margin-top:0;align-items:flex-start;}
.v3-cover-img-sm{width:92px;height:auto;display:block;}
.v3-pod-sm-head{margin-top:0;display:flex;gap:18px;align-items:flex-start;justify-content:space-between;}
.v3-pod-sm-text{min-width:0;flex:1;}
.v3-notes{margin-top:18px;border-top:1px solid var(--v3-line-soft);padding-top:14px;}
.v3-notes-toggle{background:none;border:none;padding:0;cursor:pointer;display:inline-flex;}
.v3-notes-toggle:hover .v3-mono{color:var(--v3-fg) !important;}
.v3-buy-link{text-decoration:none;border-bottom:1px solid var(--v3-line);padding-bottom:2px;transition:color .15s;}
.v3-buy-link:hover .v3-mono{color:var(--v3-green) !important;}
@media (max-width: 640px){ .v3-pod-desc-row{flex-direction:column-reverse;align-items:stretch;} .v3-pod-desc-row .v3-cover-wrap{align-self:flex-start;} }
@media (max-width: 480px){ .v3-pod-controls{grid-template-columns:auto 1fr;} .v3-pod-controls > :nth-child(3){grid-column:1 / -1;text-align:right;} }

/* Tools */
.v3-tools{padding:36px var(--v3-pad) 56px;border-bottom:1px solid var(--v3-line);
  display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--v3-line);border-left:1px solid var(--v3-line);}
.v3-tool{padding:28px;border-right:1px solid var(--v3-line);border-bottom:1px solid var(--v3-line);background:var(--v3-bg);display:block;text-decoration:none;color:inherit;transition:background 120ms;}
a.v3-tool{cursor:pointer;}
a.v3-tool:hover{background:#101010;}
a.v3-tool:hover .v3-tool-name{text-decoration:underline;text-underline-offset:4px;}
.v3-tool-arrow{font-family:${MONO};font-size:12px;color:${C.dim};opacity:0;transition:opacity 120ms,color 120ms;}
a.v3-tool:hover .v3-tool-arrow{opacity:1;color:${C.green};}
.v3-tool-name{font-family:${DISPLAY};color:var(--v3-green);letter-spacing:-0.6px;font-size:clamp(22px,2.5vw,28px);}
@media (max-width: 600px){ .v3-tools{grid-template-columns:1fr;} .v3-tool{padding:22px;} }

/* Search */
.v3-searchbar{position:sticky;z-index:40;background:rgba(10,10,10,0.95);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  border-bottom:1px solid var(--v3-line);padding:18px var(--v3-pad);}
.v3-search-inputwrap{display:flex;align-items:center;gap:16px;border:1px solid var(--v3-line);background:var(--v3-bg);
  padding:0 18px;transition:border-color .15s;}
.v3-search-inputwrap:focus-within{border-color:var(--v3-green);}
.v3-search-glyph{font-family:${MONO};color:var(--v3-green);font-size:20px;line-height:1;flex:none;}
.v3-search-input{flex:1;min-width:0;background:none;border:none;outline:none;color:var(--v3-fg);font-family:${SANS};
  font-size:clamp(16px,2.2vw,22px);padding:15px 0;}
.v3-search-input::placeholder{color:#3d3d3d;}
.v3-search-clear{background:none;border:1px solid var(--v3-line);color:var(--v3-dim);cursor:pointer;flex:none;
  font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:7px 10px;transition:color .12s,border-color .12s;}
.v3-search-clear:hover{color:var(--v3-fg);border-color:var(--v3-fg);}
.v3-search-status{padding:16px var(--v3-pad);border-bottom:1px solid var(--v3-line);
  display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;}
.v3-search-results{padding-bottom:40px;}
.v3-search-item{display:grid;grid-template-columns:128px 1fr auto;gap:22px;align-items:baseline;
  padding:20px var(--v3-pad);border-bottom:1px solid var(--v3-line);text-decoration:none;color:inherit;
  transition:background .12s,padding .12s;}
.v3-search-item:hover{background:#101010;}
.v3-search-item:hover .v3-search-title{color:var(--v3-green);}
.v3-search-title{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.4px;color:var(--v3-fg);
  font-size:clamp(18px,2vw,24px);line-height:1.05;transition:color .12s;}
.v3-search-desc{color:${C.fgDim};font-size:14px;line-height:1.5;margin-top:8px;text-wrap:pretty;}
.v3-search-meta{justify-self:end;text-align:right;display:flex;flex-direction:column;gap:6px;align-items:flex-end;white-space:nowrap;}
.v3-search-arrow{font-family:${MONO};font-size:12px;color:${C.dim};opacity:0;transition:opacity .12s,color .12s;}
.v3-search-item:hover .v3-search-arrow{opacity:1;color:${C.green};}
.v3-hl{background:rgba(0,255,102,0.18);color:inherit;border-radius:1px;}
.v3-search-empty{padding:56px var(--v3-pad) 72px;max-width:640px;}
.v3-search-empty-title{font-family:${DISPLAY};text-transform:uppercase;letter-spacing:-0.4px;color:var(--v3-fg);
  font-size:clamp(22px,3vw,30px);line-height:1.1;}
.v3-search-empty-body{color:${C.fgDim};font-size:15px;line-height:1.6;margin-top:16px;text-wrap:pretty;}
@media (max-width: 700px){
  .v3-search-item{grid-template-columns:1fr;row-gap:10px;}
  .v3-search-meta{justify-self:start;text-align:left;flex-direction:row;gap:14px;align-items:baseline;flex-wrap:wrap;}
  .v3-search-arrow{display:none;}
}

/* Footer */
.v3-footer{padding:28px var(--v3-pad);display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;}
@media (max-width: 600px){ .v3-footer{grid-template-columns:1fr;} }

/* Teleport overlay — three modes: scroll (in+out), out (close+hold), in (open) */
.v3-tp{position:fixed;inset:0;z-index:999;pointer-events:none;}
.v3-tp-bar{position:absolute;left:0;right:0;height:50%;background:var(--v3-green);}
.v3-tp-bar.top{top:0;}
.v3-tp-bar.bot{bottom:0;}
.v3-tp-bar.top::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--v3-fg);box-shadow:0 0 12px var(--v3-green);}
.v3-tp-bar.bot::after{content:'';position:absolute;left:0;right:0;top:-2px;height:2px;background:var(--v3-fg);box-shadow:0 0 12px var(--v3-green);}
.v3-tp.scroll .v3-tp-bar.top{transform:translateY(-100%);animation:v3-tp-top 700ms cubic-bezier(.7,0,.2,1) forwards;}
.v3-tp.scroll .v3-tp-bar.bot{transform:translateY(100%);animation:v3-tp-bot 700ms cubic-bezier(.7,0,.2,1) forwards;}
.v3-tp.out .v3-tp-bar.top{transform:translateY(-100%);animation:v3-close-top 380ms cubic-bezier(.7,0,.2,1) forwards;}
.v3-tp.out .v3-tp-bar.bot{transform:translateY(100%);animation:v3-close-bot 380ms cubic-bezier(.7,0,.2,1) forwards;}
.v3-tp.in .v3-tp-bar.top{transform:translateY(0);animation:v3-open-top 540ms cubic-bezier(.7,0,.2,1) forwards;}
.v3-tp.in .v3-tp-bar.bot{transform:translateY(0);animation:v3-open-bot 540ms cubic-bezier(.7,0,.2,1) forwards;}
.v3-tp-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;
  font-family:${MONO};font-size:clamp(14px,2vw,18px);letter-spacing:3px;text-transform:uppercase;
  color:${C.bg};background:${C.fg};padding:14px 22px;white-space:nowrap;}
.v3-tp-label::before{content:'>>> ';color:${C.bg};}
.v3-tp.scroll .v3-tp-label{opacity:0;animation:v3-tp-label-io 700ms steps(1,end) forwards;}
.v3-tp.out .v3-tp-label{opacity:0;animation:v3-tp-label-in 380ms steps(1,end) forwards;}
.v3-tp.in .v3-tp-label{opacity:1;animation:v3-tp-label-out 540ms steps(1,end) forwards;}
.v3-tp-scan{position:absolute;left:0;right:0;height:2px;background:var(--v3-green);box-shadow:0 0 16px var(--v3-green);top:0;}
.v3-tp.scroll .v3-tp-scan,.v3-tp.out .v3-tp-scan{animation:v3-tp-scan 700ms linear forwards;}
.v3-tp.in .v3-tp-scan{display:none;}
@keyframes v3-tp-top { 0%{transform:translateY(-100%);} 38%,55%{transform:translateY(0);} 100%{transform:translateY(-100%);} }
@keyframes v3-tp-bot { 0%{transform:translateY(100%);} 38%,55%{transform:translateY(0);} 100%{transform:translateY(100%);} }
@keyframes v3-close-top { from{transform:translateY(-100%);} to{transform:translateY(0);} }
@keyframes v3-close-bot { from{transform:translateY(100%);} to{transform:translateY(0);} }
@keyframes v3-open-top { from{transform:translateY(0);} to{transform:translateY(-100%);} }
@keyframes v3-open-bot { from{transform:translateY(0);} to{transform:translateY(100%);} }
@keyframes v3-tp-label-io { 0%,30%{opacity:0;} 38%,55%{opacity:1;} 60%,100%{opacity:0;} }
@keyframes v3-tp-label-in { 0%,40%{opacity:0;} 55%,100%{opacity:1;} }
@keyframes v3-tp-label-out { 0%,45%{opacity:1;} 70%,100%{opacity:0;} }
@keyframes v3-tp-scan { 0%{top:-2px;opacity:1;} 100%{top:100%;opacity:1;} }

.v3-arrived{animation:v3-arrive 900ms ease-out;}
@keyframes v3-arrive {
  0%{box-shadow:inset 0 0 0 2px var(--v3-green),inset 0 80px 120px -40px ${C.green}55;}
  60%{box-shadow:inset 0 0 0 2px var(--v3-green),inset 0 80px 120px -40px ${C.green}22;}
  100%{box-shadow:inset 0 0 0 0 transparent,inset 0 0 0 0 transparent;}
}

@media (prefers-reduced-motion: reduce){ .v3-tp{display:none !important;} .v3-arrived{animation:none;} }

/* Buttons */
.v3-playbtn{width:52px;height:52px;border:none;cursor:pointer;font-family:${MONO};font-size:18px;font-weight:700;color:${C.bg};}
.v3-progress{height:8px;background:${C.lineSoft};cursor:pointer;position:relative;border:1px solid ${C.line};}
.v3-progress-fill{position:absolute;top:0;bottom:0;left:0;background:${C.green};}
.v3-progress-ticks{position:absolute;inset:0;display:flex;justify-content:space-between;}
.v3-progress-ticks span{width:1px;background:${C.line};}
`;
    document.head.appendChild(el);
  }

  // ---- Primitives -------------------------------------------------------
  function MonoTxt({ children, color = C.fgDim, size = 11 }) {
    return <span className="v3-mono" style={{ fontSize: size, color }}>{children}</span>;
  }

  function GridBand({ children, lines = 12 }) {
    return (
      <div style={{ position: "relative", borderTop: `1px solid ${C.line}` }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent calc(100%/${lines} - 1px), ${C.lineSoft} calc(100%/${lines} - 1px), ${C.lineSoft} calc(100%/${lines}))`,
        }} />
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    );
  }

  function SectionHeader({ no, title, meta, viewAll }) {
    return (
      <div className="v3-secheader">
        <MonoTxt color={C.green}>§{no}</MonoTxt>
        <div className="v3-secheader-title">{title}</div>
        {viewAll
          ? <a className="v3-viewall" href={viewAll.href} onClick={viewAll.onClick}>{viewAll.label || "VIEW ALL →"}</a>
          : <span className="v3-secheader-meta"><MonoTxt color={C.dim}>{meta}</MonoTxt></span>}
      </div>
    );
  }

  function PodcastPlayer({ ep, big = false }) {
    const a = usePlayer({ src: ep.src, duration: ep.duration });
    const [showNotes, setShowNotes] = useState(false);
    const pct = (a.currentTime / a.duration) * 100;
    return (
      <div className={`v3-pod-card${big ? " v3-pod-big" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <MonoTxt color={C.green}>EP/{String(ep.num).padStart(3, "0")}</MonoTxt>
          <MonoTxt color={C.dim}>{ep.date}</MonoTxt>
        </div>
        {!big && ep.cover ? (
          <div className="v3-pod-sm-head">
            <div className="v3-pod-sm-text">
              <div className="v3-pod-title small">{ep.title}</div>
              <div style={{ color: C.fgDim, fontFamily: SANS, fontSize: 13, marginTop: 10, fontStyle: "italic" }}>{ep.guest}</div>
            </div>
            <div className="v3-cover-wrap v3-cover-sm">
              {ep.buy ? (
                <a href={ep.buy} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "block" }}>
                  <img src={ep.cover} alt={`${ep.title} — book cover`} className="v3-cover-img-sm" style={{ border: `1px solid ${C.line}` }} />
                </a>
              ) : (
                <img src={ep.cover} alt={`${ep.title} — book cover`} className="v3-cover-img-sm" style={{ border: `1px solid ${C.line}` }} />
              )}
              {ep.buy ? (
                <a className="v3-buy-link" href={ep.buy} target="_blank" rel="noopener noreferrer sponsored">
                  <MonoTxt color={C.fgDim} size={12}>BUY ON AMAZON ↗</MonoTxt>
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className={`v3-pod-title ${big ? "big" : "small"}`}>{ep.title}</div>
            <div style={{ color: C.fgDim, fontFamily: SANS, fontSize: 13, marginTop: 10, fontStyle: "italic" }}>{ep.guest}</div>
            {big && ep.desc ? (
              <div className="v3-pod-desc-row">
                <p style={{ color: C.fgDim, fontFamily: SANS, fontSize: 14, lineHeight: 1.6, margin: 0, textWrap: "pretty" }}>{ep.desc}</p>
                {ep.cover ? (
                  <div className="v3-cover-wrap">
                    {ep.buy ? (
                      <a href={ep.buy} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "block", flex: "none" }}>
                        <img src={ep.cover} alt={`${ep.title} — book cover`} style={{ width: "200px", height: "auto", display: "block", border: `1px solid ${C.line}` }} />
                      </a>
                    ) : (
                      <img src={ep.cover} alt={`${ep.title} — book cover`} style={{ width: "200px", height: "auto", display: "block", border: `1px solid ${C.line}`, flex: "none" }} />
                    )}
                    {ep.buy ? (
                      <a className="v3-buy-link" href={ep.buy} target="_blank" rel="noopener noreferrer sponsored">
                        <MonoTxt color={C.fgDim} size={12}>BUY ON AMAZON ↗</MonoTxt>
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </React.Fragment>
        )}
        <div className="v3-pod-controls">
          {(ep.src || ep.duration > 0) ? (
            <React.Fragment>
              <button onClick={a.toggle} className="v3-playbtn" style={{ background: a.playing ? C.green : C.fg }}>
                {a.playing ? "❚❚" : "▶"}
              </button>
              <div onClick={(e) => a.seek(seekFromEvent(e) * a.duration)} className="v3-progress">
                <div className="v3-progress-fill" style={{ width: `${pct}%` }} />
                <div className="v3-progress-ticks">{Array.from({ length: 11 }).map((_, i) => <span key={i} />)}</div>
              </div>
              <MonoTxt color={C.fg}>{fmtTime(a.currentTime)} / {fmtTime(a.duration)}</MonoTxt>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button className="v3-playbtn" disabled style={{ background: C.line, color: C.dim, cursor: "not-allowed" }}>▶</button>
              <div className="v3-progress" style={{ opacity: 0.4 }}>
                <div className="v3-progress-fill" style={{ width: "0%" }} />
                <div className="v3-progress-ticks">{Array.from({ length: 11 }).map((_, i) => <span key={i} />)}</div>
              </div>
              <MonoTxt color={C.dim}>AUDIO COMING SOON</MonoTxt>
            </React.Fragment>
          )}
        </div>
        {!big && ep.desc ? (
          <div className="v3-notes">
            <button className="v3-notes-toggle" onClick={() => setShowNotes((v) => !v)} aria-expanded={showNotes}>
              <MonoTxt color={C.green} size={12}>{showNotes ? "HIDE NOTES ↑" : "SHOW NOTES ↓"}</MonoTxt>
            </button>
            {showNotes ? (
              <p className="v3-notes-body" style={{ color: C.fgDim, fontFamily: SANS, fontSize: 13, lineHeight: 1.6, margin: "12px 0 0", textWrap: "pretty" }}>{ep.desc}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  // ---- Teleport navigation ---------------------------------------------
  // Returns { teleport, go, TeleportOverlay } — `go(item)` either scrolls to top
  // (same page) or plays the close animation and navigates to item.href.
  function useTeleport(current) {
    const [teleport, setTeleport] = useState(null); // { id, mode }
    const navigatingRef = useRef(false);

    // Arrival: if we got here via a teleport, play the "open" (retract) overlay.
    useEffect(() => {
      const inId = sessionStorage.getItem("v3-tp-in");
      if (inId) {
        sessionStorage.removeItem("v3-tp-in");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          setTeleport({ id: inId, mode: "in" });
          window.setTimeout(() => setTeleport(null), 560);
        }
      }
    }, []);

    // In-page jump: scroll to the section with id `sec-<ID>` (or to the top
    // for INDEX), masked behind the teleport "scroll" overlay.
    const jump = React.useCallback((item) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = item.id === "INDEX" ? null : document.getElementById("sec-" + item.id);
      const doScroll = () => {
        const top = el ? Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 56) : 0;
        window.scrollTo({ top, behavior: "auto" });
      };
      if (reduced) { doScroll(); return; }
      setTeleport({ id: item.id, mode: "scroll" });
      window.setTimeout(doScroll, 280);
      window.setTimeout(() => setTeleport(null), 720);
    }, []);

    const go = React.useCallback((item) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (item.id === current) {
        if (reduced) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
        setTeleport({ id: item.id, mode: "scroll" });
        window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 280);
        window.setTimeout(() => setTeleport(null), 720);
        return;
      }
      if (reduced) { window.location.href = item.href; return; }
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      sessionStorage.setItem("v3-tp-in", item.id);
      setTeleport({ id: item.id, mode: "out" });
      window.setTimeout(() => { window.location.href = item.href; }, 380);
    }, [current]);

    const TeleportOverlay = teleport ? (
      <div className={`v3-tp ${teleport.mode}`} aria-hidden="true">
        <div className="v3-tp-bar top" />
        <div className="v3-tp-bar bot" />
        <div className="v3-tp-scan" />
        <div className="v3-tp-label">{teleport.mode === "in" ? "arrived" : "jumping"} · {teleport.id}</div>
      </div>
    ) : null;

    return { teleport, go, jump, TeleportOverlay };
  }

  // ---- Header / Footer --------------------------------------------------
  function Header({ current, go, jump }) {
    const [open, setOpen] = useState(false);
    // Prefer an in-page section jump when this page has a `sec-<ID>` target
    // (or the link is to the current page top). Otherwise navigate.
    const click = (e, item) => {
      e.preventDefault();
      setOpen(false);
      // Only scroll in-page when the link points at the page we're already on;
      // links to other pages always navigate.
      if (jump && item.id === current) jump(item);
      else go(item);
    };
    return (
      <React.Fragment>
        <div className="v3-header" id="sec-top">
          <a className="v3-bare" href={NAV[0].href} onClick={(e) => click(e, NAV[0])} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 14, height: 14, background: C.green, flexShrink: 0 }} />
            <MonoTxt color={C.fg} size={12}>MICHAELAQUINDE.COM</MonoTxt>
          </a>
          <div className="v3-nav">
            {NAV.map((item) => (
              <a key={item.id} className="v3-navlink" href={item.href} onClick={(e) => click(e, item)}>
                <MonoTxt color={current === item.id ? C.green : C.fgDim} size={12}>{item.id}</MonoTxt>
              </a>
            ))}
          </div>
          <button className="v3-burger" onClick={() => setOpen((v) => !v)}>{open ? "CLOSE ✕" : "MENU ≡"}</button>
        </div>
        <div className={`v3-mobnav${open ? " open" : ""}`}>
          {NAV.map((item) => (
            <a key={item.id} className="v3-navlink" href={item.href} onClick={(e) => click(e, item)}>
              <MonoTxt color={current === item.id ? C.green : C.fg} size={13}>{item.id}</MonoTxt>
            </a>
          ))}
        </div>
      </React.Fragment>
    );
  }

  function Footer() {
    return (
      <div className="v3-footer">
        <MonoTxt color={C.dim}>© 2026 MICHAELAQUINDE.COM</MonoTxt>
      </div>
    );
  }

  function PageHero({ file, title, blurb }) {
    return (
      <GridBand lines={12}>
        <div className="v3-pagehero">
          <div className="v3-crumb">
            <MonoTxt color={C.green}>{file}</MonoTxt>
            <MonoTxt color={C.dim}>· michaelaquinde.com</MonoTxt>
          </div>
          <h1>{title}<span style={{ color: C.green }}>.</span></h1>
          {blurb ? <div className="v3-pagehero-blurb">{blurb}</div> : null}
        </div>
      </GridBand>
    );
  }

  window.V3 = {
    C, DISPLAY, SANS, MONO, NAV,
    POSTS, EPISODES, TOOLS, ABOUT_META, articleHref,
    ensureStyles, MonoTxt, GridBand, SectionHeader, PodcastPlayer,
    useTeleport, Header, Footer, PageHero,
  };
})();
