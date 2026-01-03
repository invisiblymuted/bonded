import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { useAuth } from "@/hooks/use-auth";
import { Activity, UserCircle, LayoutGrid, Home, HelpCircle } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  
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
      
      <nav className="fixed top-0 w-full z-50 bg-[#ede8dc]/95 border-b border-[#dcd7ca]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/landing">
            <div className="flex items-center cursor-pointer">
              <div className="h-14 w-14 flex items-center justify-center [&_svg]:fill-[#2458a0]">
                <BondedLogo />
              </div>
              <span className="font-black text-3xl text-[#3E2723] tracking-tight -ml-2">Bonded</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/home">
              <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Info">
                <Home className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/app">
              <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Dashboard">
                <LayoutGrid className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/research">
              <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Research">
                <Activity className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/profile">
              <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Profile">
                <UserCircle className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/help">
              <div className="p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Get Help">
                <HelpCircle className="h-4 w-4" />
              </div>
            </Link>
            {user ? (
              <Link href="/profile">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-full cursor-pointer shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest">{user.firstName}</span>
                </div>
              </Link>
            ) : (
              <Link href="/auth">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#4a453e] text-white border border-[#4a453e] rounded-full cursor-pointer hover:from-[#2458a0] hover:to-[#f26522] hover:bg-gradient-to-r transition-all group shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest">Bond</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
