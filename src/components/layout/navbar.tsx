"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, User, LogOut, ArrowRight, Sparkles } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    router.push("/");
  }

  // UI state logic
  const navBackground = scrolled 
    ? "rgba(10, 15, 25, 0.7)" 
    : "transparent";
  
  const navWidth = scrolled ? "90%" : "100%";
  const navTop = scrolled ? "15px" : "0px";
  const navRadius = scrolled ? "24px" : "0px";
  const navBorder = scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent";

  return (
    <nav style={{
      position: "fixed", 
      top: navTop, 
      left: "50%", 
      transform: "translateX(-50%)",
      width: navWidth,
      zIndex: 1000,
      background: navBackground,
      backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
      border: navBorder,
      borderRadius: navRadius,
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow: scrolled ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: scrolled ? "0 24px" : "0 6vw", 
        height: scrolled ? 60 : 72, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        transition: "all 0.4s"
      }}>

        {/* Logo Section */}
        <Link href="/" style={{ 
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none", 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          fontSize: 20, 
          letterSpacing: "-0.03em", 
          color: "#fff" 
        }}>
          <div style={{
            width: 32, height: 32, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 15px rgba(59,130,246,0.4)"
          }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ display: scrolled ? "none" : "block", color: isHome ? "#fff" : "hsl(var(--foreground))" }}>
            Dev<span style={{ color: "#3B82F6" }}>Links</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <Link href="/dashboard" style={navLinkStyle(isHome)}>
                <LayoutDashboard size={15} /> <span>Dashboard</span>
              </Link>
              <Link href="/profile" style={navLinkStyle(isHome)}>
                <User size={15} /> <span>Profile</span>
              </Link>
              
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />
              
              <button onClick={handleSignOut} style={{ 
                ...navLinkStyle(isHome), 
                background: "rgba(239, 68, 68, 0.1)", 
                color: "#FCA5A5",
                border: "none", 
                cursor: "pointer",
                borderRadius: 10 
              }}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" style={{ 
                ...navLinkStyle(isHome), 
                color: isHome ? "rgba(255,255,255,0.6)" : "hsl(var(--muted-foreground))" 
              }}>
                Sign in
              </Link>
              
              <Link href="/auth/signin" style={{
                display: "inline-flex", 
                alignItems: "center", 
                gap: 8,
                background: "#fff", 
                color: "#000",
                borderRadius: 14, 
                padding: "10px 22px",
                fontFamily: "'Syne', sans-serif", 
                fontWeight: 800, 
                fontSize: 13,
                textDecoration: "none", 
                letterSpacing: "0.02em",
                transition: "all 0.3s",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }} className="nav-cta">
                Get started <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.2);
          background: #3B82F6 !important;
          color: #fff !important;
        }
        @media (max-width: 640px) {
          span { display: none; }
        }
      `}</style>
    </nav>
  );
}

function navLinkStyle(isHome: boolean) {
  return {
    display: "inline-flex", 
    alignItems: "center", 
    gap: 8,
    padding: "10px 16px", 
    borderRadius: 12,
    fontFamily: "'Syne', sans-serif", 
    fontWeight: 600, 
    fontSize: 14,
    color: isHome ? "rgba(255,255,255,0.7)" : "hsl(var(--foreground))",
    textDecoration: "none", 
    transition: "all 0.2s ease",
    letterSpacing: "0.01em",
  } as React.CSSProperties;
}