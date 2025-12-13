"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function FloatingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] md:w-fit md:min-w-max rounded-full bg-white/90 px-4 md:px-6 py-3 shadow-lg backdrop-blur border border-primary/10">
        <div className="flex items-center justify-between md:gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Athenas Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-primary hover:text-secondary hover:bg-secondary/10 transition-all duration-200 px-4 py-2 rounded-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Divider - Desktop Only */}
            <div className="hidden md:block h-6 w-px bg-primary/20" />

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 hover:bg-secondary/10 rounded-full transition-colors duration-200"
            >
              <Heart className="w-5 h-5 text-primary" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary/10 rounded-full transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm">
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white rounded-3xl shadow-2xl p-6 border border-primary/10">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-medium text-primary hover:text-secondary hover:bg-secondary/10 transition-all duration-200 px-4 py-3 rounded-xl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
