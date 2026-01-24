import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import IconGradient from "@/components/IconGradient";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { 
  MessageSquare, BookOpen, Share2, Calendar, 
  Video, Shield, EyeOff, Ban, Users, Heart
} from "lucide-react";
import React from "react";

export default function Home() {
  const families = [
    { icon: Users, title: "Military Families", desc: "Parents deployed overseas can stay present in their children's daily lives through shared journals and real-time messaging." },
    { icon: Shield, title: "Divorced Parents", desc: "Co-parents can maintain strong bonds with their children regardless of custody arrangements." },
    { icon: Heart, title: "Grandparents", desc: "Bridging the gap between generations, allowing grandparents to be part of daily growth." },
    { icon: BookOpen, title: "Incarcerated Parents", desc: "Prioritizing the parent-child bond to improve long-term outcomes for families." }
  ];

  const trustTiles = [
    { id: "no-social", icon: EyeOff, title: "No Social Media", desc: "Absolutely zero social media integration. No feeds, no algorithms tracking activity." },
    { id: "all-ages", icon: Ban, title: "No Email or Phone Needed", desc: "Any age can join safely—no phone number, no email required to connect." }
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
    <div className="min-h-screen page-cream text-[#2c2c2c] home-page">
      <IconGradient />
      <Header />

      <main className="bg-[#f0ede4] pt-12 md:pt-16 pb-6 md:pb-8 px-4">
        {/* HERO SECTION */}
        <section id="home-hero" className="pt-6 sm:pt-8 md:pt-12 pb-4 md:pb-6 px-4 text-center">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center">
              <h1 className="text-[clamp(1rem,6vw,1.9rem)] sm:text-[clamp(1.5rem,5vw,2.6rem)] md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight leading-tight uppercase">
               <span className="block brand-gradient-text text-balance">Stay Connected</span>
               <span className="block brand-gradient-text mt-2 text-balance">No Matter the Distance</span>
              </h1>
            </div>
              <p className="text-[13px] sm:text-sm md:text-lg lg:text-xl text-[#2458a0] font-bold max-w-2xl mx-auto uppercase tracking-wide opacity-90 text-balance mb-4 md:mb-8">
                A safe place for you and your loved ones, without being defined by circumstance or geography.
              </p>
              <div className="flex justify-center mt-6 md:mt-8 mb-4 md:mb-6">
                <BondedLogo className="h-28 w-28" />
              </div>
          </div>
        </section>

        {/* THE NEED STATS */}
        <section className="pt-0 -mt-4 pb-4 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-6 text-center">
              <div className="bg-[#f0ede4] p-6 rounded-[28px] border border-[#dcd7ca] space-y-6 shadow-inner mx-auto max-w-4xl">
                <div className="space-y-8">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl sm:text-6xl font-black brand-gradient-text leading-none">13M+</span>
                    <p className="text-xs font-black text-[#2458a0] uppercase mt-3 tracking-[0.2em]">Separated Children</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl sm:text-6xl font-black brand-gradient-text leading-none">400K</span>
                    <p className="text-xs font-black text-[#2458a0] uppercase mt-3 tracking-[0.2em]">Military Children</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl sm:text-6xl font-black brand-gradient-text leading-none">2.7M</span>
                    <p className="text-xs font-black text-[#2458a0] uppercase mt-3 tracking-[0.2em]">Incarcerated Parents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / FEATURES */}
        <section className="py-8 md:py-12 px-4 border-y border-[#dcd7ca] how-it-works">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-xl font-black uppercase tracking-tight pt-0 pb-6 mb-4 brand-gradient-text text-center">
              How it Works
            </h2>

            <div className="grid grid-cols-1 gap-6 md:gap-6 mb-8">
              {trustTiles.map((t) => (
                <Card key={t.id} className="bg-white border-[#dcd7ca] border-2 p-5 rounded-3xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-card icon-pop icon-frame flex items-center justify-center shrink-0 border">
                      <t.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2 text-left">
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#2c2c2c]">{t.title}</h3>
                      <p className="text-sm text-[#2c2c2c] font-bold opacity-80 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <Link key={f.id} href={`/features/${f.id}`}>
                  <Card className="bg-white border-[#dcd7ca] border-2 p-6 h-full cursor-pointer hover:shadow-md transition-all group rounded-3xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="icon-frame h-9 w-9 rounded-xl flex items-center justify-center border">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-[#2c2c2c] uppercase tracking-tight text-lg">{f.title}</h3>
                    </div>
                    <p className="text-sm text-[#2c2c2c] font-bold opacity-80 leading-relaxed">{f.desc}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-xl font-black uppercase tracking-tight pt-0 pb-8 mb-4 brand-gradient-text text-center">
              Who It's For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {families.map((f, i) => (
                <Card key={i} className="bg-[#f0ede4] border-[#dcd7ca] border-2 p-8 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="icon-frame h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center border">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-[#2c2c2c] uppercase tracking-tight">{f.title}</h3>
                  </div>
                  <p className="text-sm text-[#2c2c2c] font-bold opacity-70 leading-relaxed uppercase tracking-tight">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
   );
 }