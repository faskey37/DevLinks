"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { db, storage, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ExternalLink, CheckCircle2, Camera, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const schema = z.object({
  displayName: z.string().min(2).max(50),
  username: z
    .string().min(3).max(30)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  bio: z.string().max(160).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch,
    formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (userProfile) {
      reset({
        displayName: userProfile.displayName,
        username: userProfile.username,
        bio: userProfile.bio ?? "",
      });
      setPhotoPreview(userProfile.photoURL ?? "");
    }
  }, [userProfile, reset]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/signin");
  }, [user, authLoading, router]);

  if (authLoading || !userProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const watchedUsername = watch("username", userProfile.username);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      setServerError("Image must be under 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setServerError("Only JPG, PNG and WebP images are allowed");
      return;
    }

    setUploading(true);
    setServerError("");

    // Store current photoURL before try block so it's accessible in catch
    const fallbackPhoto = userProfile?.photoURL ?? "";

    try {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);

      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser!, { photoURL: downloadURL });

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString(),
      });

      setPhotoPreview(downloadURL);
    } catch (e) {
      setServerError("Failed to upload photo. Please try again.");
      // Use the stored fallback — no null risk here
      setPhotoPreview(fallbackPhoto);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormValues) {
    if (!user) return;
    setServerError("");

    if (data.username !== userProfile.username) {
      const q = query(collection(db, "users"), where("username", "==", data.username));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setServerError("This username is already taken.");
        return;
      }
    }

    await updateDoc(doc(db, "users", user.uid), {
      displayName: data.displayName,
      username: data.username,
      bio: data.bio ?? "",
      updatedAt: new Date().toISOString(),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-[#020408] text-white">
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold">Profile Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Customize how you appear on your public page
          </p>
        </div>

        {/* Photo upload */}
        <div className="mb-6 flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="relative">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Avatar"
                width={72}
                height={72}
                className="rounded-full object-cover ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-500 disabled:opacity-50"
            >
              {uploading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Camera className="h-3.5 w-3.5" />
              }
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-semibold">{userProfile.displayName}</p>
            <p className="text-sm text-slate-500">@{userProfile.username}</p>
            <p className="mt-1 text-xs text-slate-600">JPG, PNG or WebP · Max 2MB</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Display Name</label>
              <input
                {...register("displayName")}
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
              {errors.displayName && (
                <p className="mt-1 text-xs text-red-400">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Username</label>
              <div className="flex rounded-xl border border-white/5 bg-white/[0.03] focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10">
                <span className="flex items-center pl-4 text-sm text-slate-500">devlinks.app/</span>
                <input
                  {...register("username")}
                  className="flex-1 bg-transparent py-2.5 pr-4 text-sm text-white outline-none"
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
              )}
              {watchedUsername && !errors.username && (
                <Link
                  href={`/${watchedUsername}`}
                  target="_blank"
                  className="mt-1 flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  Preview profile <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Bio <span className="text-xs text-slate-500">(max 160 chars)</span>
              </label>
              <textarea
                {...register("bio")}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                placeholder="Full-stack developer passionate about open source..."
              />
              {errors.bio && (
                <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}