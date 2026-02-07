"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import IskraLogo from "@/components/IskraLogo";

// Pages with dark hero backgrounds (white text by default)
const darkPages = ["/"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const isOnDarkPage = darkPages.includes(pathname);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const goingUp = currentY < lastScrollY.current;

      setAtTop(currentY < 20);

      if (currentY > 80) {
        setVisible(goingUp);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fully transparent nav: dark text on light pages, white text on dark pages
  const useDarkText = !isOnDarkPage;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-transparent ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <IskraLogo
                size={28}
                color={useDarkText && !isOpen ? "#1A1A1A" : "white"}
                className="transition-all duration-500"
              />
              <span
                className={`text-lg font-semibold tracking-wide transition-colors duration-500 ${
                  useDarkText && !isOpen ? "text-dark" : "text-white"
                }`}
              >
                ISKRA AI
              </span>
            </Link>

            {/* Desktop — CTA only */}
            <div className="hidden sm:flex items-center">
              <Link
                href="/dashboard"
                className="border border-accent text-accent hover:bg-accent hover:text-white px-6 py-2 text-sm tracking-widest font-medium transition-all duration-300"
              >
                TRY PRODUCT
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`sm:hidden transition-colors z-[60] ${
                isOpen
                  ? "text-white/80 hover:text-white"
                  : useDarkText
                    ? "text-dark-soft/80 hover:text-dark"
                    : "text-white/80 hover:text-white"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dark backdrop */}
        <div className="absolute inset-0 bg-dark" />

        {/* Menu content */}
        <div
          className={`relative z-10 flex flex-col justify-between h-full px-6 pt-28 pb-12 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0"
          }`}
        >
          {/* Navigation links */}
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-white/50 hover:text-white text-xs tracking-[0.2em] uppercase py-3 border-b border-white/10 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block text-white/50 hover:text-white text-xs tracking-[0.2em] uppercase py-3 border-b border-white/10 transition-colors duration-300"
            >
              Product
            </Link>
          </div>

          {/* CTA at bottom */}
          <div>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between w-full border border-accent text-accent hover:bg-accent hover:text-white px-6 py-4 text-sm tracking-widest font-medium transition-all duration-300"
            >
              TRY PRODUCT
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-white/20 text-xs tracking-wider mt-6 text-center">
              &copy; {new Date().getFullYear()} Iskra AI
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
