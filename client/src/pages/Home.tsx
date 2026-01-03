import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { BondedLogo } from "@/components/BondedLogo";
import { Footer } from "@/components/Footer";
import { 
  MessageSquare, BookOpen, Share2, Calendar, 
  Video, Shield, ExternalLink, Activity, UserCircle, LayoutGrid, Home as HomeIcon, HelpCircle, Menu, X 
} from "lucide-react";

const IconGradient = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2458a0" />
        <stop offset="100%" stopColor="#f26522" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const families = [
    { title: "Military Families", desc: "Parents deployed overseas can stay present in their children's daily lives through shared journals and real-time messaging." },
    { title: "Divorced Parents", desc: "Co-parents can maintain strong bonds with their children regardless of custody arrangements." },
    { title: "Grandparents", desc: "Bridging the gap between generations, allowing grandparents to be part of daily growth." },
    { title: "Incarcerated Parents", desc: "Prioritizing the parent-child bond to improve long-term outcomes for families." }
  ];

  const features = [
    { id: "messaging", icon: MessageSquare, title: "Messaging", desc: "Stay in touch with instant messages that feel like you're in the same room." },
    { id: "journals", icon: BookOpen, title: "Journals", desc: "Create a private space to write and share thoughts together." },
    { id: "gallery", icon: Share2, title: "Gallery", desc: "Build a shared collection of precious moments and creative expressions." },
    { id: "calendar", icon: Calendar, title: "Calendar", desc: "Plan visits and video calls together with shared reminders." },
    { id: "video", icon: Video, title: "Video Calls", desc: "Face-to-face connection with built-in, secure high-quality calling." },
    { id: "security", icon: Shield, title: "Security", desc: "Your family's connection is protected with end-to-end encryption." }
  ];

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#2c2c2c]">
      <IconGradient />
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-[#ede8dc]/95 border-b border-[#dcd7ca]">
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
              className={`${menuOpen ? "flex" : "hidden"} md:flex items-center gap-1.5 sm:gap-2 md:gap-3 md:static absolute right-2 top-16 md:top-auto bg-white md:bg-transparent border md:border-0 border-[#dcd7ca] rounded-2xl px-3 py-2 md:p-0 shadow-md md:shadow-none z-50`}
            >
              <Link href="/">
                <div className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Info">
                  <HomeIcon className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/app">
                <div className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Dashboard">
                  <LayoutGrid className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/research">
                <div className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Research">
                  <Activity className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/profile">
                <div className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Profile">
                  <UserCircle className="h-4 w-4" />
                </div>
              </Link>
              <Link href="/help">
                <div className="p-1.5 sm:p-2 rounded-full border border-[#dcd7ca] bg-white hover:border-[#2458a0] cursor-pointer" title="Get Help">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="pt-16 sm:pt-24 md:pt-48 pb-12 md:pb-24 px-4 text-center">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-[clamp(1rem,6vw,1.9rem)] sm:text-[clamp(1.5rem,5vw,2.6rem)] md:text-5xl lg:text-7xl font-black mb-4 md:mb-8 tracking-tight flex flex-col items-center leading-tight uppercase">
              <span className="text-[#4a453e] text-balance">Stay Connected,</span>
              <span className="bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent mt-2 text-balance">
                No Matter the Distance
              </span>
            </h1>
            <p className="text-[10px] sm:text-sm md:text-lg lg:text-xl text-[#4a453e] font-bold max-w-2xl mx-auto uppercase tracking-wide opacity-80 text-balance">
              A safe place for you and your loved ones, without being defined by circumstance or geography.
            </p>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20 px-4 bg-[#f0ede4] border-y border-[#dcd7ca]">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              How it Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <Link key={f.id} href={`/tutorials/${f.id}`}>
                  <Card className="bg-white border-[#dcd7ca] p-8 h-full cursor-pointer hover:border-[#f26522] transition-all group shadow-sm rounded-3xl">
                    <div className="flex items-center gap-4 mb-4">
                      <f.icon stroke="url(#brand-gradient)" className="h-6 w-6" />
                      <h3 className="font-black text-[#4a453e] uppercase tracking-tight text-lg">{f.title}</h3>
                    </div>
                    <p className="text-sm text-[#4a453e] font-bold opacity-70 mb-6">{f.desc}</p>
                    <div className="text-xs font-black text-[#2458a0] flex items-center gap-2 uppercase tracking-widest group-hover:text-[#f26522] transition-colors">
                      Dig Deeper <ExternalLink className="h-3 w-3" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION & REALITY */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-center uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
                  Who It's For
                </h2>
                <div className="grid gap-6">
                  {families.map((f, i) => (
                    <Card key={i} className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                      <h3 className="text-xl font-black text-[#4a453e] mb-2 uppercase tracking-tight">{f.title}</h3>
                      <p className="text-sm text-[#4a453e] font-bold opacity-70 leading-relaxed uppercase tracking-tight">{f.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="lg:sticky lg:top-32 space-y-8 text-center">
                <h2 className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
                  The Need
                </h2>
                <div className="bg-[#ede8dc] p-12 rounded-[40px] border border-[#dcd7ca] space-y-12 shadow-inner">
                  <div className="space-y-12">
                    <div className="flex flex-col items-center">
                      <span className="text-6xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">13M+</span>
                      <p className="text-xs font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em]">Separated Children</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">400K</span>
                      <p className="text-xs font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em]">Military Kids</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">2.7M</span>
                      <p className="text-xs font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em]">Incarcerated Parents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}