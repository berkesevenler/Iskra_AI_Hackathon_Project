import Link from "next/link";
import IskraLogo from "@/components/IskraLogo";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-cream-dark">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <IskraLogo size={22} color="#1A1A1A" className="opacity-70" />
            <span className="text-dark text-sm font-semibold tracking-wide">
              ISKRA AI
            </span>
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
