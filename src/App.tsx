import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@marka/components/ui/toaster";
import { TooltipProvider } from "@marka/components/ui/tooltip";
import { useAuth } from "./hooks/use-auth";

// Page imports
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Schools from "./pages/schools";
import Subjects from "./pages/subjects";
//import Assessments from "./pages/assessments";
import Reports from "./pages/reports";
import Analytics from "./pages/analytics";
import NotFound from "./pages/not-found";

import { useEffect } from "react";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <div className="loading-spinner w-8 h-8"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/students" component={Students} />
          <Route path="/schools" component={Schools} />
          <Route path="/subjects" component={Subjects} />
          <Route path="/reports" component={Reports} />
          <Route path="/analytics" component={Analytics} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Handle dark mode preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark" || (!storedTheme && prefersDark.matches)) {
      document.documentElement.classList.add("dark");
    }

    // Listen for system theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    prefersDark.addEventListener("change", handleThemeChange);
    return () => prefersDark.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
