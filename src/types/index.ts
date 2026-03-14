/**
 * @file src/types/index.ts
 * @description Shared TypeScript type definitions for the entire application.
 *
 * Why centralize types?
 * - Single source of truth — change a type here and TypeScript flags all affected files
 * - Makes data shape clear without reading Firestore documentation
 * - Enables autocomplete and type checking throughout the codebase
 *
 * Firestore data structure:
 * Collection: `users`
 *   └── Document: {userId}   ← maps to UserProfile
 *         └── Sub-collection: `links`
 *               └── Document: {linkId}  ← maps to Link
 */

/** A single link item saved by a user */
export interface Link {
  id: string;           // Firestore document ID
  title: string;        // Display label e.g. "My GitHub"
  url: string;          // Full URL e.g. "https://github.com/johndoe"
  icon?: string;        // Optional emoji or icon identifier
  order: number;        // Position in the list (for drag-and-drop reordering)
  clicks: number;       // How many times visitors have clicked this link
  createdAt: string;    // ISO timestamp string
}

/** A user's public profile stored in Firestore */
export interface UserProfile {
  uid: string;
  username: string;         // Unique slug used in public URL e.g. /johndoe
  displayName: string;
  bio: string;
  email: string;
  photoURL: string;
  theme: "default" | "minimal" | "gradient";
  links: Link[];
  createdAt: string;
  updatedAt: string;
}

/** Form values when creating or editing a link */
export interface LinkFormValues {
  title: string;
  url: string;
  icon?: string;
}

/** Form values when editing a user profile */
export interface ProfileFormValues {
  displayName: string;
  username: string;
  bio: string;
}