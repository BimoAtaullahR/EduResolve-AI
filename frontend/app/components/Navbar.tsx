"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// 1. Definisi Tipe untuk Data Link
interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#about" },
  { name: "Courses", href: "#courses" },
  { name: "Instructors", href: "#instructors" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("/");

  useEffect(() => {
    const handleScroll = () => {
      // --- 1. Logika Background Navbar ---
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // --- 2. Logika Active Link (Scroll Spy) ---
      let currentSection = "/";

      // Jika masih di area paling atas (Hero section), paksa aktif ke "/"
      if (window.scrollY < 100) {
        currentSection = "/";
      } else {
        // Cek posisi setiap section
        for (const link of navLinks) {
          if (link.href === "/") continue;

          const sectionId = link.href.substring(1); // Hapus '#'
          const element = document.getElementById(sectionId);

          if (element) {
            const rect = element.getBoundingClientRect();
            // Offset 150px untuk kompensasi tinggi header fixed
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = link.href;
            }
          }
        }
      }

      setActiveLink(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed z-[1000] w-full py-4 px-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled ? "bg-white-blue/60 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-xl font-semibold italic ${isScrolled ? "text-black" : "text-white"}`}>EduResolve</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.href;

            // LOGIKA WARNA:
            // Jika Link AKTIF DAN BUKAN HOME -> Warna Primary Blue
            // Jika Link HOME (Aktif/Tidak) ATAU Link Lain (Tidak Aktif) -> Ikuti warna background (Scrolled=Hitam, Top=Putih)
            const isBlueActive = isActive && link.href !== "/";

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 
                  ${
                    isBlueActive
                      ? "text-primary-blue font-bold" // Style khusus active (kecuali home)
                      : isScrolled
                        ? "text-black hover:text-primary-blue"
                        : "text-white hover:text-blue-200" // Style default/home
                  }
                  ${isActive && link.href === "/" ? "font-bold" : ""} // Opsional: Tetap tebalkan Home jika aktif
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <Link
          href="/register"
          className="group relative hidden md:flex items-center justify-between gap-2 font-bold bg-white border border-gray-200 text-gray-800 pl-4 pr-0.5 py-0.5 rounded-full text-sm hover:border-blue-400 transition-all duration-300 shadow-sm overflow-hidden"
        >
          <span className="relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2">Registration</span>
          <div className="absolute right-0.5 w-9 h-9 bg-blue-400 rounded-full transition-all duration-500 ease-in-out group-hover:w-[calc(100%-4px)] group-hover:h-[calc(100%-4px)] flex items-center justify-center z-0">
            <svg className="w-4 h-4 text-white relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
          <div className="w-9 h-9 invisible"></div>
        </Link>

        {/* Mobile Menu Button - Juga menyesuaikan warna saat di-scroll agar terlihat */}
        <button className={`md:hidden p-2 ${isScrolled ? "text-black" : "text-white"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
