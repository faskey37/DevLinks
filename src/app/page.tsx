"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, BarChart2, Link2, Shield, Zap, Globe, Palette, 
  Sparkles, Terminal, Cpu, Network, HardDrive, Gauge,
  Code2, Box, Layers, Database, Lock, Eye, Activity,
  Radio, Satellite, Wifi, MapPin
} from "lucide-react";

const features = [
  { 
    icon: Link2, 
    title: "Unified Link Architecture", 
    desc: "Consolidate GitHub, portfolio, and socials into a single high-performance URL.",
    color: "#3B82F6",
    metric: "∞ endpoints",
    subsystem: "core-router"
  },
  { 
    icon: BarChart2, 
    title: "Live Telemetry", 
    desc: "Real-time click tracking with granular per-link performance metrics.",
    color: "#06B6D4",
    metric: "<50ms latency",
    subsystem: "analytics-engine" 
  },
  { 
    icon: Shield, 
    title: "Verified Protocols", 
    desc: "Enterprise-grade email verification to ensure zero-spam profile integrity.",
    color: "#8B5CF6",
    metric: "99.99% uptime",
    subsystem: "security-layer"
  },
  { 
    icon: Palette, 
    title: "Adaptive UI", 
    desc: "Engineered for clarity in both light and dark environments. Auto-detected.",
    color: "#F59E0B",
    metric: "16ms response",
    subsystem: "render-engine"
  },
  { 
    icon: Zap, 
    title: "Atomic Updates", 
    desc: "Global real-time sync via Firestore. Changes propagate in milliseconds.",
    color: "#10B981",
    metric: "real-time",
    subsystem: "sync-protocol"
  },
  { 
    icon: Globe, 
    title: "Edge-Optimized SEO", 
    desc: "Search-indexed public profiles optimized for global discoverability.",
    color: "#EF4444",
    metric: "edge-cached",
    subsystem: "cdn-edge"
  },
];

const metrics = [
  { label: "Global Nodes", value: "10.2K", icon: Cpu, color: "#3B82F6" },
  { label: "Requests/sec", value: "2.4K", icon: Gauge, color: "#06B6D4" },
  { label: "Data Stored", value: "1.2PB", icon: HardDrive, color: "#8B5CF6" },
  { label: "Network Health", value: "99.99%", icon: Activity, color: "#10B981" },
];

const specs = [
  { label: "Response Time", value: "24ms", progress: 96 },
  { label: "Cache Hit Ratio", value: "94%", progress: 94 },
  { label: "Availability", value: "99.99%", progress: 99.99 },
  { label: "Error Rate", value: "0.02%", progress: 99.98 },
];

const cities = [
  { name: "NYC", lat: 40.7, lng: -74.0, active: true },
  { name: "LON", lat: 51.5, lng: -0.1, active: true },
  { name: "TYO", lat: 35.7, lng: 139.7, active: true },
  { name: "SYD", lat: -33.9, lng: 151.2, active: true },
  { name: "SFO", lat: 37.8, lng: -122.4, active: true },
  { name: "SGP", lat: 1.3, lng: 103.8, active: true },
  { name: "FRA", lat: 50.1, lng: 8.7, active: true },
  { name: "DXB", lat: 25.3, lng: 55.3, active: true },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = useState(0);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Mouse move handler for subtle parallax
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    
    // Auto-rotation for globe
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);

    // Random node activation
    const nodeInterval = setInterval(() => {
      const randomNodes = Array.from({ length: 3 }, () => Math.floor(Math.random() * cities.length));
      setActiveNodes(randomNodes);
    }, 2000);

    window.addEventListener("mousemove", handleMouse);
    
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      clearInterval(interval);
      clearInterval(nodeInterval);
    };
  }, []);

  // Canvas globe animation
  useEffect(() => {
    if (!canvasRef.current || !mounted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const drawGlobe = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      // Earth sphere
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4;

      // Draw globe outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw latitude lines
      for (let i = -80; i <= 80; i += 30) {
        const lat = (i * Math.PI) / 180;
        const y = centerY - radius * Math.sin(lat);
        const r = radius * Math.cos(lat);
        
        if (r > 0) {
          ctx.beginPath();
          ctx.ellipse(centerX, y, r, r * 0.2, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
          ctx.stroke();
        }
      }

      // Draw longitude lines
      for (let i = 0; i < 360; i += 30) {
        const angle = ((i + rotation) * Math.PI) / 180;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle) * 0.3;
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
        ctx.stroke();
      }

      // Draw cities/nodes
      cities.forEach((city, index) => {
        const latRad = (city.lat * Math.PI) / 180;
        const lngRad = ((city.lng + rotation) * Math.PI) / 180;
        
        const x = centerX + radius * Math.cos(latRad) * Math.sin(lngRad);
        const y = centerY - radius * Math.sin(latRad) * 0.8;
        
        // Check if point is on visible hemisphere
        const dot = Math.cos(lngRad) * Math.cos(latRad);
        if (dot > -0.2) {
          const isActive = activeNodes.includes(index);
          const nodeRadius = isActive ? 6 : 4;
          const opacity = isActive ? 1 : 0.6;
          const color = isActive ? "#10B981" : "#3B82F6";
          
          // Glow for active nodes
          if (isActive) {
            ctx.shadowColor = "#10B981";
            ctx.shadowBlur = 15;
          }
          
          // Draw node
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.fill();
          
          // Reset shadow
          ctx.shadowBlur = 0;
          
          // Draw city label
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#94A3B8";
          ctx.globalAlpha = 0.8;
          ctx.fillText(city.name, x + 8, y - 8);
          
          // Draw connection lines between active nodes
          if (isActive) {
            cities.forEach((otherCity, otherIndex) => {
              if (otherIndex !== index && activeNodes.includes(otherIndex)) {
                const otherLatRad = (otherCity.lat * Math.PI) / 180;
                const otherLngRad = ((otherCity.lng + rotation) * Math.PI) / 180;
                
                const otherX = centerX + radius * Math.cos(otherLatRad) * Math.sin(otherLngRad);
                const otherY = centerY - radius * Math.sin(otherLatRad) * 0.8;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(otherX, otherY);
                ctx.strokeStyle = "#10B981";
                ctx.globalAlpha = 0.2;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            });
          }
        }
      });

      // Draw data pulses
      const time = Date.now() / 1000;
      for (let i = 0; i < 5; i++) {
        const pulseAngle = (time * 0.5 + i * 72) * (Math.PI / 180);
        const pulseX = centerX + radius * 1.2 * Math.cos(pulseAngle);
        const pulseY = centerY + radius * 0.3 * Math.sin(pulseAngle);
        
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#3B82F6";
        ctx.globalAlpha = 0.4 + Math.sin(time * 3 + i) * 0.2;
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [mounted, rotation, activeNodes]);

  const rotateX = (mousePos.y - 0.5) * 10;
  const rotateY = (mousePos.x - 0.5) * -10;

  return (
    <div style={{ 
      background: "#0A0C10", 
      minHeight: "100vh", 
      color: "#fff", 
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      letterSpacing: "-0.02em",
      overflowX: "hidden"
    }}>
      
      {/* ── SYSTEM GRID BACKGROUND ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity: 0.4,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)"
      }} />

      {/* ── AMBIENT LIGHT SOURCES ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "60vw",
          height: "60vh",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(80px)"
        }} />
        <div style={{
          position: "absolute",
          bottom: "0%",
          right: "10%",
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          filter: "blur(80px)"
        }} />
      </div>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 8vw",
        zIndex: 10
      }}>
        
        {/* ── NETWORK GLOBE VISUALIZATION ── */}
        <div style={{
          position: "absolute",
          right: "0",
          top: "50%",
          transform: `translateY(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          width: "55%",
          height: "80vh",
          perspective: "2000px",
          pointerEvents: "none",
          transition: "transform 0.1s ease-out"
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            
            {/* Canvas Globe */}
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "700px",
                maxHeight: "700px",
                filter: "drop-shadow(0 0 40px rgba(59,130,246,0.3))"
              }}
            />

            {/* Orbiting Network Indicators */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "20px",
                  height: "20px",
                  transform: `translate(-50%, -50%) rotate(${i * 60 + rotation}deg) translateX(280px)`,
                  animation: `pulse ${2 + i * 0.3}s infinite`
                }}
              >
                <Radio size={16} color="#3B82F6" opacity={0.3} />
              </div>
            ))}

            {/* Network Stats Overlay */}
            <div style={{
              position: "absolute",
              bottom: "20%",
              left: "10%",
              background: "rgba(10,12,16,0.8)",
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: "12px",
              padding: "16px",
              backdropFilter: "blur(10px)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Satellite size={12} color="#3B82F6" />
                <span style={{ color: "#94A3B8" }}>NETWORK STATUS</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                <div>
                  <div style={{ color: "#3B82F6" }}>LATENCY</div>
                  <div style={{ color: "#fff", fontSize: "14px" }}>24ms</div>
                </div>
                <div>
                  <div style={{ color: "#10B981" }}>PACKETS</div>
                  <div style={{ color: "#fff", fontSize: "14px" }}>1.2K/s</div>
                </div>
              </div>
            </div>

            {/* Active Connections */}
            <div style={{
              position: "absolute",
              top: "20%",
              right: "10%",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {activeNodes.map((nodeIndex, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: "20px",
                    padding: "4px 12px",
                    animation: "slideIn 0.3s ease-out"
                  }}
                >
                  <Wifi size={12} color="#10B981" />
                  <span style={{ fontSize: "11px", color: "#10B981" }}>
                    {cities[nodeIndex].name} · ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ position: "relative", zIndex: 20, maxWidth: "650px" }}>
          
          {/* System Status Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "40px",
            backdropFilter: "blur(10px)"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10B981",
              animation: "pulse 2s infinite"
            }} />
            <span style={{
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#94A3B8",
              letterSpacing: "0.1em"
            }}>
            
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: "clamp(56px, 8vw, 96px)",
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            margin: "0 0 32px"
          }}>
            The global
            <br />
            <span style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              identity network
            </span>
            <br />
            for builders.
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "18px",
            color: "#94A3B8",
            lineHeight: 1.7,
            marginBottom: "48px",
            maxWidth: "540px"
          }}>
            A distributed network for your technical presence. Real-time sync across 
            24 global edge nodes, instant analytics, and zero-compromise security.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/auth/signin" style={{
              background: "#3B82F6",
              color: "#fff",
              padding: "18px 40px",
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              Join Network <ArrowRight size={18} />
            </Link>
            <Link href="/docs" style={{
              background: "rgba(255,255,255,0.02)",
              color: "#fff",
              padding: "18px 40px",
              borderRadius: "14px",
              fontWeight: 600,
              fontSize: "16px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)"
            }}>
              Network Status
            </Link>
          </div>

          {/* Network Metrics Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px",
            marginTop: "80px"
          }}>
            {metrics.map((metric, i) => (
              <div key={i}>
                <metric.icon size={18} color={metric.color} style={{ marginBottom: "8px" }} />
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>{metric.value}</div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NETWORK MAP ── */}
      <section style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        padding: "40px 0",
        background: "rgba(255,255,255,0.01)",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          opacity: 0.5
        }}>
          {["N. AMERICA", "EUROPE", "ASIA", "PACIFIC", "S. AMERICA", "AFRICA"].map(region => (
            <span key={region} style={{
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "#64748B"
            }}>
              {region}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section style={{
        padding: "140px 8vw",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* Section Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "80px",
            flexWrap: "wrap",
            gap: "40px"
          }}>
            <div>
              <div style={{
                fontSize: "12px",
                color: "#3B82F6",
                fontWeight: 700,
                letterSpacing: "0.3em",
                marginBottom: "16px"
              }}>
                NETWORK ARCHITECTURE
              </div>
              <h2 style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.1
              }}>
                Distributed by design.
                <br />
                Connected globally.
              </h2>
            </div>
            
            {/* Network Specs */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "20px",
              padding: "24px 32px"
            }}>
              {specs.map((spec, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>{spec.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#3B82F6" }}>{spec.value}</span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "4px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "2px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${spec.progress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                      borderRadius: "2px"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: "24px",
            overflow: "hidden"
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "#0A0C10",
                  padding: "48px",
                  transition: "all 0.3s",
                  borderRight: i % 3 !== 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderBottom: i < features.length - 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  cursor: "default"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.04)";
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0A0C10";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <feature.icon size={28} color={feature.color} />
                  <span style={{
                    fontSize: "12px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: feature.color,
                    background: `${feature.color}10`,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: `1px solid ${feature.color}20`
                  }}>
                    {feature.subsystem}
                  </span>
                </div>
                
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
                  {feature.title}
                </h3>
                
                <p style={{ color: "#94A3B8", lineHeight: 1.7, fontSize: "14px", marginBottom: "24px" }}>
                  {feature.desc}
                </p>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: feature.color
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{feature.metric}</span>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: feature.color }} />
                  <span>global</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NETWORK NODES PREVIEW ── */}
      <section style={{
        padding: "100px 8vw 200px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center"
        }}>
          
          {/* Node Map Preview */}
          <div style={{
            background: "rgba(20,22,27,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "32px",
            padding: "40px",
            backdropFilter: "blur(20px)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <MapPin size={16} color="#3B82F6" />
              <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "'JetBrains Mono', monospace" }}>
                ACTIVE NETWORK NODES
              </span>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              marginBottom: "32px"
            }}>
              {cities.map((city, i) => (
                <div
                  key={city.name}
                  style={{
                    padding: "12px",
                    background: activeNodes.includes(i) ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activeNodes.includes(i) ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"}`,
                    borderRadius: "12px",
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 600, color: activeNodes.includes(i) ? "#10B981" : "#fff" }}>
                    {city.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748B", marginTop: "4px" }}>
                    {activeNodes.includes(i) ? "● ONLINE" : "○ STANDBY"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: "16px",
              background: "rgba(16,185,129,0.04)",
              border: "1px solid rgba(16,185,129,0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{ fontSize: "13px", color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>
                ● NETWORK HEALTH
              </span>
              <span style={{ fontSize: "13px", color: "#94A3B8" }}>
                24/24 nodes operational
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 style={{
              fontSize: "42px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px"
            }}>
              Global network,
              <br />
              <span style={{ color: "#3B82F6" }}>local performance.</span>
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#94A3B8",
              lineHeight: 1.7,
              marginBottom: "32px"
            }}>
              Your profile is served from the nearest edge node to your visitors. 
               50ms latency anywhere in the world.
            </p>
            <Link href="/auth/signin" style={{
              color: "#3B82F6",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid rgba(59,130,246,0.3)",
              paddingBottom: "4px"
            }}>
              View network map <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: "0 8vw 120px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          borderRadius: "40px",
          padding: "80px 60px",
          border: "1px solid rgba(59,130,246,0.2)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Network Pattern Background */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 30% 50%, rgba(59,130,246,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(139,92,246,0.1) 0%, transparent 50%)
            `,
            opacity: 0.5
          }} />

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
            <div>
              <h2 style={{ fontSize: "48px", fontWeight: 800, marginBottom: "16px" }}>
                Join the network?
              </h2>
              <p style={{ fontSize: "18px", color: "#94A3B8" }}>
                Deploy your profile across our global edge network.
              </p>
            </div>
            <Link href="/auth/signin" style={{
              background: "#fff",
              color: "#000",
              padding: "20px 48px",
              borderRadius: "16px",
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              Initialize connection <ArrowRight size={18} />
            </Link>
          </div>

          {/* Network Badges */}
          <div style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            paddingTop: "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)"
          }}>
            {["24 Global Nodes", "Edge Cached", "DDoS Protected", "99.99% Uptime"].map((badge, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Network size={14} color="#3B82F6" />
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "48px 8vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px", fontWeight: 800 }}>
            Dev<span style={{ color: "#3B82F6" }}>Links</span>
          </span>
          <span style={{
            fontSize: "10px",
            padding: "2px 6px",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "4px",
            color: "#3B82F6",
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            v2.0
          </span>
        </div>
        
        <div style={{ display: "flex", gap: "48px" }}>
          {["Network", "Nodes", "Status", "Docs"].map(item => (
            <Link key={item} href="#" style={{
              fontSize: "14px",
              color: "#94A3B8",
              textDecoration: "none"
            }}>
              {item}
            </Link>
          ))}
        </div>

        <span style={{ fontSize: "12px", color: "#475569" }}>
          © 2026 · Global Edge Network
        </span>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}