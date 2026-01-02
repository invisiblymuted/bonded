import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from "@/components/BondedLogo";

const AuthChoice = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/signup" className="block h-full">
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-16 bg-white border-2 border-slate-200 rounded-3xl hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group">
            <BondedLogo className="w-32 h-32 mb-8" />
            <h2 className="text-4xl font-bold text-slate-900 text-center">Join</h2>
          </div>
        </Link>
        
        <Link href="/login" className="block h-full">
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-16 bg-white border-2 border-slate-200 rounded-3xl hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group">
            <BondedLogo className="w-32 h-32 mb-8" />
            <h2 className="text-4xl font-bold text-slate-900 text-center">Already Bonded?</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AuthChoice;
