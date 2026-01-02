import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AuthChoice from "./pages/AuthChoice";
import Research from "./pages/Research";
import Profile from "./pages/Profile";
import Tutorial from "./pages/Tutorial";
import Notifications from "./pages/Notifications";
import VideoCall from "./pages/VideoCall";
import GetHelp from "./pages/GetHelp";

// The Router handles the URL paths
function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/app" component={Dashboard} />
      <Route path="/home" component={Home} />
      <Route path="/landing" component={Landing} />
      <Route path="/choice" component={AuthChoice} />
      <Route path="/auth" component={AuthChoice} />
      <Route path="/login" component={AuthPage} />
      <Route path="/signup" component={AuthPage} />
      <Route path="/profile" component={Profile} />
      <Route path="/research" component={Research} />
      <Route path="/help" component={GetHelp} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/tutorials/:id" component={Tutorial} />
      <Route path="/video" component={VideoCall} />
      {/* 404 Fallback */}
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-[#f5f1e8]">
          <h1 className="text-2xl font-bold text-[#4a453e]">404 Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;