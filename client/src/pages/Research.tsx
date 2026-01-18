import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const researchResources = [
    {
      title: "UN Sustainable Development Goals - Family & Children",
      desc: "Research and statistics on global child welfare and family separation issues from the United Nations.",
      url: "https://www.un.org/sustainabledevelopment/",
      icon: BarChart3,
    },
    {
      title: "World Health Organization - Family Separation Impact",
      desc: "Scientific research on the psychological and health impacts of family separation.",
      url: "https://www.who.int/",
      icon: BarChart3,
    },
    {
      title: "Bulnes, M. (2013)",
      desc: "Individualism and the metaphysics of actions. Philosophical Studies.",
      url: "http://www.jstor.org/stable/42920167",
      icon: ExternalLinkIcon,
    },
    {
      title: "Luxton et al. (2012)",
      desc: "Social media and suicide: a public health perspective. American Journal of Public Health.",
      url: "https://ajph.aphapublications.org/doi/full/10.2105/AJPH.2011.300608",
      icon: ExternalLinkIcon,
    },
    {
      title: "Computational personality recognition in social media",
      desc: "Research on automatic personality inference from social media signals.",
      url: "https://www.researchgate.net/publication/293194512_Computational_personality_recognition_in_social_media",
      icon: ExternalLinkIcon,
    },
    {
      title: "ACM Paper (DOI: 10.1145/2666680)",
      desc: "Conference paper available via ACM Digital Library.",
      url: "https://dl.acm.org/doi/10.1145/2666680",
      icon: ExternalLinkIcon,
    },
    {
      title: "Norrholm et al. (2016)",
      desc: "Baseline psychophysiological and cortisol reactivity predicting PTSD treatment outcome.",
      url: "https://doi.org/10.1016/j.brat.2016.05.002",
      icon: ExternalLinkIcon,
    },
    {
      title: "Coursol, Lewis & Garrity (2001)",
      desc: "Career development of trauma survivors and expectations about counseling.",
      url: "https://www.researchgate.net/publication/234637509_Career_Development_of_Trauma_Survivors_Expectations_about_Counseling_and_Career_Maturity",
      icon: ExternalLinkIcon,
    },
    {
      title: "Branthwaite & Patterson (2011)",
      desc: "The power of qualitative research in the era of social media.",
      url: "https://www.researchgate.net/publication/235318744_The_power_of_qualitative_research_in_the_era_of_social_media",
      icon: ExternalLinkIcon,
    },
    {
      title: "APA Record (2014)",
      desc: "Related psychology record available via APA PsycNet.",
      url: "https://psycnet.apa.org/record/2014-25568-006",
      icon: ExternalLinkIcon,
    },
  ];

  const openScholar = (term: string) => {
    window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(term)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#4a453e]">
      <IconGradient />
      
      <Header />

      <main className="pt-16 md:pt-20 pb-8 md:pb-10 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <header className="text-center mb-6 md:mb-6">
            <h1 className="text-[clamp(1.9rem,7vw,3rem)] sm:text-[clamp(2.2rem,6vw,3.6rem)] md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-tight text-balance">
              Bonded Research Hub
            </h1>
            <p className="text-[13px] sm:text-sm md:text-lg text-[#4a453e] max-w-3xl mx-auto font-bold uppercase tracking-wide opacity-90 text-balance">
              The data showing the need for closer bonds
            </p>
          </header>

          {/* SEARCH ENGINE */}
          <div className="max-w-2xl mx-auto mb-6 px-1 sm:px-0">
            <form onSubmit={handleGoogleSearch} className="relative group">
              <label htmlFor="research-search" className="sr-only">Search for research topics</label>
              <input 
                id="research-search"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Further your research..." 
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

          {/* RESEARCH CATEGORIES SECTION (moved above metrics) */}
          <section className="py-3 md:py-5 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6 md:mb-8 text-center bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Research Categories
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {categories.map((cat, i) => (
                <Card key={i} className="bg-white border-[#dcd7ca] p-3 sm:p-4 h-full flex flex-col justify-between shadow-sm rounded-2xl transition-all hover:border-[#f26522]/30 hover:shadow-md">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#f5f1e8] flex items-center justify-center shrink-0 border border-[#dcd7ca]">
                        <cat.icon stroke="url(#brand-gradient)" className="h-5 w-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#2458a0]">
                        {cat.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#4a453e] font-bold leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                    <div className="space-y-3 pt-4 border-t border-[#f0ede4]">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-[#2458a0]">Featured Publications:</p>
                      {cat.articles.map((art, idx) => (
                        <div key={idx} onClick={() => openScholar(art)} className="flex items-center gap-2 py-1 group/item cursor-pointer">
                          <FileText className="h-4 w-4 text-[#dcd7ca] group-hover/item:text-[#f26522] transition-colors" />
                          <span className="text-sm font-black text-[#4a453e] group-hover/item:text-[#2458a0] transition-colors uppercase tracking-tight">
                            {art}
                          </span>
                          <ExternalLink className="h-3 w-3 text-[#2458a0] transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                </Card>
              ))}
            </div>
          </section>

          {/* COUNTER UNDER SEARCH - KEY METRICS */}
          <section className="py-3 md:py-5 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6 md:mb-8 text-center bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Key Metrics
            </h2>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                <p className="text-[11px] sm:text-[12px] text-[#4a453e] opacity-80 mt-2 max-w-[18rem]">ACE = Adverse Childhood Experiences — higher scores indicate greater exposure to childhood trauma and associated long-term risk.</p>
              </Card>

              <Card className="bg-white p-6 sm:p-7 lg:p-8 rounded-3xl border-[#dcd7ca] shadow-sm flex flex-col items-center text-center">
                <TrendingUp stroke="url(#brand-gradient)" className="h-6 w-6 mb-3" />
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent leading-none">
                  <StatCounter end={72} suffix="%" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-black text-[#4a453e] uppercase mt-3 tracking-[0.2em] opacity-60">Digital Bond Utility</p>
                <p className="text-[11px] sm:text-[12px] text-[#4a453e] opacity-80 mt-2 max-w-[18rem]">Digital Bond Utility estimates how often digital tools meaningfully strengthen parent–child relationships (approximate, survey-derived metric).</p>
              </Card>
            </div>
          </section>

          {/* INTERNATIONAL ISSUES SECTION */}
          <section className="py-3 md:py-5 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6 md:mb-8 text-center bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Global Challenges
            </h2>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Parental Abduction */}
              <Card className="bg-white border-[#dcd7ca] p-6 sm:p-7 lg:p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#f5f1e8] flex items-center justify-center">
                    <Heart stroke="url(#brand-gradient)" className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#2458a0]">Parental Abduction</h3>
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
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#2458a0]">Military Separation</h3>
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
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#2458a0]">Parental Incarceration</h3>
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

          {/* RESEARCH & STATISTICS (moved from Get Help) */}
          <section className="py-3 md:py-5 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-6 md:mb-8 text-center bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Additional Research & Statistics
            </h2>
            <div className="w-full flex flex-col gap-4">
              {researchResources.map((r, idx) => (
                <Card key={idx} className="bg-white border-[#dcd7ca] p-4 sm:p-6 rounded-3xl shadow-sm hover:shadow-md flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-[#f5f1e8] flex-shrink-0">
                      <r.icon stroke="url(#brand-gradient)" className="h-6 w-6 text-[#2458a0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#2458a0] mb-1 truncate">{r.title}</h3>
                      <p className="text-sm text-[#4a453e] opacity-70 font-bold mb-2 truncate">{r.desc}</p>
                      <p className="text-[11px] text-[#4a453e] opacity-60 truncate">{r.url}</p>
                    </div>
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer" className="ml-4 inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90">
                    Open <ExternalLink className="h-3 w-3 text-[#2458a0]" />
                  </a>
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