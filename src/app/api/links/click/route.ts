/**
 * @file src/app/api/links/click/route.ts
 * @description API route to increment click count when a public visitor clicks a link.
 *
 * Method: POST
 * Body:   { userId: string, linkId: string }
 *
 * What it does:
 * - Receives a click event from the public profile page
 * - Updates the `clicks` counter in Firestore using `increment()` (atomic, race-condition safe)
 * - Returns 200 on success, 400 if params are missing, 500 on error
 *
 * Why an API route instead of calling Firestore from the client?
 * - The public profile page is a Server Component and can't use client-side Firestore SDK
 * - Keeps database write logic on the server where it's more secure
 * - `increment()` is atomic — two simultaneous clicks won't overwrite each other
 *
 * This follows the Next.js App Router API route convention:
 * File at `app/api/links/click/route.ts` → accessible at `/api/links/click`
 */

import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const { userId, linkId } = await request.json();

    if (!userId || !linkId) {
      return NextResponse.json(
        { error: "userId and linkId are required" },
        { status: 400 }
      );
    }

    // `increment(1)` is a Firestore server-side atomic operation
    // It's safe even if multiple requests arrive simultaneously
    const linkRef = doc(db, "users", userId, "links", linkId);
    await updateDoc(linkRef, { clicks: increment(1) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}