import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from '@/components/BondedLogo';
import IconGradient from '@/components/IconGradient';
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
    <div className="flex flex-col min-h-[100dvh] page-cream selection:bg-white">
      <IconGradient />
      <main className="flex-1 flex items-center justify-center">
        {/* Logo Banner - centered both vertically and horizontally; nav icons stacked underneath */}
          <div className="w-full flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="container mx-auto max-w-6xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-center">
              <Logo />
              {/* navigation icons removed on landing to declutter hero */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
