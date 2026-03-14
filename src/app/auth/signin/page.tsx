"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { slugify } from "@/lib/utils";
import {
  Eye, EyeOff, Loader2, Mail,
  ArrowRight, CheckCircle2, ShieldCheck, Sparkles,
} from "lucide-react";

const signInSchema = z.object({
  email:    z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const signUpSchema = signInSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
});
type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

async function createUserProfile(uid: string, displayName: string, email: string, photoURL = "") {
  const username = slugify(displayName) + "-" + uid.slice(0, 5);
  await setDoc(doc(db, "users", uid), {
    uid, username, displayName, email, photoURL,
    bio: "", theme: "default", links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export default function SignInPage() {
  const router = useRouter();
  const [tab, setTab]                   = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const signInForm = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
  const signUpForm = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  async function handleSignIn(data: SignInValues) {
    setLoading(true); setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, data.email, data.password);
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setError("Please verify your email first. A new link has been sent.");
        setLoading(false); return;
      }
      router.push("/dashboard");
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Sign in failed")
        .replace("Firebase: ", "").replace(/\(auth.*\)/, "").trim());
    } finally { setLoading(false); }
  }

  async function handleSignUp(data: SignUpValues) {
    setLoading(true); setError("");
    try {
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await sendEmailVerification(user);
      await createUserProfile(user.uid, data.displayName, data.email);
      setVerificationEmail(data.email);
      setVerificationSent(true);
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Sign up failed")
        .replace("Firebase: ", "").replace(/\(auth.*\)/, "").trim());
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setLoading(true); setError("");
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const profileDoc = await getDoc(doc(db, "users", user.uid));
      if (!profileDoc.exists()) {
        await createUserProfile(user.uid, user.displayName ?? "User", user.email ?? "", user.photoURL ?? "");
      }
      router.push("/dashboard");
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : "Google sign in failed")
        .replace("Firebase: ", "").replace(/\(auth.*\)/, "").trim());
    } finally { setLoading(false); }
  }

  // ── Verification sent screen ──────────────────────────
  if (verificationSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020408] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-500/10 border border-blue-500/20">
            <Mail className="h-10 w-10 text-blue-500 animate-bounce" />
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Check your email</h1>
          <p className="mt-4 text-slate-400 leading-relaxed">
            We've dispatched a secure link to{" "}
            <span className="text-blue-400 font-bold">{verificationEmail}</span>.
          </p>
          <div className="mt-8 rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-left backdrop-blur-xl">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-widest">Next Step</p>
                <p className="mt-1 text-sm text-slate-400">
                  Verify your inbox to activate your developer profile.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setVerificationSent(false); setTab("signin"); }}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-black text-black transition hover:bg-blue-500 hover:text-white"
          >
            Return to Sign In <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── Main auth form ────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020408] px-6 py-20 selection:bg-blue-500/30">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-3xl shadow-2xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="group relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <ShieldCheck size={32} className="text-white group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1">
                <Sparkles size={16} className="text-blue-300 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              {tab === "signin" ? "Welcome back" : "Ship Your Page"}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {tab === "signin" ? "Sign in to your DevLinks dashboard" : "Join developers building in public"}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex rounded-2xl bg-white/5 p-1.5 border border-white/5">
            {(["signin", "signup"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${
                  tab === t ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
                }`}>
                {t === "signin" ? "Login" : "Join"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              {error}
            </div>
          )}

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="group mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] py-4 text-sm font-bold text-white transition hover:bg-white/[0.08] disabled:opacity-50">
            <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0b0f1a] px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                Secure Email Login
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={tab === "signin"
              ? signInForm.handleSubmit(handleSignIn)
              : signUpForm.handleSubmit(handleSignUp)
            }
            className="space-y-5"
          >
            {tab === "signup" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Full Name
                </label>
                <input
                  {...signUpForm.register("displayName")}
                  placeholder="John Doe"
                  className="input-field"
                />
                {signUpForm.formState.errors.displayName && (
                  <p className="text-xs text-red-400 ml-1">{signUpForm.formState.errors.displayName.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <input
                {...(tab === "signin" ? signInForm.register("email") : signUpForm.register("email"))}
                type="email"
                placeholder="dev@stack.com"
                className="input-field"
              />
              {tab === "signin" && signInForm.formState.errors.email && (
                <p className="text-xs text-red-400 ml-1">{signInForm.formState.errors.email.message}</p>
              )}
              {tab === "signup" && signUpForm.formState.errors.email && (
                <p className="text-xs text-red-400 ml-1">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...(tab === "signin" ? signInForm.register("password") : signUpForm.register("password"))}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {tab === "signin" && signInForm.formState.errors.password && (
                <p className="text-xs text-red-400 ml-1">{signInForm.formState.errors.password.message}</p>
              )}
              {tab === "signup" && signUpForm.formState.errors.password && (
                <p className="text-xs text-red-400 ml-1">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative group w-full overflow-hidden rounded-2xl bg-white py-4 font-black text-black transition-all hover:bg-blue-600 hover:text-white disabled:opacity-20 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading
                  ? <Loader2 size={18} className="animate-spin" />
                  : tab === "signin" ? "Enter Dashboard" : "Create Developer ID"
                }
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Global input styles — forces white text on all inputs on this page */}
      <style>{`
        .input-field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          padding: 14px 20px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          color: #ffffff !important;
          caret-color: #3B82F6;
          -webkit-text-fill-color: #ffffff;
        }
        .input-field::placeholder {
          color: #475569;
          -webkit-text-fill-color: #475569;
        }
        .input-field:focus {
          border-color: rgba(59,130,246,0.5);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
        }
        .input-field:-webkit-autofill,
        .input-field:-webkit-autofill:hover,
        .input-field:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px #0d1117 inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}