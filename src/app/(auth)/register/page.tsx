"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/login?message=Check your email to confirm your registration");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 to-primary-600 p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">NOUN Success OS</h1>
          <p className="text-primary-200 text-sm mt-1">Join 10,000+ NOUN Students</p>
        </div>
        <div className="space-y-4">
          <p className="text-white text-2xl font-black leading-snug">"The smartest tool any NOUN student can have in 2026."</p>
          <p className="text-primary-200 text-sm">— Trusted by students across all NOUN study centres in Nigeria</p>
        </div>
        <p className="text-primary-300 text-xs">© 2026 NOUN Success OS. Free to use, forever.</p>
      </div>

      {/* Right register panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create your account</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">Free forever. No credit card required.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition"
                placeholder="e.g. Aminu Abdullahi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition"
                placeholder="you@noun.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 shadow-lg shadow-primary-100 transition mt-4"
            >
              {loading ? "Creating account..." : "Create Free Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
