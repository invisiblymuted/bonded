import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { user } = useAuth();

  // If already logged in, send them to the dashboard
  if (user) return <Redirect to="/dashboard" />;

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#e9e4d9] border-[#dcd7ca]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#4a453e] text-center">
            Welcome to Bonded
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground mb-6">
            Sign in to stay connected with your family.
          </p>
          <Button 
            className="w-full btn-gradient" 
            onClick={() => window.location.href = '/api/login'}
          >
            Log In / Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}