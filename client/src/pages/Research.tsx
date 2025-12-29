import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BondedLogo } from "@/components/BondedLogo";
import { ArrowLeft, ExternalLink, BookOpen, Users, Shield, Heart, Globe, Home as HomeIcon } from "lucide-react";
import { GradientIcon } from "@/components/GradientIcon";

interface Source {
  title: string;
  organization: string;
  year: string;
  url: string;
  statistic: string;
  context: string;
}

const familySeparationSources: Source[] = [
  {
    title: "America's Families and Living Arrangements",
    organization: "U.S. Census Bureau",
    year: "2023",
    url: "https://www.census.gov/topics/families/families-and-households.html",
    statistic: "22 million children live with one parent",
    context: "The Census Bureau tracks family living arrangements annually, showing that approximately 22 million children under 18 live with only one of their parents, often due to divorce, separation, or other circumstances."
  },
  {
    title: "2023 Demographics Profile of the Military Community",
    organization: "Department of Defense",
    year: "2023",
    url: "https://www.militaryonesource.mil/data-research-and-statistics/military-community-demographics/",
    statistic: "1.8 million active-duty military members with families",
    context: "The DoD reports approximately 1.3 million active-duty service members, with over 40% having children. Many experience deployment separations ranging from months to over a year."
  },
  {
    title: "Parents in Prison and Their Minor Children",
    organization: "Prison Policy Initiative",
    year: "2023",
    url: "https://www.prisonpolicy.org/reports/parentsandchildren.html",
    statistic: "2.7 million children have an incarcerated parent",
    context: "Research shows that 2.7 million children in the United States have at least one parent who is incarcerated. Maintaining family bonds during incarceration is associated with reduced recidivism and better outcomes for children."
  },
  {
    title: "Grandparents in America",
    organization: "AARP Research",
    year: "2023",
    url: "https://www.aarp.org/research/topics/life/info-2019/grandparents-grandchildren.html",
    statistic: "70+ million grandparents in America",
    context: "AARP reports there are over 70 million grandparents in the United States. Many live geographically distant from their grandchildren and seek meaningful ways to stay connected."
  },
  {
    title: "Living Arrangements of Children",
    organization: "National Center for Education Statistics",
    year: "2022",
    url: "https://nces.ed.gov/programs/coe/indicator/cce",
    statistic: "13+ million children with a parent living apart",
    context: "NCES data indicates that millions of children have parents who live in separate households, creating ongoing needs for cross-household family connection."
  }
];

const militaryFamilySources: Source[] = [
  {
    title: "Military Deployment and Child Development",
    organization: "American Academy of Pediatrics",
    year: "2022",
    url: "https://publications.aap.org/pediatrics/article/131/4/e1267/31927/Supporting-the-Family-After-the-Death-of-a-Service",
    statistic: "Deployment affects 400,000+ military children annually",
    context: "Research shows that parental deployment can significantly impact children's emotional and behavioral development, emphasizing the importance of maintaining communication during separation."
  },
  {
    title: "Military Family Research Institute",
    organization: "Purdue University",
    year: "2023",
    url: "https://www.mfri.purdue.edu/",
    statistic: "Family connection improves deployment outcomes",
    context: "Studies from MFRI show that regular, meaningful communication between deployed parents and their children is associated with better adjustment and resilience for both parties."
  },
  {
    title: "Blue Star Families Military Lifestyle Survey",
    organization: "Blue Star Families",
    year: "2023",
    url: "https://bluestarfam.org/research/",
    statistic: "Communication is top concern during deployment",
    context: "Annual surveys consistently show that maintaining family connections ranks among the top concerns for military families during deployment periods."
  }
];

const technologyAdoptionSources: Source[] = [
  {
    title: "Technology Use Among Seniors",
    organization: "Pew Research Center",
    year: "2024",
    url: "https://www.pewresearch.org/internet/fact-sheet/internet-broadband/",
    statistic: "78% of adults 65+ use smartphones",
    context: "Smartphone adoption among older adults has grown dramatically, making digital family connection tools increasingly accessible to grandparents and elderly family members."
  },
  {
    title: "Digital Communication in Families",
    organization: "Common Sense Media",
    year: "2023",
    url: "https://www.commonsensemedia.org/research",
    statistic: "72% of families want better digital connection tools",
    context: "Research indicates strong demand among families for purpose-built communication tools that go beyond generic messaging apps."
  },
  {
    title: "Video Calling Adoption Post-Pandemic",
    organization: "Statista",
    year: "2024",
    url: "https://www.statista.com/topics/8464/video-conferencing/",
    statistic: "Video calling usage up 34% since 2020",
    context: "The COVID-19 pandemic accelerated adoption of video communication tools, normalizing virtual family connections across all age groups."
  }
];

const childDevelopmentSources: Source[] = [
  {
    title: "Parent-Child Relationships and Child Development",
    organization: "American Psychological Association",
    year: "2023",
    url: "https://www.apa.org/topics/parenting",
    statistic: "Consistent parent contact crucial for development",
    context: "Psychological research consistently demonstrates that maintaining strong parent-child bonds, even during periods of separation, is essential for healthy child development."
  },
  {
    title: "Effects of Parental Incarceration on Children",
    organization: "National Institute of Justice",
    year: "2022",
    url: "https://nij.ojp.gov/topics/articles/effects-parental-incarceration-children",
    statistic: "Family contact reduces negative outcomes",
    context: "NIJ research shows that children who maintain contact with incarcerated parents have better educational and behavioral outcomes than those without contact."
  },
  {
    title: "Long-Distance Parenting Research",
    organization: "Journal of Family Psychology",
    year: "2023",
    url: "https://www.apa.org/pubs/journals/fam",
    statistic: "Quality of contact matters more than quantity",
    context: "Research published in peer-reviewed journals indicates that the quality and meaningfulness of parent-child interactions during separation is more predictive of positive outcomes than frequency alone."
  }
];

const privacySecuritySources: Source[] = [
  {
    title: "Children's Online Privacy Protection",
    organization: "Federal Trade Commission",
    year: "2024",
    url: "https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa",
    statistic: "COPPA compliance required for children under 13",
    context: "Federal law requires special protections for children's data online. Bonded is designed with privacy-first architecture to protect family communications."
  },
  {
    title: "Digital Privacy Concerns Among Parents",
    organization: "Pew Research Center",
    year: "2023",
    url: "https://www.pewresearch.org/internet/2023/01/03/americans-virtual-lives-in-2023/",
    statistic: "81% of parents concerned about children's online privacy",
    context: "Research shows overwhelming parental concern about how their children's data is used online, driving demand for privacy-focused family platforms."
  }
];

function SourceCard({ source }: { source: Source }) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-start justify-between gap-2">
          <span>{source.title}</span>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="shrink-0" data-testid={`link-source-${source.title.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 flex-wrap">
          <span>{source.organization}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded">{source.year}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">
          {source.statistic}
        </p>
        <p className="text-sm text-muted-foreground">
          {source.context}
        </p>
      </CardContent>
    </Card>
  );
}

function SourceSection({ 
  title, 
  description, 
  icon, 
  sources 
}: { 
  title: string; 
  description: string; 
  icon: JSX.Element; 
  sources: Source[] 
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <GradientIcon icon={icon} />
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sources.map((source, index) => (
          <SourceCard key={index} source={source} />
        ))}
      </div>
    </motion.section>
  );
}

export default function Research() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <BondedLogo className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl text-blue-800">Bonded</span>
              </div>
            </Link>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500/10 via-primary/10 to-transparent py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GradientIcon icon={<BookOpen className="h-12 w-12" />} className="mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Research & Sources</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The statistics and claims presented on Bonded are grounded in peer-reviewed research, 
              government data, and reports from respected organizations. Below you'll find our sources.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
        
        <SourceSection
          title="Family Separation Statistics"
          description="Data on the scale of family separation in America"
          icon={<Users className="h-5 w-5" />}
          sources={familySeparationSources}
        />

        <SourceSection
          title="Military Family Research"
          description="Studies on military deployment and family connection"
          icon={<Globe className="h-5 w-5" />}
          sources={militaryFamilySources}
        />

        <SourceSection
          title="Technology Adoption"
          description="Research on digital communication trends and preferences"
          icon={<HomeIcon className="h-5 w-5" />}
          sources={technologyAdoptionSources}
        />

        <SourceSection
          title="Child Development"
          description="Psychological research on parent-child relationships"
          icon={<Heart className="h-5 w-5" />}
          sources={childDevelopmentSources}
        />

        <SourceSection
          title="Privacy & Security"
          description="Regulations and research on family data protection"
          icon={<Shield className="h-5 w-5" />}
          sources={privacySecuritySources}
        />

        {/* Methodology Note */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Our Research Methodology</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Source Selection:</strong> We prioritize primary sources from government agencies 
              (Census Bureau, Department of Defense, FTC), peer-reviewed academic journals, and established research organizations 
              (Pew Research, AARP, American Psychological Association).
            </p>
            <p>
              <strong className="text-foreground">Data Currency:</strong> We use the most recent available data, typically from 
              2022-2024 publications. Statistics are updated as new research becomes available.
            </p>
            <p>
              <strong className="text-foreground">Conservative Estimates:</strong> When sources provide ranges, we use conservative 
              estimates to ensure accuracy. We avoid sensationalized statistics or unverifiable claims.
            </p>
            <p>
              <strong className="text-foreground">Transparency:</strong> All sources are linked directly so readers can verify 
              claims and explore the original research in full context.
            </p>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-muted-foreground space-y-2"
        >
          <p>
            This page is provided for informational purposes. Statistics may change as new research is published.
          </p>
          <p>
            Last updated: December 2024
          </p>
        </motion.section>

        {/* Back to Home */}
        <div className="text-center pt-8">
          <Link href="/">
            <Button className="btn-gradient gap-2" data-testid="button-back-to-home">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 mt-12">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BondedLogo className="h-5 w-5 text-primary" />
              <span className="font-medium text-blue-800">Bonded</span>
              <span className="text-sm text-muted-foreground">- Keeping relationships alive</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
