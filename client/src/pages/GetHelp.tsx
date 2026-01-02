import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InteractiveResourceMap } from "@/components/InteractiveResourceMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Globe, 
  FileText, 
  BarChart3, 
  Phone, 
  ExternalLink,
  Heart
} from "lucide-react";

interface Resource {
  title: string;
  description: string;
  url: string;
  category: "legal" | "research" | "support" | "international";
  icon: React.ReactNode;
}

const resources: Resource[] = [
  {
    title: "Hague Convention on International Child Abduction",
    description: "Official treaty information and signatory countries for the 1980 Hague Convention - the primary legal framework for addressing international parental child abduction.",
    url: "https://www.hcch.net/en/instruments/conventions/specialised-sections/parental-responsibility-and-protection-of-children/hague-convention-on-international-child-abduction",
    category: "legal",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "International Center for Missing & Exploited Children (ICMEC)",
    description: "Global resources for missing and abducted children, including country-specific contact information and legal resources.",
    url: "https://www.icmec.org/",
    category: "international",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "U.S. State Department - Child Abduction",
    description: "Official U.S. government resources for parents dealing with international child abduction cases.",
    url: "https://travel.state.gov/content/travel/en/International-Parental-Child-Abduction.html",
    category: "legal",
    icon: <Phone className="h-6 w-6" />,
  },
  {
    title: "Reunite International",
    description: "UK-based charity providing emotional support and practical advice for parents of abducted children.",
    url: "https://www.reunite.org/",
    category: "support",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    title: "Global Family Law Network",
    description: "International directory of family law attorneys specializing in parental abduction cases.",
    url: "https://www.globalfamilylaw.org/",
    category: "legal",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "UN Sustainable Development Goals - Family & Children",
    description: "Research and statistics on global child welfare and family separation issues from the United Nations.",
    url: "https://www.un.org/sustainabledevelopment/",
    category: "research",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "World Health Organization - Family Separation Impact",
    description: "Scientific research on the psychological and health impacts of family separation.",
    url: "https://www.who.int/",
    category: "research",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "NCMEC - National Center for Missing & Exploited Children (U.S.)",
    description: "Comprehensive U.S. resources including hotline (1-800-THE-LOST) and case assistance.",
    url: "https://www.missingkids.org/",
    category: "support",
    icon: <Phone className="h-6 w-6" />,
  },
];

const categoryColors: Record<string, string> = {
  legal: "bg-blue-100 text-blue-800",
  research: "bg-purple-100 text-purple-800",
  support: "bg-pink-100 text-pink-800",
  international: "bg-green-100 text-green-800",
};

const categoryLabels: Record<string, string> = {
  legal: "Legal Resources",
  research: "Research & Statistics",
  support: "Support Services",
  international: "International Organizations",
};

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
    <div className="min-h-screen bg-[#f5f1e8] flex flex-col">
      <Header />

      <main className="pt-28 pb-20 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <Heart className="h-12 w-12 text-[#f26522] mx-auto mb-4" />
            <h1 className="text-4xl font-black text-[#4a453e] mb-4">Get Help</h1>
            <p className="text-lg text-[#4a453e] opacity-70 font-bold max-w-2xl mx-auto">
              Resources, legal assistance, and support services for families affected by international child abduction and separation.
            </p>
          </motion.div>

          {/* INTERACTIVE RESOURCE MAP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16 bg-gradient-to-br from-[#2458a0]/5 to-[#f26522]/5 border border-[#dcd7ca] rounded-3xl p-8"
          >
            <h2 className="text-2xl font-black text-[#4a453e] uppercase tracking-tight mb-2 flex items-center gap-3">
              <Globe className="h-6 w-6 text-[#2458a0]" /> Find Help Near You
            </h2>
            <p className="text-sm text-[#4a453e] opacity-70 font-bold mb-6">
              Allow access to your location to find support organizations and legal resources nearest to you worldwide.
            </p>
            <InteractiveResourceMap />
          </motion.div>

          {Object.entries(categoryLabels).map((entry) => {
            const [categoryKey, categoryName] = entry;
            const categoryResources = groupedResources[categoryKey] || [];

            if (categoryResources.length === 0) return null;

            return (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="mb-4">
                  <Badge className={`${categoryColors[categoryKey]} text-sm font-black px-4 py-2`}>
                    {categoryName}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {categoryResources.map((resource: Resource, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="text-[#2458a0] flex-shrink-0">
                              {resource.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-black text-[#4a453e] mb-2">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-[#4a453e] opacity-70 font-bold mb-4">
                                {resource.description}
                              </p>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2458a0] to-[#f26522] text-white rounded-full font-black text-xs uppercase tracking-widest hover:shadow-lg transition-shadow"
                              >
                                Visit Resource <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-[#2458a0]/10 to-[#f26522]/10 border border-[#dcd7ca] rounded-3xl p-8 text-center"
          >
            <h2 className="text-2xl font-black text-[#4a453e] mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-[#4a453e] font-bold mb-6">
              If you or someone you know is facing an international child abduction situation, please reach out to these crisis services:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="tel:1-800-THE-LOST"
                className="block p-4 bg-white border-2 border-[#2458a0] rounded-lg hover:bg-[#2458a0] hover:text-white transition-all font-black text-[#2458a0] hover:text-white"
              >
                📞 1-800-THE-LOST (US)
              </a>
              <a
                href="https://www.icmec.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white border-2 border-[#f26522] rounded-lg hover:bg-[#f26522] hover:text-white transition-all font-black text-[#f26522] hover:text-white"
              >
                🌍 ICMEC International Hotline
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
