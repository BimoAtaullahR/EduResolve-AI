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
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("/");

  // --- FUNGSI BARU: MENANGANI KLIK ---
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    // 1. Mencegah perilaku default (agar URL tidak sekadar berubah tanpa scroll)
    e.preventDefault();

    // 2. Logika Scroll
    if (href === "/") {
      // Jika Home, scroll ke paling atas
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      // Update URL manual (opsional, agar bersih)
      window.history.pushState(null, "", "/");
    } else {
      // Jika Link lain (#about, #courses, dll)
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);

      if (elem) {
        // Offset (jika perlu dikurangi tinggi navbar, misal 80px)
        const headerOffset = 80;
        const elementPosition = elem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Atau cara simpel tanpa offset:
        // elem.scrollIntoView({ behavior: "smooth" });

        // Update URL hash
        window.history.pushState(null, "", href);
      }
    }
  };

  useEffect(() => {
    const handleScrollSpy = () => {
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
            // Logika: Jika bagian atas elemen kurang dari 150px (sudah masuk viewport atas)
            // DAN bagian bawah elemen masih terlihat
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = link.href;
            }
          }
        }
      }

      setActiveLink(currentSection);
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  return (
    <header className={`fixed z-[1000] w-full py-4 px-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled ? "bg-white/60 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" onClick={(e) => handleScroll(e, "/")} className="flex items-center gap-2">
          <span className={`text-xl font-semibold italic ${isScrolled ? "text-black" : "text-white"}`}>EduResolve</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.href;
            const isBlueActive = isActive && link.href !== "/";

            return (
              <Link
                key={link.name}
                href={link.href}
                // TAMBAHKAN ONCLICK DI SINI
                onClick={(e) => handleScroll(e, link.href)}
                className={`text-sm font-medium transition-colors duration-200 
                  ${isBlueActive ? "text-primary-blue font-bold" : isScrolled ? "text-black hover:text-primary-blue" : "text-white hover:text-blue-200"}
                  ${isActive && link.href === "/" ? "font-bold" : ""} 
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

        {/* Mobile Menu Button */}
        <button className={`md:hidden p-2 ${isScrolled ? "text-black" : "text-white"}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
