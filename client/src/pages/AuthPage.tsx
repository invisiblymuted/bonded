import { useState } from "react";
import { useLocation, Redirect, Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type UserOption = {
  id: string;
  username?: string | null;
  email?: string | null;
  firstName?: string | null;
};

export default function AuthPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const mode = location.includes("signup") ? "signup" : "login";

  const [selectedUser, setSelectedUser] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const usersQuery = useQuery<UserOption[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users", { credentials: "include" });
      if (!res.ok) throw new Error("Unable to load users");
      return res.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const body = {
        username: selectedUser || username,
        pin,
      };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
      }
      
      const userData = await res.json();
      // Save to localStorage for persistence
      localStorage.setItem("bonded_user", JSON.stringify(userData));
      localStorage.setItem("bonded_auth_timestamp", new Date().toISOString());
      
      return userData;
    },
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/app");
    },
    onError: (err: any) => setError(err?.message || "Login failed"),
  });

  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, pin, birthday, displayName }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Signup failed");
      }
      
      const userData = await res.json();
      // Save to localStorage for persistence
      localStorage.setItem("bonded_user", JSON.stringify(userData));
      localStorage.setItem("bonded_auth_timestamp", new Date().toISOString());
      
      return userData;
    },
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/app");
    },
    onError: (err: any) => setError(err?.message || "Signup failed"),
  });

  if (user) return <Redirect to="/app" />;

  const users = usersQuery.data ?? [];
  const options = users.map((u) => ({
    value: u.username || u.email || "",
    label: u.username || u.email || u.firstName || "User",
  })).filter((o) => o.value);

  const handleLogin = () => {
    if (!(selectedUser || username)) {
      setError("Pick a user or type a username");
      return;
    }
    if (!pin || pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    loginMutation.mutate();
  };

  const handleSignup = () => {
    if (!username) return setError("Username is required");
    if (!displayName) return setError("Name to show is required");
    if (!birthday) return setError("Birthday is required");
    if (!pin || pin.length < 4) return setError("PIN must be at least 4 digits");
    if (pin !== confirmPin) return setError("PINs do not match");
    signupMutation.mutate();
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f1e8] via-[#ede8dc] to-[#f5f1e8] flex flex-col">
      <Header />
      <div className="flex items-center justify-center p-4 pt-24 flex-1">
        <Card className="w-full max-w-lg bg-white/90 border-[#dcd7ca] shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-[#4a453e]">
                {isLogin ? "Log In" : "Join Bonded"}
              </CardTitle>
              <Link href="/landing">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#4a453e] hover:text-[#2458a0]">
                  ← Home
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
          {isLogin ? (
            <div className="space-y-4">
              {options.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#4a453e]">Choose your name</label>
                  <select
                    className="w-full h-12 rounded-lg border border-slate-200 px-3 bg-white"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">Or type your username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">PIN (min 4)</label>
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={10}
                  className="h-12"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button className="w-full h-12 btn-gradient" onClick={handleLogin} disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in…" : "Log In"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Pick a username"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">Name to show (display name)</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="What should we call you?"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">Birthday (private)</label>
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">PIN (min 4)</label>
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={10}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#4a453e]">Confirm PIN</label>
                <Input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  maxLength={10}
                  className="h-12"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button className="w-full h-12 btn-gradient" onClick={handleSignup} disabled={signupMutation.isPending}>
                {signupMutation.isPending ? "Creating profile…" : "Build Your Bonds"}
              </Button>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}