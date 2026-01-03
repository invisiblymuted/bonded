import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from '@/components/BondedLogo';
import { Header } from '@/components/Header';

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
      <Header />

      <main className="flex-1 flex flex-col pt-24">
        {/* Logo Banner - Takes up most of the page */}
        <div className="flex-1 w-full bg-white border-b border-slate-200 flex items-center justify-center px-4 sm:px-6 py-8">
          <Logo />
        </div>
      </main>
    </div>
  );
}
