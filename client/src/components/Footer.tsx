import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brand-gradient-footer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2458a0" />
            <stop offset="100%" stopColor="#f26522" />
          </linearGradient>
        </defs>
      </svg>
      
      <footer className="py-6 border-t border-[#dcd7ca] bg-[#ede8dc]">
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

            {/* Navigation Icons - Centered below logo */}
            <div className="flex items-center gap-3 text-[#4a453e]">
              <Link href="/">
                <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Learn more">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10h5v-6h6v6h5V10" /></svg>
                </div>
              </Link>
              <Link href="/app">
                <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9h7V3H3v6zm11 0h7V3h-7v6zM3 21h7v-8H3v8zm11 0h7v-8h-7v8z" /></svg>
                </div>
              </Link>
              <Link href="/research">
                <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Research">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm0 0l6 6" /></svg>
                </div>
              </Link>
              <Link href="/profile">
                <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Profile">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" /></svg>
                </div>
              </Link>
              <Link href="/help">
                <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Get Help">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </Link>
            </div>

            <p className="text-[10px] font-black text-[#4a453e] uppercase tracking-[0.3em] pt-3 opacity-30">
              © 2026 Bonded. All Connections Encrypted.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
