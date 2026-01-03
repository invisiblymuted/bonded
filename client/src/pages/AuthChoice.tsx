import React from 'react';
import { Link } from 'wouter';
import { BondedLogo } from "@/components/BondedLogo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AuthChoice = () => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f5f1e8] via-[#ede8dc] to-[#f5f1e8] flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link href="/signup" className="block h-full">
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-12 sm:p-14 md:p-16 bg-white border-2 border-[#dcd7ca] rounded-3xl hover:border-[#2458a0] hover:shadow-2xl transition-all cursor-pointer group">
              <BondedLogo className="w-28 h-28 sm:w-32 sm:h-32 mb-8" />
              <h2 className="text-3xl sm:text-4xl font-black text-[#3E2723] text-center tracking-tight">Join</h2>
            </div>
          </Link>
          
          <Link href="/login" className="block h-full">
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-12 sm:p-14 md:p-16 bg-white border-2 border-[#dcd7ca] rounded-3xl hover:border-[#2458a0] hover:shadow-2xl transition-all cursor-pointer group">
              <BondedLogo className="w-28 h-28 sm:w-32 sm:h-32 mb-8" />
              <h2 className="text-3xl sm:text-4xl font-black text-[#3E2723] text-center tracking-tight">Already Bonded?</h2>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthChoice;
