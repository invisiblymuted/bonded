import { useState, useEffect } from "react";
import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { Card } from "@/components/ui/card";
import { 
  Users, ArrowLeft, BookOpen, Heart, 
  BarChart3, ExternalLink, Search, FileText,
  Activity, TrendingUp, Globe, MapPin, ArrowUpRight
} from "lucide-react";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Resilience Data for the new interactive chart
const resilienceData = [
  { contact: 'None', resilience: 15 },
  { contact: 'Monthly', resilience: 35 },
  { contact: 'Bi-Weekly', resilience: 55 },
  { contact: 'Weekly', resilience: 82 },
  { contact: 'Daily', resilience: 96 },
];

const StatCounter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    let animationFrame: number;
    
    const animate = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

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

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLayer, setActiveLayer] = useState<'global' | 'military' | 'justice'>('global');

  const categories = [
    {
      title: "Child Development",
      stat: "ACEs",
      desc: "Psychological research on mitigating childhood trauma through consistent connection.",
      articles: ["The ACE Study: Origins", "Toxic Stress & Brain Development", "The Biology of Connection"],
      link: "/tutorials/development",
      icon: BookOpen
    },
    {
      title: "Family & Separation",
      stat: "13.2M",
      desc: "Comprehensive statistics on children living apart from parents due to various circumstances.",
      articles: ["Statistical Overview of Separation", "Long-term Impact Studies", "Reunification Protocols"],
      link: "/tutorials/family-stats",
      icon: Users
    },
    {
      title: "Military Research",
      stat: "400K",
      desc: "Studies on the impact of deployment and the importance of daily parental presence.",
      articles: ["Deployment Stress Cycles", "Virtual Parenting Outcomes", "Resiliency in Military Youth"],
      link: "/tutorials/military-impact",
      icon: Heart
    },
    {
      title: "Technology Adoption",
      stat: "72%",
      desc: "Trends in how families use digital tools to bridge distance and maintain emotional bonds.",
      articles: ["Digital Emotional Connectivity", "App-Based Bonding Trends", "Screen-Time vs. Quality-Time"],
      link: "/tutorials/tech-trends",
      icon: BarChart3
    }
  ];

  const handleGoogleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const fullQuery = `${searchQuery} family separation research study`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(fullQuery)}`, '_blank');
  };

  const openScholar = (term: string) => {
    window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(term)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#2c2c2c]">
      <IconGradient />
      
      <nav className="fixed top-0 w-full z-50 bg-[#ede8dc]/95 border-b border-[#dcd7ca]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/app">
            <div className="flex items-center cursor-pointer">
              <div className="h-10 w-10 flex items-center justify-center [&_svg]:fill-[url(#brand-gradient)]">
                <BondedLogo />
              </div>
              <span className="font-black text-3xl text-[#4a453e] tracking-tighter -ml-1">Bonded</span>
            </div>
          </Link>
          <Link href="/about">
            <div className="text-sm font-bold text-[#4a453e] cursor-pointer flex items-center gap-1 hover:text-[#f26522] transition-colors uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4" /> Back
            </div>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Research Hub
            </h1>
            <p className="text-xl text-[#4a453e] max-w-3xl mx-auto font-bold uppercase tracking-wide opacity-90">
              The data behind the connection.
            </p>
          </header>

          {/* SEARCH ENGINE */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleGoogleSearch} className="relative group">
              <label htmlFor="research-search" className="sr-only">Search for research topics</label>
              <input 
                id="research-search"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Further your own research..." 
                className="w-full h-16 pl-14 pr-32 rounded-full border-2 border-[#dcd7ca] bg-white focus:border-[#2458a0] outline-none transition-all text-[#4a453e] font-bold shadow-sm"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-[#2458a0]" />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>
          </div>

          {/* COUNTER UNDER SEARCH */}
          <section className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
              <Globe className="h-6 w-6 text-[#2458a0] mb-4" />
              <div className="text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                <StatCounter end={13200000} suffix="+" />
              </div>
              <p className="text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Children in Separation</p>
            </Card>

            <Card className="bg-white p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
              <Activity className="h-6 w-6 text-[#f26522] mb-4" />
              <div className="text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                <StatCounter end={4} suffix=".0" />
              </div>
              <p className="text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Avg. ACE Score Risk</p>
            </Card>

            <Card className="bg-white p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
              <TrendingUp className="h-6 w-6 text-[#4a453e] mb-4" />
              <div className="text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                <StatCounter end={72} suffix="%" />
              </div>
              <p className="text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Digital Bond Utility</p>
            </Card>
          </section>

          {/* NEW: INTERACTIVE VISUALIZATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <section className="lg:col-span-2 bg-white border border-[#dcd7ca] rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-[#4a453e] uppercase tracking-tight flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#2458a0]" /> Geographic Hotspots
                </h2>
                <div className="flex bg-[#f5f1e8] p-1 rounded-full border border-[#dcd7ca]">
                  {['global', 'military', 'justice'].map((layer) => (
                    <button 
                      key={layer} 
                      onClick={() => setActiveLayer(layer as any)}
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeLayer === layer ? 'bg-[#4a453e] text-white' : 'text-[#4a453e] opacity-40'}`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>
              <div className="aspect-video bg-[#f9f7f2] rounded-3xl border border-[#ede8dc] relative flex items-center justify-center overflow-hidden">
                <MapPin className="h-10 w-10 text-[#f26522] animate-bounce" />
                <p className="absolute bottom-4 text-[10px] font-black uppercase opacity-40 tracking-widest">Active {activeLayer} situational data</p>
              </div>
            </section>

            <section className="bg-white border border-[#dcd7ca] rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xl font-black text-[#4a453e] uppercase tracking-tight flex items-center gap-2 mb-8">
                <BarChart3 className="h-5 w-5 text-[#f26522]" /> Resilience
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={resilienceData}
                    aria-label="Chart showing resilience levels based on contact frequency"
                    role="img"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="contact" hide />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', fontSize: '10px'}}
                      labelFormatter={(value) => `Contact: ${value}`}
                      formatter={(value) => [`${value}%`, 'Resilience']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resilience" 
                      stroke="#2458a0" 
                      strokeWidth={3} 
                      fill="#2458a0" 
                      fillOpacity={0.1}
                      aria-label="Resilience percentage data"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-[#f26522]" />
                <p className="text-[10px] font-black uppercase opacity-60">Peak resilience through daily touchpoints.</p>
              </div>
            </section>
          </div>

          {/* RESTORED CATEGORIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, i) => (
              <Card key={i} className="bg-white border-[#dcd7ca] p-8 h-full flex flex-col justify-between shadow-sm rounded-3xl transition-all hover:border-[#f26522]/40">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[#f5f1e8] flex items-center justify-center shrink-0 border border-[#dcd7ca]">
                      <cat.icon stroke="url(#brand-gradient)" className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="mb-6 text-5xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                    {cat.stat}
                  </div>
                  <p className="text-sm text-[#4a453e] font-bold leading-relaxed opacity-70 uppercase tracking-tight mb-8">
                    {cat.desc}
                  </p>
                  <div className="space-y-4 pt-6 border-t border-[#f0ede4]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2458a0]">Featured Publications:</p>
                    {cat.articles.map((art, idx) => (
                      <div key={idx} onClick={() => openScholar(art)} className="flex items-center gap-3 py-1.5 group/item cursor-pointer">
                        <FileText className="h-4 w-4 text-[#dcd7ca] group-hover/item:text-[#f26522] transition-colors" />
                        <span className="text-sm font-black text-[#4a453e] group-hover/item:text-[#2458a0] transition-colors uppercase tracking-tight">
                          {art}
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover/item:opacity-100 text-[#f26522] transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
                <Link href={cat.link}>
                  <div className="text-xs font-black text-[#2458a0] flex items-center gap-2 cursor-pointer hover:text-[#f26522] hover:gap-3 transition-all uppercase tracking-widest pt-8 mt-6 border-t border-[#f0ede4]">
                    Explore {cat.title} Data <ExternalLink className="h-4 w-4" />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      {/* FIXED FOOTER: Perfectly centered and tight heart logo */}
      <footer className="py-20 border-t border-[#dcd7ca] bg-[#ede8dc]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-12 text-center">
            <Link href="/app">
              <div className="flex items-center cursor-pointer group pr-10"> 
                <div className="h-12 w-12 flex items-center justify-center [&_svg]:fill-[url(#brand-gradient)]">
                  <BondedLogo />
                </div>
                <span className="font-black text-4xl text-[#4a453e] tracking-tighter -ml-1">Bonded</span>
              </div>
            </Link>

            <div className="flex flex-col items-center">
              <span className="text-sm font-black text-[#2458a0] uppercase tracking-[0.2em]">Research Hub</span>
              <p className="text-[10px] font-bold opacity-40 uppercase mt-2">The Data Behind the Need for Connection</p>
            </div>
            
            <p className="text-[10px] font-black text-[#4a453e] uppercase tracking-[0.3em] pt-8 opacity-30">
              © 2026 Bonded. All Connections Encrypted.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}