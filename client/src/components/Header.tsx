import { useState } from "react";
import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { useAuth } from "@/hooks/use-auth";
import { Activity, UserCircle, LayoutGrid, Home, HelpCircle, Menu, X } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2458a0" />
            <stop offset="100%" stopColor="#f26522" />
          </linearGradient>
        </defs>
      </svg>
      
      <nav className="fixed top-0 w-full z-50 bg-[#ede8dc]/95 border-b border-[#dcd7ca] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-4 h-16 flex items-center justify-between">
          <Link href="/landing">
            <div className="flex items-center cursor-pointer gap-1 md:gap-0">
              <div className="h-10 md:h-14 w-10 md:w-14 flex items-center justify-center [&_svg]:fill-[#2458a0]">
                <BondedLogo />
              </div>
              <span className="hidden md:block font-black text-3xl text-[#3E2723] tracking-tight -ml-2">Bonded</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="md:hidden p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0]"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div
              className={`${menuOpen ? "flex" : "hidden"} md:flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap justify-center md:flex-nowrap md:justify-end md:static absolute left-2 right-2 top-16 md:top-auto bg-white md:bg-transparent border md:border-0 border-[#dcd7ca] rounded-2xl px-3 py-3 md:p-0 shadow-xl md:shadow-none z-50`}
            >
              <Link href="/home">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Info">
                  <Home className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/app">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Dashboard">
                  <LayoutGrid className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/research">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Research">
                  <Activity className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/profile">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Profile">
                  <UserCircle className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/help">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Get Help">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </Link>
              {user && (
                <Link href="/profile">
                  <div onClick={closeMenu} className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-full cursor-pointer shadow-sm">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{user.firstName}</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
