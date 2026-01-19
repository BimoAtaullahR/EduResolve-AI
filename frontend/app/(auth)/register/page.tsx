"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, signUpWithEmail } from "@/lib/firebase";
import { registerWithBackend } from "@/lib/api";
import { UserRole, RoleDisplayNames, RoleDescriptions, getDefaultRedirectPath } from "@/types/user";

// Storage key prefix for user role (cached locally after backend confirms)
const USER_ROLE_STORAGE_PREFIX = "eduskill_user_role_";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save role to localStorage (cache after backend confirms)
  const cacheUserRole = (uid: string, role: string) => {
    localStorage.setItem(`${USER_ROLE_STORAGE_PREFIX}${uid}`, role);
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Authenticate with Google via Firebase
      const result = await signInWithGoogle();

      if (!result.success || !result.idToken || !result.user) {
        setError(result.error || "Google sign-up failed. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Google Sign-up successful!");
      console.log("User UID:", result.user.uid);
      console.log("Selected role:", selectedRole);

      // Step 2: Register with backend (send ID token + role)
      const backendResult = await registerWithBackend({
        idToken: result.idToken,
        role: selectedRole,
        name: result.user.displayName || "",
        email: result.user.email || "",
      });

      if (!backendResult.success) {
        // If backend fails, still cache locally for demo purposes
        console.warn("Backend registration failed:", backendResult.error);
        cacheUserRole(result.user.uid, selectedRole);

        // Show warning but still allow redirect
        console.log("Falling back to local storage");
      } else {
        console.log("Backend registration successful:", backendResult.data);
        // Cache the role from backend response
        const userRole = backendResult.data?.user?.role || selectedRole;
        cacheUserRole(result.user.uid, userRole);
      }

      // Redirect based on role
      router.push(getDefaultRedirectPath(selectedRole));
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create user with Firebase
      const result = await signUpWithEmail(email, password, fullName);

      if (!result.success || !result.idToken || !result.user) {
        let errorMessage = result.error || "Sign-up failed. Please try again.";
        if (errorMessage.includes("email-already-in-use")) {
          errorMessage = "This email is already registered. Please sign in instead.";
        } else if (errorMessage.includes("invalid-email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (errorMessage.includes("weak-password")) {
          errorMessage = "Password is too weak. Please use a stronger password.";
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      console.log("Email Sign-up successful!");
      console.log("User UID:", result.user.uid);

      // Step 2: Register with backend
      const backendResult = await registerWithBackend({
        idToken: result.idToken,
        role: selectedRole,
        name: fullName,
        email: email,
      });

      if (!backendResult.success) {
        console.warn("Backend registration failed:", backendResult.error);
        cacheUserRole(result.user.uid, selectedRole);
      } else {
        console.log("Backend registration successful:", backendResult.data);
        const userRole = backendResult.data?.user?.role || selectedRole;
        cacheUserRole(result.user.uid, userRole);
      }

      // Redirect based on role
      router.push(getDefaultRedirectPath(selectedRole));
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
        <Image src="/assets/images/cowok.webp" alt="Auth Background" width={450} height={450} className="object-cover absolute bottom-0 right-[-10]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full"></div>

        <div className="flex flex-col justify-center items-start p-16 relative z-10">
          <h2 className="text-4xl font-light text-white leading-snug">
            Start Your Learning
            <br />
            <span className="font-semibold">Journey Today</span>
          </h2>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create account</h1>
            <p className="text-gray-500 text-sm">Join thousands of learners today!</p>
          </div>

          {/* Error Message */}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(UserRole).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${selectedRole === role ? "border-[#52abff] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRole === role ? "border-[#52abff]" : "border-gray-300"}`}>
                      {selectedRole === role && <div className="w-2 h-2 rounded-full bg-[#52abff]"></div>}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{RoleDisplayNames[role]}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">{RoleDescriptions[role]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-5 flex-col sm:flex-row">
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-white hover:bg-black/85"
            >
              <FcGoogle size={24} />
              {loading ? "Signing up..." : "Sign up with Google"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#52abff] focus:ring-1 focus:ring-[#52abff] transition-colors"
              />
            </div>

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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#52abff] hover:bg-[#20578f] text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-white"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#52abff] hover:text-[#20578f] font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
