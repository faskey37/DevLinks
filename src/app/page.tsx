"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, BarChart2, Link2, Shield, Zap, Globe, Palette, ChevronDown } from "lucide-react";

const features = [
  { icon: Link2,     title: "One URL, everything",      desc: "GitHub, portfolio, LinkedIn — all behind a single beautiful link.",     tag: "IDENTITY",   color: "#3B82F6" },
  { icon: BarChart2, title: "Real-time analytics",      desc: "Per-link click counters. Live. No refresh needed.",                      tag: "ANALYTICS",  color: "#8B5CF6" },
  { icon: Shield,    title: "OTP verification",         desc: "6-digit code. No fake accounts. No spam profiles.",                      tag: "SECURITY",   color: "#06B6D4" },
  { icon: Palette,   title: "Dark mode native",         desc: "System-aware theming. Looks sharp on every device.",                     tag: "UI",         color: "#F59E0B" },
  { icon: Zap,       title: "Instant sync",             desc: "Firestore real-time. Add a link — it's live in milliseconds.",           tag: "PERFORMANCE",color: "#10B981" },
  { icon: Globe,     title: "Edge-optimized SEO",       desc: "Public profile at /yourusername. Indexed. Shareable. Fast.",             tag: "REACH",      color: "#EF4444" },
];

const stats = [
  { value: "< 2min", label: "Setup time" },
  { value: "100%",   label: "Free forever" },
  { value: "∞",      label: "Links allowed" },
  { value: "24/7",   label: "Uptime" },
];

const ticker = ["GITHUB", "LINKEDIN", "PORTFOLIO", "BLOG", "TWITTER", "DRIBBBLE", "YOUTUBE", "NPM", "HASHNODE", "DEVTO", "FIGMA", "NOTION"];

export default function HomePage() {
  const [mounted, setMounted]     = useState(false);
  const [mouse, setMouse]         = useState({ x: 0.5, y: 0.5 });
  const [tick, setTick]           = useState(0);
  const heroRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove);
    const interval = setInterval(() => setTick(t => t + 1), 40);
    return () => { window.removeEventListener("mousemove", onMove); clearInterval(interval); };
  }, []);

  const px = mounted ? (mouse.x - 0.5) * 28 : 0;
  const py = mounted ? (mouse.y - 0.5) * 18 : 0;
  const rx = mounted ? (mouse.y - 0.5) * -12 : 0;
  const ry = mounted ? (mouse.x - 0.5) * 14 : 0;

  return (
    <div style={{ background: "#050810", minHeight: "100vh", color: "#fff", fontFamily: "'Syne', system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 6vw 60px" }}>

        {/* Grid background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px" }} />

        {/* Radial gradient */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 65% 50%, rgba(30,58,138,0.35) 0%, transparent 70%)" }} />

        {/* Top-left glow */}
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "35vw", height: "35vw",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* ── Left content ── */}
        <div style={{ position: "relative", zIndex: 10, flex: "1", maxWidth: "min(560px, 48vw)" }}>

          {/* Status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 999, padding: "6px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
              boxShadow: "0 0 8px #22C55E", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#93C5FD", letterSpacing: "0.08em" }}>
              v2.0 · LIVE ON VERCEL
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 800, lineHeight: 1.04,
            letterSpacing: "-0.04em", margin: "0 0 10px" }}>
            Your developer
          </h1>
          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 800, lineHeight: 1.04,
            letterSpacing: "-0.04em", margin: "0 0 10px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            identity,
          </h1>
          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 800, lineHeight: 1.04,
            letterSpacing: "-0.04em", margin: "0 0 28px" }}>
            one link.
          </h1>

          <p style={{ fontSize: "clamp(14px, 1.3vw, 17px)", color: "#64748B", lineHeight: 1.75,
            margin: "0 0 40px", fontFamily: "'DM Sans', sans-serif", maxWidth: 420 }}>
            DevLinks turns every platform you ship on into a single, beautiful profile.
            Real-time analytics. OTP verified. Dark by default.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/auth/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #2563EB, #4338CA)",
              color: "#fff", borderRadius: 14, padding: "13px 26px",
              fontWeight: 700, fontSize: 14, textDecoration: "none",
              boxShadow: "0 0 40px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "all 0.2s", letterSpacing: "0.01em",
            }}>
              Get started free <ArrowRight size={15} />
            </Link>
            <Link href="/auth/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", color: "#94A3B8",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "13px 26px",
              fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>
              View demo
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: "clamp(18px, 1.8vw, 24px)", fontWeight: 800,
                  letterSpacing: "-0.03em", color: "#fff" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#334155", fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 3, letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3D Graphic ── */}
        <div style={{
          position: "absolute", right: "4vw", top: "50%",
          transform: `translate(0, -50%) translate(${px}px, ${py}px)`,
          width: "clamp(300px, 42vw, 580px)", height: "clamp(300px, 42vw, 580px)",
          transition: "transform 0.08s ease-out", pointerEvents: "none",
          perspective: "800px",
        }}>
          <div style={{ width: "100%", height: "100%",
            transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
            transition: "transform 0.08s ease-out" }}>
            <svg viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>

              {/* Outer rings */}
              <circle cx="280" cy="280" r="250" stroke="rgba(59,130,246,0.06)" strokeWidth="1"/>
              <circle cx="280" cy="280" r="210" stroke="rgba(59,130,246,0.08)" strokeWidth="0.5"/>
              <circle cx="280" cy="280" r="170" stroke="rgba(99,102,241,0.06)" strokeWidth="0.5"/>

              {/* Rotating dashed orbit */}
              <circle cx="280" cy="280" r="230" stroke="rgba(59,130,246,0.12)" strokeWidth="1"
                strokeDasharray="8 16" strokeLinecap="round"
                style={{ transformOrigin: "280px 280px", animation: "orbitSpin 20s linear infinite" }}/>

              {/* Big blue arc */}
              <path d="M 55 210 A 240 240 0 0 1 505 210" stroke="#2563EB" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.95"/>
              {/* Red accent arc */}
              <path d="M 110 390 A 200 200 0 0 0 490 270" stroke="#EF4444" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85"/>
              {/* Cyan thin arc */}
              <path d="M 190 105 A 185 185 0 0 1 468 390" stroke="#06B6D4" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>
              {/* Purple arc bottom */}
              <path d="M 80 340 A 220 220 0 0 0 460 160" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>

              {/* Central vertical shaft */}
              <rect x="268" y="155" width="24" height="230" rx="12" fill="#1D4ED8" opacity="0.9"/>
              <rect x="273" y="155" width="14" height="230" rx="7" fill="#3B82F6" opacity="0.5"/>
              <rect x="277" y="155" width="6" height="230" rx="3" fill="#93C5FD" opacity="0.3"/>

              {/* Top disc */}
              <ellipse cx="280" cy="196" rx="58" ry="13" fill="#1D4ED8" opacity="0.95"/>
              <ellipse cx="280" cy="196" rx="46" ry="10" fill="#3B82F6" opacity="0.6"/>
              <ellipse cx="280" cy="196" rx="28" ry="6" fill="#93C5FD" opacity="0.4"/>

              {/* Mid disc */}
              <ellipse cx="280" cy="295" rx="68" ry="15" fill="#1D4ED8" opacity="0.9"/>
              <ellipse cx="280" cy="295" rx="54" ry="12" fill="#EF4444" opacity="0.45"/>
              <ellipse cx="280" cy="295" rx="32" ry="7" fill="#FCA5A5" opacity="0.3"/>

              {/* Bottom disc */}
              <ellipse cx="280" cy="384" rx="52" ry="12" fill="#1D4ED8" opacity="0.85"/>
              <ellipse cx="280" cy="384" rx="40" ry="9" fill="#3B82F6" opacity="0.5"/>

              {/* Gear / wheel left */}
              <circle cx="192" cy="308" r="55" stroke="#1E40AF" strokeWidth="2" fill="#080C14" opacity="0.98"/>
              <circle cx="192" cy="308" r="40" stroke="#2563EB" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <circle cx="192" cy="308" r="16" fill="#1D4ED8" opacity="0.95"/>
              <circle cx="192" cy="308" r="8"  fill="#3B82F6" opacity="0.8"/>
              {[0,40,80,120,160,200,240,280,320].map((deg, i) => (
                <line key={i}
                  x1={192 + 40*Math.cos(deg*Math.PI/180)}
                  y1={308 + 40*Math.sin(deg*Math.PI/180)}
                  x2={192 + 55*Math.cos(deg*Math.PI/180)}
                  y2={308 + 55*Math.sin(deg*Math.PI/180)}
                  stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" opacity="0.7"
                />
              ))}

              {/* Small gear top-right */}
              <circle cx="390" cy="178" r="32" stroke="#4338CA" strokeWidth="1.5" fill="#080C14" opacity="0.95"/>
              <circle cx="390" cy="178" r="22" stroke="#6366F1" strokeWidth="1" fill="none" opacity="0.4"/>
              <circle cx="390" cy="178" r="10" fill="#4338CA" opacity="0.9"/>
              {[0,60,120,180,240,300].map((deg, i) => (
                <line key={i}
                  x1={390 + 22*Math.cos(deg*Math.PI/180)}
                  y1={178 + 22*Math.sin(deg*Math.PI/180)}
                  x2={390 + 32*Math.cos(deg*Math.PI/180)}
                  y2={178 + 32*Math.sin(deg*Math.PI/180)}
                  stroke="#6366F1" strokeWidth="3" strokeLinecap="round" opacity="0.6"
                />
              ))}

              {/* Floating rects */}
              <rect x="338" y="178" width="84" height="22" rx="6" fill="#EF4444" opacity="0.88"/>
              <rect x="354" y="210" width="52" height="13" rx="4" fill="#F59E0B" opacity="0.7"/>
              <rect x="344" y="368" width="74" height="18" rx="5" fill="#2563EB" opacity="0.8"/>
              <rect x="358" y="394" width="46" height="11" rx="3" fill="#8B5CF6" opacity="0.6"/>

              {/* D logo top-left */}
              <rect x="96" y="148" width="72" height="72" rx="16" fill="#0F172A" opacity="0.95"/>
              <rect x="96" y="148" width="72" height="72" rx="16" fill="none" stroke="#4338CA" strokeWidth="1.5"/>
              <path d="M112 162 L112 206 L126 206 Q148 206 148 184 Q148 162 126 162 Z" fill="none" stroke="#6366F1" strokeWidth="3.5" strokeLinejoin="round"/>
              <circle cx="154" cy="170" r="5" fill="#818CF8" opacity="0.9"/>
              <circle cx="154" cy="184" r="5" fill="#6366F1" opacity="0.9"/>
              <circle cx="154" cy="198" r="5" fill="#4338CA" opacity="0.9"/>

              {/* Wire connections */}
              <path d="M280 155 C 340 115, 420 135, 448 196" stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.3"/>
              <path d="M280 384 C 200 424, 135 400, 115 355" stroke="#475569" strokeWidth="1" fill="none" opacity="0.25"/>
              <path d="M335 295 C 385 275, 425 295, 438 338" stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.35"/>
              <path d="M168 185 C 180 210, 192 240, 192 253" stroke="#60A5FA" strokeWidth="1.5" fill="none" opacity="0.3"/>

              {/* Accent dots */}
              <circle cx="448" cy="196" r="7" fill="#F59E0B" opacity="0.95"/>
              <circle cx="438" cy="338" r="6" fill="#3B82F6" opacity="0.85"/>
              <circle cx="115" cy="355" r="5" fill="#EF4444" opacity="0.8"/>
              <circle cx="168" cy="185" r="4" fill="#06B6D4" opacity="0.75"/>
              <circle cx="340" cy="430" r="4" fill="#8B5CF6" opacity="0.7"/>

              {/* Scanning line animation */}
              <line x1="60" y1="280" x2="500" y2="280" stroke="#3B82F6" strokeWidth="0.5" opacity="0.15"
                strokeDasharray="4 8"
                style={{ transformOrigin: "280px 280px", animation: "scanLine 3s ease-in-out infinite" }}/>

              <style>{`
                @keyframes orbitSpin { to { transform: rotate(360deg); } }
                @keyframes scanLine { 0%,100%{ opacity:0.05; } 50%{ opacity:0.25; } }
              `}</style>
            </svg>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.3 }}>
          <ChevronDown size={16} color="#64748B" style={{ animation: "bounce 2s infinite" }} />
          <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }`}</style>
        </div>
      </section>

      {/* ── TICKER STRIP ─────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(255,255,255,0.01)", padding: "14px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", gap: 48, animation: "tickerMove 18s linear infinite", width: "max-content" }}>
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: "#1E3A5F", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
              {item} <span style={{ color: "#1E293B", marginLeft: 8 }}>✦</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes tickerMove { from{ transform: translateX(0); } to{ transform: translateX(-50%); } }`}</style>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section style={{ padding: "100px 6vw" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#3B82F6",
              letterSpacing: "0.15em", marginBottom: 16, display: "inline-block",
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 6, padding: "4px 12px" }}>CAPABILITIES</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800,
              letterSpacing: "-0.04em", margin: "0 0 14px", lineHeight: 1.1 }}>
              Everything a developer needs.<br />
              <span style={{ color: "#334155" }}>Nothing they don't.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1 }}>
            {features.map(({ icon: Icon, title, desc, tag, color }, i) => (
              <div key={title} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                padding: "32px 28px", borderRadius: i === 0 ? "20px 0 0 0" : i === 2 ? "0 20px 0 0" : i === 3 ? "0 0 0 20px" : i === 5 ? "0 0 20px 0" : "0",
                position: "relative", overflow: "hidden", transition: "all 0.3s", cursor: "default",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                  background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
                  background: `${color}10`, border: `1px solid ${color}20`,
                  borderRadius: 6, padding: "3px 10px" }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    color: color, letterSpacing: "0.1em" }}>{tag}</span>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 12, marginBottom: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${color}12` }}>
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.02em" }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, margin: 0,
                  fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO PROFILE CARD ────────────────────────────────────── */}
      <section style={{ padding: "0 6vw 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#06B6D4",
              letterSpacing: "0.15em", marginBottom: 16, display: "inline-block",
              background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)",
              borderRadius: 6, padding: "4px 12px" }}>LIVE PREVIEW</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 44px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 20px" }}>
              Your profile.<br />
              <span style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Always online.
              </span>
            </h2>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75,
              fontFamily: "'DM Sans', sans-serif", margin: "0 0 32px" }}>
              One URL. Every platform you've ever shipped on. Share it in your
              Twitter bio, email signature, or resume.
            </p>
            <Link href="/auth/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
              color: "#93C5FD", borderRadius: 12, padding: "11px 22px",
              fontWeight: 600, fontSize: 13, textDecoration: "none", letterSpacing: "0.01em",
            }}>
              Build yours free <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — demo card */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 28, padding: "32px",
            boxShadow: "0 0 80px rgba(37,99,235,0.08), 0 0 0 1px rgba(255,255,255,0.03)",
          }}>
            {/* Avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%", marginBottom: 12,
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, boxShadow: "0 0 30px rgba(37,99,235,0.4), 0 0 0 3px rgba(37,99,235,0.15)",
              }}>👨‍💻</div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>Alex Chen</div>
              <div style={{ fontSize: 11, color: "#3B82F6", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>@alexchen</div>
              <div style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Sans', sans-serif", marginTop: 6, textAlign: "center" }}>
                Full-Stack · Open Source · Building in public
              </div>
            </div>

            {/* Links */}
            {[
              { icon: "🐙", label: "GitHub",    sub: "48 repos · 1.2k stars",  color: "#6B7280", clicks: "94" },
              { icon: "💼", label: "LinkedIn",  sub: "500+ connections",        color: "#0A66C2", clicks: "67" },
              { icon: "🌐", label: "Portfolio", sub: "alexchen.dev",            color: "#3B82F6", clicks: "112" },
              { icon: "✍️", label: "Blog",      sub: "24 posts published",      color: "#8B5CF6", clicks: "38" },
            ].map((link, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 14px", borderRadius: 14, marginBottom: 8,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17 }}>{link.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{link.label}</div>
                    <div style={{ fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{link.sub}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  color: "#1E3A5F", background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.1)", borderRadius: 6, padding: "2px 8px" }}>
                  {link.clicks} clicks
                </div>
              </div>
            ))}

            {/* Live indicator */}
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 12,
              background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)",
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981",
                  boxShadow: "0 0 8px #10B981", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#10B981" }}>
                  LIVE ANALYTICS
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>311 total clicks</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: "0 6vw 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #0F1B3D 0%, #0D0F1F 50%, #0A0C1A 100%)",
          borderRadius: 28, padding: "clamp(40px, 5vw, 80px)",
          border: "1px solid rgba(59,130,246,0.15)",
          boxShadow: "0 0 100px rgba(37,99,235,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 32 }}>

          {/* Dot grid */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {/* Corner glow */}
          <div style={{ position: "absolute", top: "-40%", right: "-10%", width: "40%", height: "150%",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#3B82F6",
              letterSpacing: "0.15em", marginBottom: 14, display: "inline-block",
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 6, padding: "4px 12px" }}>GET STARTED</div>
            <h2 style={{ fontSize: "clamp(22px, 2.8vw, 40px)", fontWeight: 800,
              letterSpacing: "-0.04em", margin: "0 0 12px", lineHeight: 1.1 }}>
              Ready to own your<br />developer identity?
            </h2>
            <p style={{ color: "#334155", margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
              Free forever · Open source · Live in under 2 minutes
            </p>
          </div>

          <Link href="/auth/signin" style={{
            display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
            background: "#fff", color: "#0F172A",
            borderRadius: 14, padding: "16px 32px",
            fontWeight: 800, fontSize: 14, textDecoration: "none",
            letterSpacing: "0.01em", position: "relative",
            boxShadow: "0 0 40px rgba(255,255,255,0.08)",
          }}>
            Initialize your profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "24px 6vw",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em" }}>
          Dev<span style={{ color: "#3B82F6" }}>Links</span>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            color: "#1E293B", marginLeft: 8, letterSpacing: "0.05em" }}>v2.0</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#1E293B" }}>
          NEXT.JS · FIREBASE · TAILWIND · VERCEL
        </span>
      </footer>
    </div>
  );
}