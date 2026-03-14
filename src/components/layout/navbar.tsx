"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, User, LogOut, ArrowRight } from "lucide-react";

export function Navbar() {
  const { user }    = useAuth();
  const router      = useRouter();
  const pathname    = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    router.push("/");
  }

  return (
    <nav style={{
      position:     "fixed",
      top:          mounted && scrolled ? 15 : 0,
      left:         "50%",
      transform:    "translateX(-50%)",
      width:        mounted && scrolled ? "90%" : "100%",
      zIndex:       1000,
      background:   mounted && scrolled ? "rgba(8,12,20,0.85)" : "transparent",
      backdropFilter: mounted && scrolled ? "blur(20px) saturate(180%)" : "none",
      border:       mounted && scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      borderRadius: mounted && scrolled ? 24 : 0,
      transition:   "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow:    mounted && scrolled ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding:  mounted && scrolled ? "0 24px" : "0 6vw",
        height:   mounted && scrolled ? 60 : 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s",
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 20, letterSpacing: "-0.03em", color: "#fff",
        }}>
          {/* D icon */}
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB, #4338CA)",
            borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(37,99,235,0.45)",
          }}>
            <svg width="18" height="18" viewBox="0 0 80 80" fill="none">
              <path d="M16 16 L16 64 L32 64 Q54 64 54 40 Q54 16 32 16 Z"
                fill="none" stroke="#fff" strokeWidth="7" strokeLinejoin="round"/>
              <circle cx="66" cy="26" r="6" fill="#fff" opacity="0.9"/>
              <circle cx="66" cy="40" r="6" fill="#fff" opacity="0.7"/>
              <circle cx="66" cy="54" r="6" fill="#fff" opacity="0.5"/>
            </svg>
          </div>
          {/* Wordmark — always visible */}
          <span style={{ color: "#fff", whiteSpace: "nowrap" }}>
            Dev<span style={{ color: "#3B82F6" }}>Links</span>
          </span>
        </Link>

        {/* ── Nav links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {user ? (
            <>
              <Link href="/dashboard" style={linkStyle}>
                <LayoutDashboard size={15} />
                <span className="nav-label">Dashboard</span>
              </Link>
              <Link href="/profile" style={linkStyle}>
                <User size={15} />
                <span className="nav-label">Profile</span>
              </Link>

              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

              <button onClick={handleSignOut} style={{
                ...linkStyle,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                color: "#FCA5A5", cursor: "pointer",
              }}>
                <LogOut size={15} />
                <span className="nav-label">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" style={{ ...linkStyle, color: "rgba(255,255,255,0.55)" }}>
                Sign in
              </Link>
              <Link href="/auth/signin" className="nav-cta" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#0F172A",
                borderRadius: 14, padding: "10px 22px",
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13,
                textDecoration: "none", letterSpacing: "0.02em",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "all 0.25s",
                whiteSpace: "nowrap",
              }}>
                Get started <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .nav-cta:hover {
          background: #3B82F6 !important;
          color: #fff !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(59,130,246,0.35) !important;
        }
        @media (max-width: 600px) {
          .nav-label { display: none; }
        }
      `}</style>
    </nav>
  );
}

const linkStyle: React.CSSProperties = {
  display:        "inline-flex",
  alignItems:     "center",
  gap:            7,
  padding:        "9px 14px",
  borderRadius:   12,
  fontFamily:     "'Syne', sans-serif",
  fontWeight:     600,
  fontSize:       13,
  color:          "rgba(255,255,255,0.75)",
  textDecoration: "none",
  transition:     "color 0.2s, background 0.2s",
  letterSpacing:  "0.01em",
  border:         "1px solid transparent",
  whiteSpace:     "nowrap",
  background:     "none",
};