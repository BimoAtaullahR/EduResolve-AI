"use client";

import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "#courses" },
  { name: "Instructors", href: "#instructors" },
  { name: "Blog", href: "#blog" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="w-full py-4 px-6 md:px-12 lg:px-20 bg-primary-blue">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold italic text-white">EduSkill</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-white text-sm font-medium hover:text-blue-600 transition-colors duration-200">
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/register"
          className="group relative hidden md:flex items-center justify-between gap-2 font-bold bg-white border border-gray-200 text-gray-800 pl-4 pr-0.5 py-0.5 rounded-full text-sm hover:border-blue-400 transition-all duration-300 shadow-sm overflow-hidden"
        >
          {/* Teks: Akan tergeser/menghilang saat di-hover */}
          <span className="relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2">Registration</span>

          {/* Lingkaran Biru: Akan membesar memenuhi background saat hover */}
          <div className="absolute right-0.5 w-9 h-9 bg-blue-400 rounded-full transition-all duration-500 ease-in-out group-hover:w-[calc(100%-4px)] group-hover:h-[calc(100%-4px)] flex items-center justify-center z-0">
            <svg className="w-4 h-4 text-white relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>

          {/* Spacer agar lebar tombol tetap terjaga saat teks ada */}
          <div className="w-9 h-9 invisible"></div>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
