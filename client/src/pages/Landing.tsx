import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from '@/components/BondedLogo';

const Logo = () => {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="flex items-center gap-4">
        <BondedLogo className="w-32 h-32" />
        <span className="text-8xl font-bold tracking-tight" style={{ color: '#3E2723' }}>
          Bonded
        </span>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-slate-100">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center space-y-12">
          <Logo />
          
          <Link href="/app">
            <a className="text-2xl text-slate-500 hover:text-slate-900 transition-colors font-medium">
              see how bonded works
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
