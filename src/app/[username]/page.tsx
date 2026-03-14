"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, Link as LinkType } from "@/types";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { Loader2, Sparkles, ShieldCheck, Share2 } from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;

    async function fetchProfileAndLinks() {
      try {
        const usersQuery = query(collection(db, "users"), where("username", "==", username));
        const userSnapshot = await getDocs(usersQuery);

        if (userSnapshot.empty) {
          setNotFound(true);
          return;
        }

        const userDoc = userSnapshot.docs[0];
        const userProfile = userDoc.data() as UserProfile;
        const uid = userDoc.id;
        setProfile(userProfile);

        try {
          const linksQuery = query(collection(db, "users", uid, "links"), orderBy("order", "asc"));
          const linksSnapshot = await getDocs(linksQuery);
          setLinks(linksSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as LinkType[]);
        } catch {
          const linksQuery = query(collection(db, "users", uid, "links"));
          const linksSnapshot = await getDocs(linksQuery);
          setLinks(linksSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as LinkType[]);
        }
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndLinks();
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020408]">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div className="absolute inset-0 blur-2xl bg-blue-500/20" />
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#020408] px-6 text-center">
        <div className="mb-6 text-6xl">🔍</div>
        <h1 className="text-3xl font-black tracking-tighter text-white">User not found</h1>
        <p className="mt-2 text-slate-400">The username <span className="text-blue-400 font-mono">@{username}</span> doesn't exist.</p>
        <a href="/" className="mt-8 rounded-2xl bg-white px-8 py-3 font-bold text-black transition-transform hover:scale-105">Go Home</a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020408] text-white">
      
      {/* ── DYNAMIC MESH BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-xl px-6 py-20">
        
        {/* ── PROFILE CARD ── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="relative group mb-6">
            {/* Avatar Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl group-hover:bg-blue-500/40 transition-all" />
            
            {profile.photoURL ? (
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/10 p-1 bg-white/5 backdrop-blur-md">
                <Image
                  src={profile.photoURL}
                  alt={profile.displayName}
                  width={112}
                  height={112}
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-3xl font-black text-white shadow-2xl">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Verified Badge */}
            <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg border-4 border-[#020408]">
              <ShieldCheck size={14} fill="currentColor" className="text-white" />
            </div>
          </div>

          <h1 className="flex items-center gap-2 text-3xl font-black tracking-tighter">
            {profile.displayName}
          </h1>
          
          <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1 backdrop-blur-md">
            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">@{profile.username}</span>
          </div>

          {profile.bio && (
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-400 font-medium">
              {profile.bio}
            </p>
          )}

          {/* Share Action */}
          <button className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            <Share2 size={14} /> SHARE PROFILE
          </button>
        </div>

        {/* ── LINKS STACK ── */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 py-16 text-center bg-white/[0.01]">
              <p className="text-slate-500 font-medium">This profile is still being built...</p>
            </div>
          ) : (
            links.map((link, idx) => (
              <div 
                key={link.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <PublicLinkButton
                  link={link}
                  userId={profile.uid}
                />
              </div>
            ))
          )}
        </div>

        {/* ── BRAND FOOTER ── */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <a
            href="/"
            className="group relative flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/10 px-6 py-3 transition-all hover:bg-white/[0.08] hover:border-blue-500/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles size={16} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase leading-none mb-1">Created with</p>
              <p className="text-sm font-black tracking-tight text-white">DevLinks</p>
            </div>
            <div className="ml-4 h-6 w-px bg-white/10" />
            <span className="ml-2 text-xs font-bold text-blue-400">Join free</span>
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(16px); } to { transform: translateY(0); } }
        .animate-in { animation: fade-in 0.5s ease-out, slide-in-from-bottom-4 0.5s ease-out; }
      `}</style>
    </div>
  );
}