import { useState } from "react";
import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, UserCircle, LayoutGrid, Home, HelpCircle, Menu, X } from "lucide-react";

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
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>
      </svg>
      
      <nav className="fixed top-0 w-full z-50 bg-white/95 border-b border-[#f0ede4] backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl px-3 sm:px-4 h-16 flex items-center justify-between">
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
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden p-2 rounded-full icon-frame cursor-pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div
              className={`${menuOpen ? "flex" : "hidden"} md:flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap justify-center md:flex-nowrap md:justify-end md:static absolute left-2 right-2 top-16 md:top-auto bg-white md:bg-transparent border md:border-0 border-[#dcd7ca] rounded-2xl px-3 py-3 md:p-0 shadow-xl md:shadow-none z-50`}
            >
              <Link href="/home">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full icon-frame cursor-pointer" title="Info">
                  <Home className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/research">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full icon-frame cursor-pointer" title="Research">
                  <BookOpen className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/help">
                <div onClick={closeMenu} className="p-1.5 sm:p-2 rounded-full icon-frame cursor-pointer" title="Get Help">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </Link>
              {/* Dashboard icon removed from main nav to avoid duplicate/unreachable item */}
              {/* removed duplicate UserCircle nav item to avoid stray icon */}
              {user && (
                <Link href="/app">
                  <div onClick={closeMenu} className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#2458a0] to-[#6b7280] text-white rounded-full cursor-pointer shadow-sm">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="avatar" className="h-7 w-7 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="6"></circle>
                          <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                      </div>
                    )}
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
