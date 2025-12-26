"use client";

import Image from "next/image";
import { Heart, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function FloatingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/products", label: t("products") },
    { href: "/contact", label: t("contact") },
  ];

  // Entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle scroll effects for styling only
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav
        className={`fixed left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] md:w-fit md:min-w-max rounded-full px-4 md:px-6 py-3 shadow-lg backdrop-blur border transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 border-primary/15 shadow-xl"
            : "bg-white/90 border-primary/10"
        } ${isLoaded ? "top-6 opacity-100" : "-top-8 opacity-0"}`}
      >
        <div className="flex items-center justify-between md:gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo/logo.png"
              alt="Athenas Logo"
              width={300}
              height={80}
              className="h-[32px] md:h-[40px] w-auto object-contain"
              priority
              fetchPriority="high"
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
          <div className="flex items-center gap-2 shrink-0">
            {/* Divider - Desktop Only */}
            <div className="hidden md:block h-6 w-px bg-primary/20" />

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="p-2 hover:bg-secondary/10 rounded-full transition-colors duration-200 flex items-center gap-1"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase">
                {locale === "en" ? "AR" : "EN"}
              </span>
            </button>

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
