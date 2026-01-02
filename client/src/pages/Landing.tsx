import React from 'react';
import { Button } from "@/components/ui/button";
import { BondedLogo } from "@/components/BondedLogo";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Connection, <br />
          <span className="text-slate-500">Reimagined.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-md mb-10 leading-relaxed">
          Deepen your most important relationships through intentionality and shared growth.
        </p>
        <Button 
          size="lg" 
          className="px-10 py-7 text-xl shadow-xl hover:shadow-2xl transition-all"
         onClick={() => window.location.href = '/auth'}
        >
          Get Started
        </Button>
      </main>

      {/* Footer with specifically centered and scooted Logo */}
      <footer className="py-12 border-t border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <BondedLogo />
          <p className="mt-4 text-sm text-slate-400 font-medium tracking-widest uppercase">
            EST. 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
            </div>
            <span className="font-black text-3xl text-[#4a453e] tracking-tighter -ml-1">Bonded</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="/research">
              <div className="text-sm font-bold text-[#4a453e] cursor-pointer hover:text-[#f26522] transition-colors uppercase tracking-widest">
                Research
              </div>
            </a>
            <a href="/app">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#4a453e] text-white rounded-full cursor-pointer hover:bg-gradient-to-r hover:from-[#2458a0] hover:to-[#f26522] transition-all shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest">Enter App</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="pt-32 pb-24 px-4 text-center">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-[#ede8dc] px-4 py-2 rounded-full border border-[#dcd7ca] mb-6">
                <Heart className="h-4 w-4 text-[#f26522]" />
                <span className="text-xs font-black text-[#4a453e] uppercase tracking-widest">Trusted by 10,000+ families</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight flex flex-col items-center leading-none uppercase">
              <span className="text-[#4a453e]">Stay Connected,</span>
              <span className="bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent mt-2">
                No Matter the Distance
              </span>
            </h1>

            <p className="text-xl text-[#4a453e] font-bold max-w-2xl mx-auto uppercase tracking-wide opacity-80 mb-12">
              A safe, secure platform designed for families separated by circumstance. Military deployments, incarceration, divorce, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/app">
                <div className="h-16 px-8 bg-[#4a453e] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-[#2458a0] hover:to-[#f26522] hover:scale-105 transition-all flex items-center gap-4 shadow-xl cursor-pointer">
                  Start Connecting Today
                  <ArrowRight className="h-5 w-5" />
                </div>
              </a>
              <a href="/research">
                <div className="h-16 px-8 border-2 border-[#4a453e] text-[#4a453e] rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-[#4a453e] hover:text-white transition-all flex items-center gap-4 cursor-pointer">
                  <Globe className="h-5 w-5" />
                  View Research
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 px-4 bg-[#ede8dc] border-y border-[#dcd7ca]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white p-8 rounded-3xl border-[#dcd7ca] shadow-sm text-center">
                <Users className="h-8 w-8 text-[#2458a0] mx-auto mb-4" />
                <div className="text-3xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <p className="text-sm font-black text-[#4a453e] uppercase tracking-widest">Families Connected</p>
              </Card>

              <Card className="bg-white p-8 rounded-3xl border-[#dcd7ca] shadow-sm text-center">
                <Shield className="h-8 w-8 text-[#f26522] mx-auto mb-4" />
                <div className="text-3xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent mb-2">
                  256-bit
                </div>
                <p className="text-sm font-black text-[#4a453e] uppercase tracking-widest">End-to-End Encryption</p>
              </Card>

              <Card className="bg-white p-8 rounded-3xl border-[#dcd7ca] shadow-sm text-center">
                <Activity className="h-8 w-8 text-[#4a453e] mx-auto mb-4" />
                <div className="text-3xl font-black bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <p className="text-sm font-black text-[#4a453e] uppercase tracking-widest">Support Available</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FEATURES PREVIEW */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-black mb-16 text-center uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Everything You Need to Stay Connected
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                <MessageSquare className="h-8 w-8 text-[#2458a0] mb-4" />
                <h3 className="text-xl font-black text-[#4a453e] mb-3 uppercase tracking-tight">Real-Time Messaging</h3>
                <p className="text-sm text-[#4a453e] font-bold opacity-70">Stay in constant touch with instant messages that feel like you're in the same room.</p>
              </Card>

              <Card className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                <Video className="h-8 w-8 text-[#f26522] mb-4" />
                <h3 className="text-xl font-black text-[#4a453e] mb-3 uppercase tracking-tight">HD Video Calls</h3>
                <p className="text-sm text-[#4a453e] font-bold opacity-70">Face-to-face connection with built-in, secure high-quality calling.</p>
              </Card>

              <Card className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                <BookOpen className="h-8 w-8 text-[#4a453e] mb-4" />
                <h3 className="text-xl font-black text-[#4a453e] mb-3 uppercase tracking-tight">Shared Journals</h3>
                <p className="text-sm text-[#4a453e] font-bold opacity-70">Create private spaces to write and share thoughts together as a family.</p>
              </Card>

              <Card className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                <Share2 className="h-8 w-8 text-[#2458a0] mb-4" />
                <h3 className="text-xl font-black text-[#4a453e] mb-3 uppercase tracking-tight">Photo Gallery</h3>
                <p className="text-sm text-[#4a453e] font-bold opacity-70">Build a shared collection of precious moments and creative expressions.</p>
              </Card>

              <Card className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                <Calendar className="h-8 w-8 text-[#f26522] mb-4" />
                <h3 className="text-xl font-black text-[#4a453e] mb-3 uppercase tracking-tight">Shared Calendar</h3>
                <p className="text-sm text-[#4a453e] font-bold opacity-70">Plan visits and video calls together with shared reminders.</p>
              </Card>

              <Card className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                <Shield className="h-8 w-8 text-[#4a453e] mb-4" />
                <h3 className="text-xl font-black text-[#4a453e] mb-3 uppercase tracking-tight">Bank-Level Security</h3>
                <p className="text-sm text-[#4a453e] font-bold opacity-70">Your family's connection is protected with end-to-end encryption.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 px-4 bg-[#ede8dc] border-y border-[#dcd7ca]">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Real Families, Real Connections
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="bg-white border-[#dcd7ca] p-8 rounded-3xl shadow-sm">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-[#f26522] fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#4a453e] font-bold italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-black text-[#4a453e] uppercase tracking-widest">{testimonial.author}</p>
                    <p className="text-xs text-[#4a453e] opacity-60 uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl font-black mb-8 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#f26522] bg-clip-text text-transparent">
              Ready to Strengthen Your Family Bonds?
            </h2>
            <p className="text-xl text-[#4a453e] font-bold mb-12 uppercase tracking-wide opacity-80">
              Join thousands of families who have found their way back to each other.
            </p>

            <a href="/app">
              <div className="inline-flex h-20 px-12 bg-[#4a453e] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-[#2458a0] hover:to-[#f26522] hover:scale-105 transition-all items-center gap-4 shadow-xl cursor-pointer">
                Get Started Free
                <ArrowRight className="h-6 w-6" />
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;