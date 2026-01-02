import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from '@/components/BondedLogo';
import { Home, LayoutGrid, Activity, UserCircle, HelpCircle } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/home">
      <div className="inline-flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
        <div className="flex items-center gap-12">
          <BondedLogo className="w-48 h-48" />
          <span className="text-9xl font-black tracking-tight" style={{ color: '#3E2723' }}>
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
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/landing">
            <div className="flex items-center cursor-pointer gap-3">
              <div className="h-14 w-14 flex items-center justify-center [&_svg]:fill-[#2458a0]">
                <BondedLogo />
              </div>
              <span className="font-black text-3xl text-[#3E2723] tracking-tight">Bonded</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Logo Banner - Takes up most of the page */}
        <div className="flex-1 w-full bg-white border-b border-slate-200 flex items-center justify-center px-6">
          <Logo />
        </div>

        {/* Navigation Icons - Underneath */}
        <div className="w-full bg-white px-6 py-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#3E2723]">
            <Link href="/home">
              <div className="p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Info">
                <Home className="h-5 w-5" />
              </div>
            </Link>
            <Link href="/app">
              <div className="p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Dashboard">
                <LayoutGrid className="h-5 w-5" />
              </div>
            </Link>
            <Link href="/research">
              <div className="p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Research">
                <Activity className="h-5 w-5" />
              </div>
            </Link>
            <Link href="/profile">
              <div className="p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Profile">
                <UserCircle className="h-5 w-5" />
              </div>
            </Link>
            <Link href="/help">
              <div className="p-3 rounded-full border border-slate-200 bg-white hover:border-[#2458a0] cursor-pointer" title="Get Help">
                <HelpCircle className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
