import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BondedLogo } from "@/components/BondedLogo";
import { MessageSquare, BookOpen, Share2, ArrowRight, Heart } from "lucide-react";
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
      <div className="relative bg-gradient-to-b from-primary/10 via-transparent to-transparent py-4 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-bold mb-4 text-foreground"
          >
            Stay Connected,{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Miles Apart
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
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Real-time Messaging",
              description: "Chat with your loved ones anytime, anywhere",
            },
            {
              icon: BookOpen,
              title: "Shared Journals",
              description: "Write together, capture memories, express feelings",
            },
            {
              icon: Share2,
              title: "Media Sharing",
              description: "Share photos, artwork, audio, and videos",
            },
            {
              icon: Heart,
              title: "Secure & Private",
              description: "End-to-end encrypted, your family data is safe",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
              <Button size="lg">Start Your Journey</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}