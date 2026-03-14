"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import { LinkCard } from "@/components/LinkCard";
import { AddLinkForm } from "@/components/AddLinkForm";
import {
  ExternalLink, PlusCircle,
  BarChart2, Link2, Copy, Check, AlertCircle, Sparkles, Layout,
} from "lucide-react";
import type { Link as LinkType } from "@/types";

function DevLinksLoader() {
  return (
    <div style={{ minHeight: "100vh", background: "#080C14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <svg width="72" height="72" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="20" fill="#0F172A"/>
        <rect width="80" height="80" rx="20" fill="none" stroke="#4338CA" strokeWidth="1.5"/>
        <path d="M16 16 L16 64 L32 64 Q54 64 54 40 Q54 16 32 16 Z" fill="none" stroke="#6366F1" strokeWidth="4.5" strokeLinejoin="round"/>
        <circle cx="66" cy="26" r="6" fill="#818CF8" style={{ animation: "nodePulse 1.8s ease-in-out infinite 0s" }}/>
        <circle cx="66" cy="40" r="6" fill="#6366F1" style={{ animation: "nodePulse 1.8s ease-in-out infinite 0.3s" }}/>
        <circle cx="66" cy="54" r="6" fill="#4338CA" style={{ animation: "nodePulse 1.8s ease-in-out infinite 0.6s" }}/>
      </svg>
      <div style={{ width: 200, height: 2, background: "#1E293B", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, #4338CA, #6366F1, #818CF8)",
          animation: "loadProgress 2.4s ease-in-out infinite",
        }}/>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#475569", letterSpacing: "0.08em" }}>
        Loading your dashboard...
      </span>
      <style>{`
        @keyframes nodePulse { 0%,100%{ opacity:0.2; } 50%{ opacity:1; } }
        @keyframes loadProgress { 0%{ width:0%; } 80%{ width:85%; } 100%{ width:100%; } }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink } = useLinks();
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/signin");
  }, [user, authLoading, router]);

  if (authLoading || linksLoading) return <DevLinksLoader />;
  if (!user || !userProfile) return null;

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const profileUrl = origin ? `${origin}/${userProfile.username}` : `/${userProfile.username}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-blue-500/30">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[0%] w-[30vw] h-[30vw] bg-purple-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24">

        {/* Email verification warning */}
        {!user.emailVerified && (
          <div className="mb-8 flex items-center gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-500">Action Required</p>
              <p className="text-xs text-yellow-500/70">Verify your email to unlock link analytics.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-blue-400">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Control Panel</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">
                Hey, {userProfile.displayName.split(" ")[0]}
              </h1>
            </div>
            <Link
              href={`/${userProfile.username}`}
              target="_blank"
              className="group flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold transition-all hover:bg-white/10 hover:border-white/20"
            >
              <span>Preview</span>
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </Link>
          </div>

          {/* Profile URL bar */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-2 pl-4 backdrop-blur-3xl">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="flex-1 truncate font-mono text-xs text-slate-400">
              {profileUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                copied
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95"
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="mb-10 grid grid-cols-2 gap-4">
          <div className="group rounded-3xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.05] hover:border-white/10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
              <BarChart2 size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter">{totalClicks.toLocaleString()}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Audience Clicks</p>
          </div>

          <div className="group rounded-3xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.05] hover:border-white/10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 transition-transform group-hover:scale-110">
              <Link2 size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter">{links.length}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Live Deployments</p>
          </div>
        </div>

        {/* Add Link */}
        {showForm ? (
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl">
            <AddLinkForm
              onAdd={async (data) => {
                await addLink(data);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="group relative mb-10 block w-full overflow-hidden rounded-3xl border-2 border-dashed border-white/5 py-8 transition-all hover:border-blue-500/50 hover:bg-blue-500/[0.02]"
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <PlusCircle size={24} />
              </div>
              <span className="text-sm font-bold text-slate-300">Add New Link</span>
            </div>
          </button>
        )}

        {/* Links List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 mb-4">
            <Layout size={14} className="text-slate-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Active Stack</h2>
          </div>

          {links.length === 0 ? (
            <div className="flex flex-col items-center rounded-[2.5rem] border border-white/5 bg-white/[0.01] py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-4xl grayscale opacity-50">
                🔗
              </div>
              <p className="text-lg font-bold">Your stack is empty</p>
              <p className="mt-2 text-sm text-slate-500 max-w-[240px]">
                Start building your profile by adding your first project link.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {links.map((link: LinkType) => (
                <li key={link.id} className="transition-all hover:translate-x-1">
                  <LinkCard
                    link={link}
                    onUpdate={(data) => updateLink(link.id, data)}
                    onDelete={() => deleteLink(link.id)} isDragging={false}                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}