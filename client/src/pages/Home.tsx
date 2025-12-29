import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { MessageSquare, BookOpen, Share2, ArrowRight, Heart, Calendar, Video, Shield, Users, Globe, Star, CheckCircle, Lock } from "lucide-react";
import { GradientIcon } from "@/components/GradientIcon";
import { motion } from "framer-motion";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  const useCases = [
    {
      title: "Military Families",
      description: "Parents deployed overseas can stay present in their children's daily lives through shared journals, video calls, and real-time messaging.",
      stat: "2.5M",
      statLabel: "military children in the US",
    },
    {
      title: "Divorced Parents",
      description: "Co-parents can maintain strong bonds with their children regardless of custody arrangements, sharing moments and memories seamlessly.",
      stat: "50%",
      statLabel: "of US marriages end in divorce",
    },
    {
      title: "Grandparents",
      description: "Grandparents living far away can be part of their grandchildren's growth, receiving drawings, photos, and video calls.",
      stat: "70M+",
      statLabel: "grandparents in America",
    },
    {
      title: "Incarcerated Parents",
      description: "Maintaining parent-child bonds during incarceration leads to better outcomes for children and reduced recidivism rates.",
      stat: "2.7M",
      statLabel: "children with incarcerated parents",
    },
  ];

  const testimonials = [
    {
      quote: "Bonded helped me stay connected with my daughter during my 9-month deployment. The shared journal became our special place to talk every day.",
      author: "Sarah M.",
      role: "Army Captain, Mother of 2",
      rating: 5,
    },
    {
      quote: "My kids love sending me drawings and voice messages. It's like I'm still part of their everyday life even though I'm 1,000 miles away.",
      author: "Michael R.",
      role: "Divorced Father",
      rating: 5,
    },
    {
      quote: "As a grandmother, I finally feel included in my grandchildren's lives. The video calls and shared calendar make me feel like I live next door.",
      author: "Patricia L.",
      role: "Grandmother of 4",
      rating: 5,
    },
  ];

  const stats = [
    { value: "13M+", label: "Children with a parent living apart", icon: Users },
    { value: "400K", label: "Military kids with deployed parents", icon: Globe },
    { value: "72%", label: "Long-distance families want better tools", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BondedLogo className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Bonded</span>
          </div>
          {isLoading ? (
            <div className="w-20 h-10 bg-muted rounded animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex gap-2 flex-wrap">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <a href="/api/logout">
                <Button variant="ghost">Logout</Button>
              </a>
            </div>
          ) : (
            <a href="/api/login">
              <Button className="btn-gradient">Get Started</Button>
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500/10 via-primary/10 to-transparent pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <BondedLogo className="h-16 w-16 mx-auto text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight"
          >
            Stay Connected,{" "}
            <span className="bg-gradient-to-r from-blue-500 via-primary to-primary/60 bg-clip-text text-transparent">
              Worlds Apart
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto"
          >
            A secure platform that keeps relationships alive, families together, and making memories possible.
          </motion.p>
          {!isLoading && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="/api/login">
                <Button size="lg" className="gap-2 btn-gradient w-full sm:w-auto">
                  Start Free Today <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Problem/Stats Section */}
      <div className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Millions of Families Need Better Connection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Distance doesn't have to mean disconnection. Yet millions of families struggle with inadequate tools to maintain meaningful relationships.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-3">
                  <GradientIcon icon={<stat.icon className="h-8 w-8" />} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Built for Families Like Yours</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're serving overseas, navigating co-parenting, or living far from loved ones, Bonded keeps your family connected.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  <div className="flex items-baseline gap-2 pt-2 border-t border-border">
                    <span className="text-2xl font-bold text-primary">{useCase.stat}</span>
                    <span className="text-xs text-muted-foreground">{useCase.statLabel}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything You Need to Stay Close</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete toolkit designed specifically for maintaining family bonds across any distance.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Real-time Messaging",
                description: "Stay in touch with instant messages that feel like you're in the same room.",
                features: ["Send text messages instantly", "See when messages are delivered", "Keep conversation history safe"],
                href: "/messages",
              },
              {
                icon: BookOpen,
                title: "Shared Journals",
                description: "Create a private space to write, reflect, and share your thoughts together.",
                features: ["Write daily entries with mood tracking", "Attach photos and videos to entries", "Read and respond to each other's journals"],
                href: "/journal",
              },
              {
                icon: Share2,
                title: "Media Gallery",
                description: "Build a shared collection of precious moments and creative expressions.",
                features: ["Upload photos and drawings", "Share voice recordings", "Store videos of special moments"],
                href: "/gallery",
              },
              {
                icon: Calendar,
                title: "Shared Calendar",
                description: "Never miss important dates and plan visits together with a shared family calendar.",
                features: ["Track birthdays and special events", "Schedule video calls and visits", "Set reminders for important moments"],
                href: "/calendar",
              },
              {
                icon: Video,
                title: "Video Calls",
                description: "See each other face-to-face with free, built-in video calling.",
                features: ["One-click video calls", "No extra apps needed", "High-quality video and audio"],
                href: "/video",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your family's connection is protected with the highest security standards.",
                features: ["Private, invite-only connections", "End-to-end security", "COPPA compliant for children"],
                href: null,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {feature.href ? (
                  <Link href={feature.href}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <GradientIcon icon={<feature.icon className="h-7 w-7" />} />
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {feature.features.map((item, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <GradientIcon icon={<feature.icon className="h-7 w-7" />} />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {feature.features.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Loved by Families Everywhere</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from families who use Bonded to stay connected across distances.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust & Security Section */}
      <div className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-4">
              <GradientIcon icon={<Lock className="h-10 w-10" />} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Your Family's Privacy is Our Priority</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built Bonded with security and privacy at its core, so you can focus on what matters: your family.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Private Connections", desc: "Invite-only family groups" },
              { icon: Lock, title: "Secure Data", desc: "Your data is encrypted and protected" },
              { icon: Users, title: "Child Safe", desc: "Designed with child safety in mind" },
              { icon: Heart, title: "No Ads Ever", desc: "Your family data is never sold" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4"
              >
                <div className="flex justify-center mb-3">
                  <GradientIcon icon={<item.icon className="h-6 w-6" />} />
                </div>
                <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isLoading && !isAuthenticated && (
        <div className="bg-gradient-to-br from-blue-500/10 via-primary/10 to-transparent">
          <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <BondedLogo className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Bring Your Family Closer?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of families who stay connected with Bonded. Free to start, priceless for your relationships.
              </p>
              <a href="/api/login">
                <Button size="lg" className="btn-gradient gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BondedLogo className="h-5 w-5 text-primary" />
              <span className="font-medium">Bonded</span>
              <span className="text-sm text-muted-foreground">- Keeping families connected</span>
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
