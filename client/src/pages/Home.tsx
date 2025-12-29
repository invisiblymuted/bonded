import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { MessageSquare, BookOpen, Share2, ArrowRight, Heart, Calendar, Video } from "lucide-react";
import { GradientIcon } from "@/components/GradientIcon";
import { motion } from "framer-motion";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BondedLogo className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Bonded</span>
          </div>
          {isLoading ? (
            <div className="w-20 h-10 bg-muted rounded animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <a href="/api/logout">
                <Button variant="ghost">Logout</Button>
              </a>
            </div>
          ) : (
            <a href="/api/login">
              <Button>Login</Button>
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500/10 via-primary/10 to-transparent pt-12 pb-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-bold mb-6 text-foreground"
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
            >
              <a href="/api/login">
                <Button size="lg" className="gap-2 btn-gradient">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Real-time Messaging",
              description: "Stay in touch with instant messages that feel like you're in the same room.",
              features: ["Send text messages instantly", "See when messages are delivered", "Keep conversation history safe"],
            },
            {
              icon: BookOpen,
              title: "Shared Journals",
              description: "Create a private space to write, reflect, and share your thoughts together.",
              features: ["Write daily entries with mood tracking", "Attach photos and videos to entries", "Read and respond to each other's journals"],
            },
            {
              icon: Share2,
              title: "Media Gallery",
              description: "Build a shared collection of precious moments and creative expressions.",
              features: ["Upload photos and drawings", "Share voice recordings", "Store videos of special moments"],
            },
            {
              icon: Calendar,
              title: "Shared Calendar",
              description: "Never miss important dates and plan visits together with a shared family calendar.",
              features: ["Track birthdays and special events", "Schedule video calls and visits", "Set reminders for important moments"],
            },
            {
              icon: Video,
              title: "Video Calls",
              description: "See each other face-to-face with free, built-in video calling.",
              features: ["One-click video calls", "No extra apps needed", "High-quality video and audio"],
            },
            {
              icon: Heart,
              title: "Secure & Private",
              description: "Your family's connection is protected with the highest security standards.",
              features: ["Private, invite-only connections", "Your data stays yours", "Built with love and care"],
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
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
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!isLoading && !isAuthenticated && (
        <div className="bg-primary/5 border-y border-border">
          <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to make new memories?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Sign up now to create a secure connection with your family.
            </p>
            <a href="/api/login">
              <Button size="lg" className="btn-gradient">Start Your Journey</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}