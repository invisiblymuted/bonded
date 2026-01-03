import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  Users, BookOpen, Heart, 
  BarChart3, ExternalLink, Search, FileText,
  Activity, TrendingUp, Globe, ExternalLink as ExternalLinkIcon
} from "lucide-react";

// Removed resilience graph code

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

  const categories = [
    {
      title: "Child Development",
      desc: "Psychological research on mitigating childhood trauma through consistent connection and evidence-based interventions.",
      articles: ["The ACE Study: Origins", "Toxic Stress & Brain Development", "The Biology of Connection"],
      link: "/tutorials/development",
      icon: BookOpen
    },
    {
      title: "Family & Separation",
      desc: "Comprehensive research on children living apart from parents due to various circumstances and evidence-based reunification strategies.",
      articles: ["Statistical Overview of Separation", "Long-term Impact Studies", "Reunification Protocols"],
      link: "/tutorials/family-stats",
      icon: Users
    },
    {
      title: "Military Research",
      desc: "Studies on the impact of deployment, virtual parenting outcomes, and building resilience in military-connected youth.",
      articles: ["Deployment Stress Cycles", "Virtual Parenting Outcomes", "Resiliency in Military Youth"],
      link: "/tutorials/military-impact",
      icon: Heart
    },
    {
      title: "Technology Adoption",
      desc: "Emerging trends in how families use digital tools to bridge distance, maintain emotional bonds, and build stronger connections.",
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
      
      <Header />

      <main className="pt-24 md:pt-28 pb-16 md:pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-[clamp(1.9rem,7vw,3rem)] sm:text-[clamp(2.2rem,6vw,3.6rem)] md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-tight text-balance">
              Research Hub
            </h1>
            <p className="text-[13px] sm:text-sm md:text-lg text-[#4a453e] max-w-3xl mx-auto font-bold uppercase tracking-wide opacity-90 text-balance">
              The data on how much connection is needed.
            </p>
          </header>

          {/* SEARCH ENGINE */}
          <div className="max-w-2xl mx-auto mb-12 px-1 sm:px-0">
            <form onSubmit={handleGoogleSearch} className="relative group">
              <label htmlFor="research-search" className="sr-only">Search for research topics</label>
              <input 
                id="research-search"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Further your own research..." 
                className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-28 sm:pr-32 rounded-full border-2 border-[#dcd7ca] bg-white focus:border-[#2458a0] outline-none transition-all text-[#4a453e] font-bold shadow-sm text-sm sm:text-base"
              />
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-[#2458a0]" />
              <button 
                type="submit"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white px-4 sm:px-6 py-2 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>
          </div>

          {/* COUNTER UNDER SEARCH - KEY METRICS */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-xl sm:text-2xl font-black text-[#4a453e] uppercase tracking-tight mb-6 md:mb-8 text-center">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-white p-6 sm:p-7 lg:p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
                <Globe stroke="url(#brand-gradient)" className="h-6 w-6 mb-3" />
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                  <StatCounter end={13200000} suffix="+" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Children in Separation</p>
              </Card>

              <Card className="bg-white p-6 sm:p-7 lg:p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
                <Activity stroke="url(#brand-gradient)" className="h-6 w-6 mb-3" />
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                  <StatCounter end={4} suffix=".0" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Avg. ACE Score Risk</p>
              </Card>

              <Card className="bg-white p-6 sm:p-7 lg:p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
                <TrendingUp stroke="url(#brand-gradient)" className="h-6 w-6 mb-3" />
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                  <StatCounter end={72} suffix="%" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Digital Bond Utility</p>
              </Card>
            </div>
          </section>

          {/* INTERNATIONAL ISSUES SECTION */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl font-black text-[#4a453e] uppercase tracking-tight mb-6 md:mb-8 text-center">
              Global Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Parental Abduction */}
              <Card className="bg-white border-[#dcd7ca] p-6 sm:p-7 lg:p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#f5f1e8] flex items-center justify-center">
                    <Heart stroke="url(#brand-gradient)" className="h-6 w-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#4a453e] uppercase">Parental Abduction</h3>
                </div>
                <div className="mb-4">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    1.2M+
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#4a453e] opacity-60 font-bold mt-1">Cases annually reported globally</p>
                </div>
                <p className="text-sm text-[#4a453e] leading-relaxed mb-4">
                  International parental child abduction across borders affects families when one parent unlawfully removes a child from their habitual residence.
                </p>
                <ul className="space-y-2 text-[11px] sm:text-xs text-[#4a453e] opacity-80">
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Hague Convention governs 101+ countries</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Average case duration: 18-24 months</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Recovery rate: ~60% internationally</span>
                  </li>
                </ul>
              </Card>

              {/* Military Separation */}
              <Card className="bg-white border-[#dcd7ca] p-6 sm:p-7 lg:p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#f5f1e8] flex items-center justify-center">
                    <Activity stroke="url(#brand-gradient)" className="h-6 w-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#4a453e] uppercase">Military Separation</h3>
                </div>
                <div className="mb-4">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    400K+
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#4a453e] opacity-60 font-bold mt-1">Military children in active separations</p>
                </div>
                <p className="text-sm text-[#4a453e] leading-relaxed mb-4">
                  Deployment and military service create extended family separations, affecting children's emotional development and parental bonding.
                </p>
                <ul className="space-y-2 text-[11px] sm:text-xs text-[#4a453e] opacity-80">
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Average deployment: 9-12 months</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Multiple deployments in childhood: 40%</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>PTSD risk in separated children: 2.3x</span>
                  </li>
                </ul>
              </Card>

              {/* Incarceration */}
              <Card className="bg-white border-[#dcd7ca] p-6 sm:p-7 lg:p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#f5f1e8] flex items-center justify-center">
                    <BarChart3 stroke="url(#brand-gradient)" className="h-6 w-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#4a453e] uppercase">Parental Incarceration</h3>
                </div>
                <div className="mb-4">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                    5.1M
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#4a453e] opacity-60 font-bold mt-1">Children with incarcerated parents</p>
                </div>
                <p className="text-sm text-[#4a453e] leading-relaxed mb-4">
                  Mass incarceration disproportionately impacts families, leaving children without parental support and creating intergenerational trauma.
                </p>
                <ul className="space-y-2 text-[11px] sm:text-xs text-[#4a453e] opacity-80">
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Average sentence length: 2-5+ years</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Childhood behavioral issues risk: 6-14x</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2458a0] font-bold">•</span>
                    <span>Financial strain on families: 87%</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>
          {/* RESEARCH CATEGORIES SECTION */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl font-black text-[#4a453e] uppercase tracking-tight mb-6 md:mb-8 text-center">
              Research Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {categories.map((cat, i) => (
                <Card key={i} className="bg-white border-[#dcd7ca] p-6 sm:p-7 lg:p-8 h-full flex flex-col justify-between shadow-sm rounded-3xl transition-all hover:border-[#f26522]/40 hover:shadow-md">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#f5f1e8] flex items-center justify-center shrink-0 border border-[#dcd7ca]">
                        <cat.icon stroke="url(#brand-gradient)" className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
                        {cat.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#4a453e] font-bold leading-relaxed mb-6 md:mb-8">
                      {cat.desc}
                    </p>
                    <div className="space-y-4 pt-6 border-t border-[#f0ede4]">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#2458a0]">Featured Publications:</p>
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
                  <div className="pt-6 md:pt-8 mt-6 border-t border-[#f0ede4]" />
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}