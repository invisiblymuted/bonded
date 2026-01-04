import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from '@/components/BondedLogo';
import { Home, LayoutGrid, BookOpen, UserCircle, HelpCircle } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/home">
      <div className="inline-flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center max-w-full">
          <BondedLogo className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
          <span className="font-black tracking-tight text-[clamp(1.9rem,10vw,4.2rem)] text-[#3E2723] leading-[0.95] text-center sm:text-left">
            Bonded
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-slate-100">
      <main className="flex-1 flex flex-col pt-24">
        {/* Logo Banner - centered horizontally; nav icons underneath; remove border line */}
        <div className="w-full bg-white flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center gap-6">
            <Logo />
            <div className="flex items-center gap-4 mt-2">
              <Link href="/home">
                <div className="p-3 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer">
                  <Home className="h-6 w-6 text-[#2458a0]" />
                </div>
              </Link>
              <Link href="/app">
                <div className="p-3 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer">
                  <LayoutGrid className="h-6 w-6 text-[#2458a0]" />
                </div>
              </Link>
              <Link href="/research">
                <div className="p-3 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer">
                  <BookOpen className="h-6 w-6 text-[#2458a0]" />
                </div>
              </Link>
              <Link href="/profile">
                <div className="p-3 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer">
                  <UserCircle className="h-6 w-6 text-[#2458a0]" />
                </div>
              </Link>
              <Link href="/help">
                <div className="p-3 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer">
                  <HelpCircle className="h-6 w-6 text-[#2458a0]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
