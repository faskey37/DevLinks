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
import { Loader } from "@/components/Loader";
import { Loader2 } from "lucide-react";

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
        // Step 1: fetch user profile by username
        const usersQuery = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const userSnapshot = await getDocs(usersQuery);

        if (userSnapshot.empty) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const userDoc = userSnapshot.docs[0];
        const userProfile = userDoc.data() as UserProfile;
        const uid = userDoc.id;
        setProfile(userProfile);

        // Step 2: fetch links from sub-collection using the uid
        try {
          const linksQuery = query(
            collection(db, "users", uid, "links"),
            orderBy("order", "asc")
          );
          const linksSnapshot = await getDocs(linksQuery);
          const fetchedLinks = linksSnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as LinkType[];
          setLinks(fetchedLinks);
        } catch {
          // If orderBy fails due to missing index, fetch without ordering
          const linksQuery = query(
            collection(db, "users", uid, "links")
          );
          const linksSnapshot = await getDocs(linksQuery);
          const fetchedLinks = linksSnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as LinkType[];
          setLinks(fetchedLinks);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndLinks();
  }, [username]);

  if (loading) return <Loader text="Loading profile..." />;

  if (notFound || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="font-display text-2xl font-bold">Profile not found</p>
        <p className="text-muted-foreground">
          No user with username{" "}
          <span className="font-mono text-brand-500">@{username}</span>
        </p>
        <a
          href="/"
          className="mt-4 rounded-xl bg-brand-500 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-600"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-400/10 blur-3xl dark:bg-brand-500/5" />
      </div>

      <div className="relative mx-auto max-w-lg px-4 py-16">

        {/* Avatar & Info */}
        <div className="mb-10 flex flex-col items-center text-center">
          {profile.photoURL ? (
            <div className="mb-4 overflow-hidden rounded-full ring-4 ring-brand-200 dark:ring-brand-800">
              <Image
                src={profile.photoURL}
                alt={profile.displayName}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 text-4xl font-bold text-white shadow-xl ring-4 ring-brand-200 dark:ring-brand-800">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="font-display text-2xl font-bold">
            {profile.displayName}
          </h1>
          <p className="mt-1 font-mono text-sm text-brand-600 dark:text-brand-400">
            @{profile.username}
          </p>
          {profile.bio && (
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center">
              <p className="text-muted-foreground">No links added yet.</p>
            </div>
          )}
          {links.map((link) => (
            <PublicLinkButton
              key={link.id}
              link={link}
              userId={profile.uid}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-center">
          <a
            href="/"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground transition hover:border-brand-300 hover:text-brand-600"
          >
            <span className="font-display font-semibold text-brand-500">
              DevLinks
            </span>
            <span>· Create yours free</span>
          </a>
        </div>
      </div>
    </div>
  );
}