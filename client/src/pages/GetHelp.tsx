import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InteractiveResourceMap } from "@/components/InteractiveResourceMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Globe, 
  FileText, 
  BarChart3, 
  Phone, 
  ExternalLink,
  Heart,
  type LucideIcon
} from "lucide-react";

interface Resource {
  title: string;
  description: string;
  url: string;
  category: "legal" | "research" | "support" | "international";
  icon: LucideIcon;
}

const resources: Resource[] = [
  {
    title: "Hague Convention on International Child Abduction",
    description: "Official treaty information and signatory countries for the 1980 Hague Convention - the primary legal framework for addressing international parental child abduction.",
    url: "https://www.hcch.net/en/instruments/conventions/specialised-sections/parental-responsibility-and-protection-of-children/hague-convention-on-international-child-abduction",
    category: "international",
    icon: FileText,
  },
  {
    title: "International Center for Missing & Exploited Children (ICMEC)",
    description: "Global resources for missing and abducted children, including country-specific contact information and legal resources.",
    url: "https://www.icmec.org/",
    category: "international",
    icon: Globe,
  },
  {
    title: "U.S. State Department - Child Abduction",
    description: "Official U.S. government resources for parents dealing with international child abduction cases.",
    url: "https://travel.state.gov/content/travel/en/International-Parental-Child-Abduction.html",
    category: "legal",
    icon: Phone,
  },
  {
    title: "Reunite International",
    description: "UK-based charity providing emotional support and practical advice for parents of abducted children.",
    url: "https://www.reunite.org/",
    category: "support",
    icon: Heart,
  },
  {
    title: "Global Family Law Network",
    description: "International directory of family law attorneys specializing in parental abduction cases.",
    url: "https://www.globalfamilylaw.org/",
    category: "legal",
    icon: FileText,
  },
  {
    title: "UN Sustainable Development Goals - Family & Children",
    description: "Research and statistics on global child welfare and family separation issues from the United Nations.",
    url: "https://www.un.org/sustainabledevelopment/",
    category: "research",
    icon: BarChart3,
  },
  {
    title: "World Health Organization - Family Separation Impact",
    description: "Scientific research on the psychological and health impacts of family separation.",
    url: "https://www.who.int/",
    category: "research",
    icon: BarChart3,
  },
  {
    title: "NCMEC - National Center for Missing & Exploited Children (U.S.)",
    description: "Comprehensive U.S. resources including hotline (1-800-THE-LOST) and case assistance.",
    url: "https://www.missingkids.org/",
    category: "support",
    icon: Phone,
  },
];

const categoryColors: Record<string, string> = {
  legal: "bg-[#e7eef8] text-[#2458a0]",
  research: "bg-[#e6f7ed] text-[#6b7280]",
  support: "bg-[#f0ede4] text-[#2458a0]",
  international: "bg-[#e9f3fb] text-[#2458a0]",
};

const categoryLabels: Record<string, string> = {
  legal: "Legal Resources",
  research: "Research & Statistics",
  support: "Support Services",
  international: "International Organizations",
};

import IconGradient from "@/components/IconGradient";

export default function GetHelp() {
  const { user } = useAuth();

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="min-h-screen page-cream flex flex-col">
      <IconGradient />
      <Header />

      <main className="pt-20 pb-12 px-4 flex-1 scroll-smooth">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-6 md:mb-6">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block"
            >
              <h1 className="text-4xl sm:text-5xl font-black mb-2 uppercase tracking-tight brand-gradient-text">Get Help Now</h1>
              <p className="text-lg text-[#2458a0] opacity-70 font-bold max-w-2xl mx-auto">be your own advocate</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-6">
            <nav className="inline-flex gap-2 bg-transparent rounded-full p-1">
              {[
                { id: 'legal', label: 'Legal Resources' },
                { id: 'support', label: 'Support Services' },
                { id: 'map', label: 'Find Help Near You' },
                { id: 'available', label: 'Available Resources' },
                { id: 'immediate', label: 'Need Immediate Assistance' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-3 py-2 text-sm font-black rounded-full bg-white/0 hover:bg-white/20 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <section id="immediate" className="py-6 md:py-10 flex flex-col items-center">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-gradient-to-r from-[#2458a0]/10 to-[#6b7280]/10 border border-[#f0ede4] rounded-3xl py-8 px-0"
            >
              <h2 className="text-xl font-black py-4 mb-0 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#6b7280] bg-clip-text text-transparent text-left pl-8">
                Need Immediate Assistance?
              </h2>
              <div className="px-8">
                <p className="text-[#2458a0] font-bold mb-6">
                  If you or someone you know is facing an international child abduction situation, please reach out to these crisis services:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="tel:1-800-THE-LOST"
                    className="block p-3 sm:p-4 bg-white border-2 border-[#2458a0] rounded-lg hover:bg-[#2458a0] hover:text-white transition-all font-black text-[#2458a0] hover:text-white"
                  >
                    📞 1-800-THE-LOST (US)
                  </a>
                  <a
                    href="https://www.icmec.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 sm:p-4 bg-white border-2 border-[#6b7280] rounded-lg hover:bg-[#6b7280] hover:text-white transition-all font-black text-[#6b7280] hover:text-white"
                  >
                    🌍 ICMEC International Hotline
                  </a>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Legal & Support above the map */}
          {(['legal', 'support'] as const).map((catKey) => {
            const categoryResources = groupedResources[catKey] || [];
            if (categoryResources.length === 0) return null;

            return (
              <section id={catKey} key={catKey} className="py-6 md:py-10 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-black py-4 mb-0 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#6b7280] bg-clip-text text-transparent text-left pl-8">
                      {categoryLabels[catKey]}
                    </h2>
                  </div>

                  <div className="space-y-4 w-full">
                    {categoryResources.map((resource: Resource, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-white border-[#f0ede4] hover:border-[#2458a0] transition-all">
                          <CardContent className="pt-6 text-left">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black text-[#2458a0] mb-2 truncate">
                                  {resource.title}
                                </h3>
                                <p className="text-sm text-[#2458a0] opacity-70 font-bold mb-4 truncate">
                                  {resource.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Open ${resource.title}`}
                                  className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#2458a0] to-[#6b7280] rounded-full hover:opacity-90"
                                >
                                  <span className="sr-only">Open {resource.title}</span>
                                  <ExternalLink className="h-4 w-4 text-white" />
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>
            );
          })}

          {/* Re-inserted: INTERACTIVE RESOURCE MAP */}
          <div id="available" />
          <section id="map" className="py-6 md:py-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full bg-gradient-to-br from-[#2458a0]/5 to-[#6b7280]/5 border border-[#f0ede4] rounded-3xl p-8"
            >
              <h2 className="text-xl font-black py-4 mb-0 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#6b7280] bg-clip-text text-transparent text-left">
                Find Help Near You
              </h2>
              <p className="text-sm text-[#2458a0] opacity-70 font-bold mb-6">
                Allow access to your location to find support organizations and legal resources nearest to you worldwide.
              </p>

              <div className="mt-6">
                <InteractiveResourceMap />
              </div>
            </motion.div>
          </section>

          {Object.entries(categoryLabels).map((entry) => {
            const [categoryKey, categoryName] = entry;
            const categoryResources = groupedResources[categoryKey] || [];

            // Skip categories shown elsewhere
            if (categoryKey === 'research' || categoryKey === 'legal' || categoryKey === 'support') return null;

            if (categoryResources.length === 0) return null;

            return (
              <section key={categoryKey} className="py-3 md:py-5 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-black py-4 uppercase tracking-tight bg-gradient-to-r from-[#2458a0] to-[#6b7280] bg-clip-text text-transparent text-left pl-8">
                      {categoryName}
                    </h2>
                  </div>

                      <div className="space-y-4 w-full">
                    {categoryResources.map((resource: Resource, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-white border-[#f0ede4] hover:border-[#2458a0] transition-all">
                          <CardContent className="pt-6 text-left">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black text-[#2458a0] mb-2 truncate">
                                  {resource.title}
                                </h3>
                                <p className="text-sm text-[#2458a0] opacity-70 font-bold mb-4 truncate">
                                  {resource.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Open ${resource.title}`}
                                  className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#2458a0] to-[#6b7280] rounded-full hover:opacity-90"
                                >
                                  <span className="sr-only">Open {resource.title}</span>
                                  <ExternalLink className="h-4 w-4 text-white" />
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
