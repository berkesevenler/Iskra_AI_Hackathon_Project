"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import IskraLogo from "@/components/IskraLogo";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-cream border-t border-cream-dark">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <IskraLogo size={22} color="#1A1A1A" className="opacity-70" />
            <div className="flex flex-col">
              <span className="text-dark text-sm font-bold tracking-wider leading-tight">
                ONE CLICK AI
              </span>
              <span className="text-dark-soft/40 text-[8px] tracking-[0.12em] leading-tight">
                BY ISKRA AI
              </span>
            </div>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-dark-soft/60 hover:text-dark text-sm transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-dark-soft/60 hover:text-dark text-sm transition-colors duration-300"
            >
              Product
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-5 border-t border-cream-dark/60">
        <p className="text-dark-soft/40 text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Iskra AI
        </p>
      </div>
    </footer>
  );
}
