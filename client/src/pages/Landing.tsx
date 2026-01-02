import React from 'react';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';

const BondedLogo = () => {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="flex items-center">
        <Heart 
          className="w-24 h-24 fill-current text-slate-900" 
        />
        <span className="text-8xl font-bold tracking-tighter ml-2 text-slate-900">
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
        <div className="space-y-12">
          <BondedLogo />
          
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
