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
          {" "}
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
          className="hidden md:flex items-center gap-2 font-bold bg-white border border-gray-200 text-gray-800 pl-4 pr-0.5 py-0.5 rounded-full  text-sm hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
        >
          Registration
          <div className="bg-blue-400 rounded-full p-2.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
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
