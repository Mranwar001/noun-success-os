"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-indigo-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">NOUN Success OS</h1>
          <p className="text-primary-200 text-sm mt-1">Your Academic Command Center</p>
        </div>
        <div className="space-y-6">
          {[
            { icon: "🎓", title: "Course Manager", desc: "Track all your NOUN courses & deadlines in one place" },
            { icon: "🤖", title: "AI TMA Assistant", desc: "Analyze TMA questions and get structured answers instantly" },
            { icon: "📚", title: "Book Summarizer", desc: "Upload PDFs and get AI-powered chapter summaries" },
            { icon: "📝", title: "E-Exam Simulator", desc: "Practice with timed mock exams and get performance analytics" },
          ].map((f) => (
            <div key={f.title} className="flex items-start space-x-4">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{f.title}</p>
                <p className="text-primary-200 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-primary-300 text-xs">© 2026 NOUN Success OS. Empowering Distance Learners.</p>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome back!</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">Sign in to your NOUN Success OS account</p>
          </div>

          {searchParams?.message && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-xl text-sm text-center border border-green-100 dark:border-green-800">
              {searchParams.message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 shadow-lg shadow-primary-100 transition mt-4"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            New to NOUN Success OS?{" "}
            <Link href="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
