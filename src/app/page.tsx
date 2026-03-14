"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, BarChart2, Link2, Shield, Zap, Globe, Palette, ChevronDown, Terminal } from "lucide-react";

const features = [
  { icon: Link2,     title: "One URL, everything",   desc: "GitHub, portfolio, LinkedIn — all behind a single beautiful link.",   tag: "IDENTITY",    color: "#3B82F6" },
  { icon: BarChart2, title: "Real-time analytics",   desc: "Per-link click counters. Live. No refresh needed.",                    tag: "ANALYTICS",   color: "#8B5CF6" },
  { icon: Shield,    title: "OTP verification",      desc: "6-digit code. No fake accounts. No spam profiles.",                    tag: "SECURITY",    color: "#06B6D4" },
  { icon: Palette,   title: "Dark mode native",      desc: "System-aware theming. Looks sharp on every device.",                  tag: "UI",          color: "#F59E0B" },
  { icon: Zap,       title: "Instant sync",          desc: "Firestore real-time. Add a link — it's live in milliseconds.",         tag: "PERFORMANCE", color: "#10B981" },
  { icon: Globe,     title: "Edge-optimized SEO",    desc: "Public profile at /yourusername. Indexed. Shareable. Fast.",           tag: "REACH",       color: "#EF4444" },
];

const stats = [
  { value: "< 2min", label: "Setup time" },
  { value: "100%",   label: "Free forever" },
  { value: "∞",      label: "Links allowed" },
  { value: "24/7",   label: "Uptime" },
];

const ticker = ["GITHUB","LINKEDIN","PORTFOLIO","BLOG","TWITTER","DRIBBBLE","YOUTUBE","NPM","HASHNODE","DEVTO","FIGMA","NOTION"];

// Terminal lines that type out one by one
const terminalLines = [
  { text: "$ devlinks init",                                        color: "#94A3B8", delay: 0 },
  { text: "✓ Profile created: devlinks.app/alexchen",              color: "#22C55E", delay: 600 },
  { text: "$ devlinks add --url github.com/alexchen",              color: "#94A3B8", delay: 1400 },
  { text: "✓ Link added: GitHub · 0 clicks",                       color: "#22C55E", delay: 2000 },
  { text: "$ devlinks add --url alexchen.dev",                     color: "#94A3B8", delay: 2800 },
  { text: "✓ Link added: Portfolio · 0 clicks",                    color: "#22C55E", delay: 3400 },
  { text: "$ devlinks analytics --live",                           color: "#94A3B8", delay: 4200 },
  { text: "↑ github.com/alexchen    ··· 94 clicks",               color: "#3B82F6", delay: 4800 },
  { text: "↑ alexchen.dev           ··· 112 clicks",              color: "#3B82F6", delay: 5200 },
  { text: "↑ linkedin.com/in/alex   ··· 67 clicks",               color: "#3B82F6", delay: 5600 },
  { text: "● Total: 273 clicks · Profile live ✓",                 color: "#A78BFA", delay: 6200 },
];

// Floating snippet cards
const snippets = [
  {
    title: "profile.ts",
    top: "8%", right: "-2%",
    rotate: "3deg",
    lines: [
      { text: "const profile = {",        color: "#94A3B8" },
      { text: '  username: "alexchen",',  color: "#93C5FD" },
      { text: '  links: 4,',              color: "#86EFAC" },
      { text: '  clicks: 273,',           color: "#FCA5A5" },
      { text: "  verified: true",         color: "#86EFAC" },
      { text: "}",                        color: "#94A3B8" },
    ],
    animDelay: "0s",
  },
  {
    title: "analytics.json",
    top: "58%", right: "1%",
    rotate: "-2deg",
    lines: [
      { text: "{",                              color: "#94A3B8" },
      { text: '  "github":    94,',            color: "#93C5FD" },
      { text: '  "portfolio": 112,',           color: "#93C5FD" },
      { text: '  "linkedin":  67,',            color: "#93C5FD" },
      { text: '  "total":     273',            color: "#86EFAC" },
      { text: "}",                             color: "#94A3B8" },
    ],
    animDelay: "0.8s",
  },
];

export default function HomePage() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursor, setCursor]             = useState(true);

  // Type out terminal lines one by one
  useEffect(() => {
    const timers = terminalLines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    // Loop restart after all lines shown
    const restart = setTimeout(() => setVisibleLines(0), 8000);
    return () => { timers.forEach(clearTimeout); clearTimeout(restart); };
  }, [visibleLines === 0 ? undefined : null]);

  // Restart loop
  useEffect(() => {
    if (visibleLines === 0) {
      const timers = terminalLines.map((line, i) =>
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [visibleLines]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: "#050810", minHeight: "100vh", color: "#fff", fontFamily: "'Syne', system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 6vw 60px" }}>

        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px" }} />

        {/* Radial glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 65% 50%, rgba(30,58,138,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "35vw", height: "35vw",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* ── Left text ── */}
        <div style={{ position: "relative", zIndex: 10, flex: "1", maxWidth: "min(540px, 46vw)" }}>

          {/* Badge */}
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
          <h1 style={{ fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.04em", margin: "0 0 10px" }}>
            Your developer
          </h1>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.04em", margin: "0 0 10px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            identity,
          </h1>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.04em", margin: "0 0 28px" }}>
            one link.
          </h1>

          <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: "#64748B", lineHeight: 1.75, margin: "0 0 40px",
            fontFamily: "'DM Sans', sans-serif", maxWidth: 400 }}>
            DevLinks turns every platform you ship on into a single, beautiful profile.
            Real-time analytics. OTP verified. Dark by default.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/auth/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #2563EB, #4338CA)", color: "#fff",
              borderRadius: 14, padding: "13px 26px", fontWeight: 700, fontSize: 14,
              textDecoration: "none", boxShadow: "0 0 40px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              letterSpacing: "0.01em",
            }}>
              Get started free <ArrowRight size={15} />
            </Link>
            <Link href="/auth/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", color: "#94A3B8",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "13px 26px", fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>
              View demo
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: "clamp(16px, 1.6vw, 22px)", fontWeight: 800, letterSpacing: "-0.03em" }}>{value}</div>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace", marginTop: 3, letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Terminal + floating snippets ── */}
        <div style={{ position: "absolute", right: "4vw", top: "50%", transform: "translateY(-50%)",
          width: "clamp(280px, 40vw, 520px)", pointerEvents: "none" }}>

          {/* Floating snippet cards */}
          {snippets.map((s, si) => (
            <div key={si} style={{
              position: "absolute", top: s.top, right: s.right,
              transform: `rotate(${s.rotate})`,
              background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "12px 16px", minWidth: 210,
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              animation: `floatSnippet 4s ease-in-out infinite`,
              animationDelay: s.animDelay,
              zIndex: si === 0 ? 20 : 5,
            }}>
              {/* Tab bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", opacity: 0.7 }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", opacity: 0.7 }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", opacity: 0.7 }} />
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  color: "#334155", marginLeft: 6 }}>{s.title}</span>
              </div>
              {s.lines.map((line, li) => (
                <div key={li} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  color: line.color, lineHeight: 1.7, whiteSpace: "nowrap" }}>{line.text}</div>
              ))}
            </div>
          ))}

          {/* Main terminal */}
          <div style={{
            background: "rgba(8,12,20,0.95)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, overflow: "hidden", position: "relative", zIndex: 10,
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.08)",
            marginTop: "18%",
          }}>
            {/* Terminal header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
              background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E" }} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Terminal size={11} color="#475569" />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#334155" }}>
                  devlinks — terminal
                </span>
              </div>
            </div>

            {/* Terminal body */}
            <div style={{ padding: "20px", minHeight: 280 }}>
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                  color: line.color, lineHeight: 1.8, display: "flex", alignItems: "center", gap: 6 }}>
                  {line.text}
                  {/* cursor on last visible line */}
                  {i === visibleLines - 1 && (
                    <span style={{ display: "inline-block", width: 7, height: 14,
                      background: cursor ? "#3B82F6" : "transparent",
                      borderRadius: 1, marginLeft: 2, transition: "background 0.1s",
                      verticalAlign: "middle" }} />
                  )}
                </div>
              ))}
              {/* Empty cursor when no lines yet */}
              {visibleLines === 0 && (
                <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8",
                  display: "flex", alignItems: "center", gap: 4 }}>
                  <span>$</span>
                  <span style={{ display: "inline-block", width: 7, height: 14,
                    background: cursor ? "#3B82F6" : "transparent", borderRadius: 1 }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.25 }}>
          <ChevronDown size={16} color="#64748B" style={{ animation: "bounce 2s infinite" }} />
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(255,255,255,0.01)", padding: "14px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 48, animation: "tickerMove 18s linear infinite", width: "max-content" }}>
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: "#1E3A5F", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
              {item} <span style={{ color: "#1E293B", marginLeft: 8 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────── */}
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
              <span style={{ color: "#1E293B" }}>Nothing they don't.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1 }}>
            {features.map(({ icon: Icon, title, desc, tag, color }, i) => (
              <div key={title} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
                padding: "32px 28px",
                borderRadius: i===0?"20px 0 0 0":i===2?"0 20px 0 0":i===3?"0 0 0 20px":i===5?"0 0 20px 0":"0",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
                  background: `${color}10`, border: `1px solid ${color}20`,
                  borderRadius: 6, padding: "3px 10px" }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    color, letterSpacing: "0.1em" }}>{tag}</span>
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

      {/* ── DEMO CARD ────────────────────────────────────── */}
      <section style={{ padding: "0 6vw 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
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
              fontWeight: 600, fontSize: 13, textDecoration: "none",
            }}>
              Build yours free <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 28, padding: 32, boxShadow: "0 0 80px rgba(37,99,235,0.08)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", marginBottom: 12,
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                boxShadow: "0 0 30px rgba(37,99,235,0.4), 0 0 0 3px rgba(37,99,235,0.15)" }}>👨‍💻</div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>Alex Chen</div>
              <div style={{ fontSize: 11, color: "#3B82F6", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>@alexchen</div>
              <div style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Sans', sans-serif", marginTop: 6, textAlign: "center" }}>
                Full-Stack · Open Source · Building in public
              </div>
            </div>
            {[
              { icon: "🐙", label: "GitHub",    sub: "48 repos · 1.2k stars", clicks: "94"  },
              { icon: "💼", label: "LinkedIn",  sub: "500+ connections",       clicks: "67"  },
              { icon: "🌐", label: "Portfolio", sub: "alexchen.dev",           clicks: "112" },
              { icon: "✍️", label: "Blog",      sub: "24 posts published",     clicks: "38"  },
            ].map((link, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 14px", borderRadius: 14, marginBottom: 8,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17 }}>{link.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{link.label}</div>
                    <div style={{ fontSize: 10, color: "#334155", fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{link.sub}</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#1E3A5F",
                  background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)",
                  borderRadius: 6, padding: "2px 8px" }}>{link.clicks} clicks</div>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 12,
              background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)",
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981",
                  boxShadow: "0 0 8px #10B981", display: "inline-block" }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#10B981" }}>LIVE ANALYTICS</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>311 total clicks</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: "0 6vw 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #0F1B3D 0%, #0D0F1F 50%, #0A0C1A 100%)",
          borderRadius: 28, padding: "clamp(40px,5vw,80px)",
          border: "1px solid rgba(59,130,246,0.15)",
          boxShadow: "0 0 100px rgba(37,99,235,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 32 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div style={{ position: "absolute", top: "-40%", right: "-10%", width: "40%", height: "150%",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#3B82F6",
              letterSpacing: "0.15em", marginBottom: 14, display: "inline-block",
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: 6, padding: "4px 12px" }}>GET STARTED</div>
            <h2 style={{ fontSize: "clamp(22px,2.8vw,40px)", fontWeight: 800,
              letterSpacing: "-0.04em", margin: "0 0 12px", lineHeight: 1.1 }}>
              Ready to own your<br />developer identity?
            </h2>
            <p style={{ color: "#334155", margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
              Free forever · Open source · Live in under 2 minutes
            </p>
          </div>
          <Link href="/auth/signin" style={{
            display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
            background: "#fff", color: "#0F172A", borderRadius: 14, padding: "16px 32px",
            fontWeight: 800, fontSize: 14, textDecoration: "none",
            boxShadow: "0 0 40px rgba(255,255,255,0.08)", position: "relative",
          }}>
            Initialize your profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
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

      <style>{`
        @keyframes floatSnippet {
          0%,100% { transform: translateY(0px) rotate(var(--r,3deg)); }
          50%      { transform: translateY(-10px) rotate(var(--r,3deg)); }
        }
        @keyframes tickerMove { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
      `}</style>
    </div>
  );
}