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
import { Loader2, ExternalLink, CheckCircle2, Camera, User, Sparkles, Fingerprint, AlertCircle } from "lucide-react";
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
      reset({ displayName: userProfile.displayName, username: userProfile.username, bio: userProfile.bio ?? "" });
      setPhotoPreview(userProfile.photoURL ?? "");
    }
  }, [userProfile, reset]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/signin");
  }, [user, authLoading, router]);

  if (authLoading || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020408]">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div className="absolute inset-0 blur-2xl bg-blue-500/20" />
        </div>
      </div>
    );
  }

  const watchedUsername = watch("username", userProfile.username);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { setServerError("Image must be under 2MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setServerError("Only JPG, PNG and WebP allowed"); return; }

    setUploading(true);
    setServerError("");

    try {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });
      await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL, updatedAt: new Date().toISOString() });
      setPhotoPreview(downloadURL);
    } catch (e) {
      setServerError("Upload failed.");
      setPhotoPreview(userProfile.photoURL ?? "");
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
      if (!snap.empty) { setServerError("This username is already taken."); return; }
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
    <div className="min-h-screen bg-[#020408] text-white selection:bg-blue-500/30">
      
      {/* ── BACKGROUND ACCENTS ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-6 py-24">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Fingerprint size={14} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Identity Settings</span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tighter">Profile Configuration</h1>
          <p className="mt-2 text-sm text-slate-400">Customize your digital fingerprint across the platform.</p>
        </div>

        {/* ── PHOTO UPLOADER ── */}
        <div className="mb-8 group flex items-center gap-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-white/10">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/40 transition-all rounded-full" />
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/5 bg-white/5 backdrop-blur-md">
              {photoPreview ? (
                <Image src={photoPreview} alt="Avatar" width={96} height={96} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                  <User size={32} className="text-white" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
          
          <div className="flex-1">
            <p className="text-lg font-bold tracking-tight">{userProfile.displayName}</p>
            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest">@{userProfile.username}</p>
            <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">JPG, PNG or WebP · MAX 2MB</p>
          </div>
        </div>

        {/* ── SETTINGS FORM ── */}
        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-3xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input {...register("displayName")} 
                className="w-full rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3.5 text-sm outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-600" 
                placeholder="How should we call you?" />
              {errors.displayName && <p className="text-xs text-red-400 font-medium ml-1">{errors.displayName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="group relative flex items-center">
                <span className="absolute left-0 text-sm text-slate-600 font-mono px-4">devlinks.app/</span>
                <input {...register("username")} 
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-3.5 pl-[126px] pr-5 text-sm outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/1 " 
                  placeholder="Username" />
              </div>
              {errors.username && <p className="text-xs text-red-400 font-medium ml-1">{errors.username.message}</p>}
              {watchedUsername && !errors.username && (
                <Link href={`/${watchedUsername}`} target="_blank"
                  className="mt-2 flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                  <Sparkles size={12} /> Live Preview <ExternalLink size={10} />
                </Link>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
              <textarea {...register("bio")} rows={4}
                className="w-full resize-none rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3.5 text-sm outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-600" 
                placeholder="Tell your story in a few words..." />
              <div className="flex justify-end">
                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">160 Characters Max</span>
              </div>
            </div>

            {serverError && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400">
                <AlertCircle size={14} /> {serverError}
              </div>
            )}

            <button type="submit" disabled={isSubmitting || !isDirty}
              className="relative group w-full overflow-hidden rounded-2xl bg-white py-4 font-black text-black transition-all hover:bg-blue-500 hover:text-white disabled:opacity-20 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 
                 saved ? <><CheckCircle2 size={18} /> Profile Synce</> : "Update Identity"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}