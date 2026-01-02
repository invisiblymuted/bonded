import React from 'react';
import { Button } from "@/components/ui/button";
import { BondedLogo } from "@/components/BondedLogo";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          See How <br />
          <span className="text-slate-500">Bonded Works</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-md mb-10 leading-relaxed">
          A safe place for you and your loved ones, without being defined by circumstance or geography.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="px-10 py-7 text-xl shadow-xl hover:shadow-2xl transition-all"
            onClick={() => window.location.href = '/app'}
          >
            Enter App
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="px-10 py-7 text-xl shadow-xl hover:shadow-2xl transition-all"
            onClick={() => window.location.href = '/research'}
          >
            View Research
          </Button>
        </div>
      </main>

      {/* Footer with specifically centered and scooted Logo */}
      <footer className="py-12 border-t border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <BondedLogo />
          <p className="mt-4 text-sm text-slate-400 font-medium tracking-widest uppercase">
            EST. 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
