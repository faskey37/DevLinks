"use client";

/**
 * @file src/hooks/useLinks.ts
 * @description Custom React hook for managing a user's links in Firestore.
 *
 * What it does:
 * - Fetches all links for the current user from Firestore in real-time
 * - Provides functions to add, update, delete, and reorder links
 * - Tracks loading and error states
 *
 * Why a custom hook?
 * - Keeps all Firestore logic in one place (separation of concerns)
 * - Components stay clean — they just call `addLink(data)` without knowing Firestore details
 * - Reusable — any component that needs links just imports this hook
 *
 * Firestore path: `users/{uid}/links`
 */

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link, LinkFormValues } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useLinks() {
  const { user } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLinks([]);
      setLoading(false);
      return;
    }

    // onSnapshot = real-time listener — updates state automatically when Firestore changes
    const linksRef = collection(db, "users", user.uid, "links");
    const q = query(linksRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Link[];
        setLinks(fetched);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /** Add a new link to the bottom of the list */
  async function addLink(data: LinkFormValues) {
    if (!user) return;
    const linksRef = collection(db, "users", user.uid, "links");
    await addDoc(linksRef, {
      ...data,
      order: links.length,       // place at end
      clicks: 0,
      createdAt: new Date().toISOString(),
    });
  }

  /** Update an existing link's title or URL */
  async function updateLink(id: string, data: Partial<LinkFormValues>) {
    if (!user) return;
    const linkRef = doc(db, "users", user.uid, "links", id);
    await updateDoc(linkRef, { ...data });
  }

  /** Permanently delete a link */
  async function deleteLink(id: string) {
    if (!user) return;
    const linkRef = doc(db, "users", user.uid, "links", id);
    await deleteDoc(linkRef);
  }

  /**
   * Reorder links after a drag-and-drop.
   * Uses a Firestore batch write so all order updates happen atomically.
   */
  async function reorderLinks(reordered: Link[]) {
    if (!user) return;
    const batch = writeBatch(db);
    reordered.forEach((link, index) => {
      const linkRef = doc(db, "users", user.uid, "links", link.id);
      batch.update(linkRef, { order: index });
    });
    await batch.commit();
  }

  /** Increment the click counter when a visitor clicks a link */
  async function recordClick(id: string) {
    if (!user) return;
    const linkRef = doc(db, "users", user.uid, "links", id);
    const current = links.find((l) => l.id === id);
    if (current) {
      await updateDoc(linkRef, { clicks: current.clicks + 1 });
    }
  }

  return { links, loading, error, addLink, updateLink, deleteLink, reorderLinks, recordClick };
}