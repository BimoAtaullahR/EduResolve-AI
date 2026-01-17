"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background (Empty for now) */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary-blue to-primary-dark relative overflow-hidden">
        {/* Decorative circles */}
        <Link href="/" className="absolute top-6 left-6 z-50 cursor-pointer text-xl font-semibold italic text-white">
          EduSkill
        </Link>
        <Image src="/assets/images/cowok.webp" alt="Auth Background" width={450} height={450} className="object-cover absolute bottom-0 right-[-10]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full"></div>

        {/* Content placeholder */}
        <div className="flex flex-col justify-center items-start p-16 relative z-10">
          {/* Tagline */}
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Create account</h1>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-6 cursor-pointer flex-col sm:flex-row">
            <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border cursor-pointer border-gray-200 rounded-lg hover:bg-black hover:text-white transition-colors text-sm font-medium hover:text-white text-gray-700">
              <FcGoogle size={24} />
              Sign up with Google
            </button>

            <button className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border cursor-pointer border-gray-200 rounded-lg hover:bg-black hover:text-white transition-colors text-sm font-medium hover:text-white text-gray-700">
              <FaFacebook size={24} color="#387fc5" />
              Sign up with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Registration Form */}
          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#52abff] focus:ring-1 focus:ring-[#52abff] transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#52abff] focus:ring-1 focus:ring-[#52abff] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
            <button type="submit" className="w-full py-3.5 bg-[#52abff] hover:bg-[#20578f] text-white font-semibold rounded-lg transition-colors duration-200">
              Create Account
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
