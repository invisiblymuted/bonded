import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/GradientIcon";
import { Copy, Check, User, Mail, Calendar, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return null;
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-primary/5 to-background">
      
      <div className="container mx-auto px-4 max-w-2xl py-8">
        <Link href="/dashboard">
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
