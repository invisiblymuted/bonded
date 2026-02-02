import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { Search, BookOpen, LayoutGrid, Home, UserCircle } from "lucide-react";

export function Footer() {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brand-gradient-footer" x1="0%" y1="0%" x2="100%" y2="0">
            <stop offset="0%" stopColor="#2458a0" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>
      </svg>
      
      <footer className="py-6 border-t border-[#f0ede4] bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center gap-4">
            {/* Logo - Centered */}
            <Link href="/landing">
              <div className="flex items-center justify-center cursor-pointer group">
                <div className="h-10 w-10 flex items-center justify-center [&_svg]:fill-[url(#brand-gradient-footer)]">
                  <BondedLogo />
                </div>
              </div>
            </Link>

            {/* Navigation Icons - match header order: Home, Research, Get Help, Dashboard, Profile */}
            <div className="flex items-center gap-3 text-[#2458a0]">
              <Link href="/home">
                <div className="p-2 rounded-full icon-frame cursor-pointer" title="Home">
                  <Home className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/research">
                <div className="p-2 rounded-full icon-frame cursor-pointer" title="Research">
                  <BookOpen className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/help">
                <div className="p-2 rounded-full icon-frame cursor-pointer" title="Get Help">
                  <Search className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/app">
                <div className="p-2 rounded-full icon-frame cursor-pointer" title="Dashboard">
                  <LayoutGrid className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/profile">
                <div className="p-2 rounded-full icon-frame cursor-pointer" title="Profile">
                  <UserCircle className="h-4 w-4" />
                </div>
              </Link>
            </div>

            <p className="text-[10px] font-black text-[#2458a0] uppercase tracking-[0.3em] pt-3 opacity-30">
              © 2026 Bonded. All Connections Encrypted.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
