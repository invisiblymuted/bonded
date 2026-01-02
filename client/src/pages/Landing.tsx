import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';

const BondedLogo = ({ size = "medium" }) => {
  const isLarge = size === "large";
  return (
    /* BondedLogo component with its own container for internal dimensions */
    <div className="inline-flex items-center justify-center p-2">
      <div className="flex items-center">
        <Heart 
          className={`${isLarge ? 'w-10 h-10' : 'w-6 h-6'} fill-current text-slate-900`} 
        />
        {/* ml-1 pulls the text tight against the heart logo as requested */}
        <span className={`${isLarge ? 'text-5xl' : 'text-2xl'} font-bold tracking-tighter ml-1 text-slate-900`}>
          Bonded
        </span>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const handleChoice = () => {
    // Replace with your routing logic (e.g., navigate('/choice'))
    window.location.href = '/choice';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-slate-100">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="space-y-8 max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900">
            Connection, <br />
            <span className="text-slate-400">Reimagined.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
            A space designed for your most important relationship. 
            Deepen your bond through intentionality.
          </p>

          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={handleChoice}
              className="bg-slate-900 text-white hover:bg-slate-800 px-10 py-8 text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - Specifically centered logo section */}
      <footer className="w-full py-16 border-t border-slate-50">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <BondedLogo />
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
              Privacy First • Est. 2026
            </p>
            <div className="flex gap-6 mt-4">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">Instagram</a>
              <a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
