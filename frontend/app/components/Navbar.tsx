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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- FUNGSI BARU: MENANGANI KLIK ---
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    // 1. Mencegah perilaku default (agar URL tidak sekadar berubah tanpa scroll)
    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest("nav")) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`fixed z-[1000] w-full py-4 px-6 md:px-12 lg:px-20 transition-all duration-300 ${isScrolled ? "bg-white/60 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" onClick={(e) => handleScroll(e, "/")} className="flex items-center gap-2 z-[1001]">
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

        {/* CTA Button - Desktop */}
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
        <button onClick={toggleMobileMenu} className={`md:hidden p-2 z-[1001] ${isScrolled ? "text-black" : "text-white"}`} aria-label="Toggle menu">
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden" onClick={closeMobileMenu}></div>}

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[999] md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full pt-20 px-6">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeLink === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA Button */}
            <Link href="/register" onClick={closeMobileMenu} className="mt-8 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold rounded-lg transition-colors duration-200 shadow-md">
              Registration
            </Link>

            {/* Mobile Menu Footer */}
            <div className="mt-auto pb-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 text-center">© 2026 EduResolve</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
