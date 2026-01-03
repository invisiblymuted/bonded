import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from '@/components/BondedLogo';
import { Home, LayoutGrid, Activity, UserCircle, HelpCircle } from 'lucide-react';

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
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/landing">
            <div className="flex items-center cursor-pointer gap-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center [&_svg]:fill-[#2458a0]">
                <BondedLogo />
              </div>
              <span className="hidden sm:block font-black text-2xl sm:text-3xl text-[#3E2723] tracking-tight -ml-1">Bonded</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Logo Banner - Takes up most of the page */}
        <div className="flex-1 w-full bg-white border-b border-slate-200 flex items-center justify-center px-4 sm:px-6 py-8">
          <Logo />
        </div>

        {/* Navigation Icons - Underneath */}
        <div className="w-full bg-white px-4 sm:px-6 py-6 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3 text-[#3E2723] flex-wrap justify-center">
            <Link href="/home">
              <div className="p-2.5 sm:p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Info">
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </Link>
            <Link href="/app">
              <div className="p-2.5 sm:p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Dashboard">
                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </Link>
            <Link href="/research">
              <div className="p-2.5 sm:p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Research">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </Link>
            <Link href="/profile">
              <div className="p-2.5 sm:p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Profile">
                <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </Link>
            <Link href="/help">
              <div className="p-2.5 sm:p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Get Help">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
