"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);

  const quickLinks: FooterLink[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Instructors", href: "/instructors" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
  ];

  const categories: FooterLink[] = [
    { label: "UI/UX Design", href: "/categories/ui-ux-design" },
    { label: "Web Development", href: "/categories/web-development" },
    { label: "Digital Marketing", href: "/categories/digital-marketing" },
    { label: "Business Consulting", href: "/categories/business-consulting" },
    { label: "Language Learning", href: "/categories/language-learning" },
  ];

  const handleSubscribe = async () => {
    if (!email) return;

    setIsSubscribing(true);

    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(`Successfully subscribed with email: ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: MessageCircle, href: "https://skype.com", label: "Skype" },
  ];

  return (
    <footer id="contact" className="bg-black text-white">
      {/* Top Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Let&apos;s Connect with us</h2>
              <p className="text-gray-400 max-w-md">
                We&apos;re here to support your learning journey every step of the way.
                <br />
                Let&apos;s build your future, one lesson at a time.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/contact" className="px-8 py-3 border border-gray-600 rounded-full hover:bg-gray-900 transition-colors">
                Contact Us
              </Link>
              <Link href="/register" className="px-8 py-3 bg-primary-blue rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2">
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-45">
                  <path d="M3 13L13 3M13 3H3M13 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold">EduResolve</span>
            </Link>

            <h3 className="text-lg font-semibold mb-4">Subscribe our newsletter for Update</h3>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                aria-label="Email address"
              />
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing || !email}
                className="px-6 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                aria-label="Subscribe to newsletter"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe Now"}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Link</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Popular Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link href={category.href} className="text-gray-400 hover:text-white transition-colors">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@learnnix.com" className="hover:text-white transition-colors">
                  support@learnnix.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <address className="not-italic">1901 Thornridge Cir. Shiloh, Hawaii 81063</address>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">© {new Date().getFullYear()} EduResolve | Made With Passion by Hanan and Bimo </div>

            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
