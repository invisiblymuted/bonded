import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/GradientIcon";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Copy, Check, User, Mail, Calendar, Sparkles } from "lucide-react";
import { BondedLogo } from "@/components/BondedLogo";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { format, differenceInDays } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f1e8]">
        <Header />
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/signup" className="block">
                <Card className="h-full bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all cursor-pointer">
                  <CardContent className="h-full flex flex-col items-center justify-center py-12 gap-4">
                    <BondedLogo className="w-16 h-16" />
                    <CardTitle className="text-2xl font-black text-[#4a453e]">Join</CardTitle>
                    <CardDescription className="text-sm text-[#4a453e] opacity-70">Create your Bonded profile.</CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/login" className="block">
                <Card className="h-full bg-white border-[#dcd7ca] hover:border-[#2458a0] transition-all cursor-pointer">
                  <CardContent className="h-full flex flex-col items-center justify-center py-12 gap-4">
                    <BondedLogo className="w-16 h-16" />
                    <CardTitle className="text-2xl font-black text-[#4a453e]">Already Bonded?</CardTitle>
                    <CardDescription className="text-sm text-[#4a453e] opacity-70">Log in with your PIN.</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 max-w-2xl py-10 flex-1">
        <Link href="/app">
          <Button variant="ghost" className="mb-4 gap-2" data-testid="button-back-dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || 'Profile'} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl" data-testid="text-profile-name">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>Your Bonded Profile</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <GradientIcon icon={<User className="h-5 w-5" />} />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Your User ID</p>
                    <p className="font-mono text-sm" data-testid="text-profile-user-id">{user.id}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyUserId} className="gap-1" data-testid="button-copy-profile-id">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <GradientIcon icon={<Mail className="h-5 w-5" />} />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm" data-testid="text-profile-email">{user.email}</p>
                  </div>
                </div>

                {user.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <GradientIcon icon={<Calendar className="h-5 w-5" />} />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-sm" data-testid="text-profile-joined">
                        {format(new Date(user.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Share your User ID with family members so they can connect with you on Bonded.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
