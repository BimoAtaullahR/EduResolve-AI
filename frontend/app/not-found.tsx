"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-blue/5 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-accent-yellow/10 blur-3xl"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-primary-dark/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Brand Name */}
        <h1 className="text-2xl font-bold text-primary-dark mb-8">EduResolve</h1>

        {/* 404 Text */}
        <div className="relative">
          <h2 className="text-[150px] md:text-[200px] font-bold text-primary-blue leading-none opacity-10 select-none">404</h2>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page Not Found</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Oops! The page you are looking for doesn&apos;t developed yet</p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-blue text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MoveLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-8 text-gray-400 text-sm">&copy; {new Date().getFullYear()} EduResolve. All rights reserved.</div>
    </div>
  );
}
