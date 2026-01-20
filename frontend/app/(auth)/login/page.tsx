"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, signInWithEmail } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole, getDefaultRedirectPath } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();
  const { userRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();

      if (result.success && result.idToken && result.user) {
        console.log("Login successful!");
        console.log("ID Token (JWT) for backend:", result.idToken);
        console.log("User UID:", result.user.uid);

        // Role is automatically loaded from localStorage by AuthContext
        // based on the user's UID after Firebase auth completes
        // Give AuthContext a moment to load the role
        setTimeout(() => {
          // Get the stored role for this user
          const storedRole = localStorage.getItem(`eduskill_user_role_${result.user!.uid}`);
          const role = (storedRole as UserRole) || UserRole.CUSTOMER;

          console.log("User role from storage:", role);
          router.push(getDefaultRedirectPath(role));
        }, 100);
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithEmail(email, password);

      if (result.success && result.idToken && result.user) {
        console.log("Login successful!");
        console.log("ID Token (JWT) for backend:", result.idToken);

        // Get the stored role for this user
        setTimeout(() => {
          const storedRole = localStorage.getItem(`eduskill_user_role_${result.user!.uid}`);
          const role = (storedRole as UserRole) || UserRole.CUSTOMER;

          console.log("User role from storage:", role);
          router.push(getDefaultRedirectPath(role));
        }, 100);
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#52abff] to-[#20578f] relative overflow-hidden">
        <Link href="/" className="absolute top-6 left-6 z-50 cursor-pointer text-xl font-semibold italic text-white">
          EduSkill
        </Link>
        <Image src="/assets/images/hero-girl.png" alt="Auth Background" width={450} height={450} className="object-cover absolute bottom-0 right-[-10]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full"></div>

        <div className="flex flex-col justify-center items-start p-16 relative z-10">
          <h2 className="text-4xl font-light text-white leading-snug">
            Welcome back,
            <br />
            <span className="font-semibold">We&apos;re happy to see you</span>
          </h2>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Login</h1>
            <p className="text-gray-500 text-sm">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Error Message */}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-5 flex-col sm:flex-row">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-white hover:bg-black/85"
            >
              <FcGoogle size={24} />
              {loading ? "Signing in..." : "Login with Google"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {/* Email Address */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#52abff] focus:ring-1 focus:ring-[#52abff] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#52abff] focus:ring-1 focus:ring-[#52abff] transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#52abff] hover:text-[#20578f] transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#52abff] hover:bg-[#20578f] text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#52abff] hover:text-[#20578f] font-medium transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
