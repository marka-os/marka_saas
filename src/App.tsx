import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@marka/components/ui/toaster";
import { TooltipProvider } from "@marka/components/ui/tooltip";
import { AuthGuard } from "@marka/components/AuthGuard";
import { LoadingRoot } from "@marka/components/ui/loading-root";

// Page imports
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Teachers from "./pages/teachers";
import Schools from "./pages/schools";
import Subjects from "./pages/subjects";
//import Assessments from "./pages/assessments";
import Reports from "./pages/reports";
import Analytics from "./pages/analytics";
import NotFound from "./pages/not-found";

import { useEffect } from "react";
import VerificationPage from "./pages/verificationPage";

function Router() {
  return (
    <Switch>
      {/* Public routes, redirect authenticated users to dashboard */}
      <Route
        path="/"
        component={() => (
          <AuthGuard requireAuth={false}>
            <Landing />
          </AuthGuard>
        )}
      />
      <Route
        path="/login"
        component={() => (
          <AuthGuard requireAuth={false}>
            <Login />
          </AuthGuard>
        )}
      />
      <Route
        path="/register"
        component={() => (
          <AuthGuard requireAuth={false}>
            <Register />
          </AuthGuard>
        )}
      />
      <Route
        path="/verify"
        component={() => (
          <AuthGuard requireAuth={false}>
            <VerificationPage />
          </AuthGuard>
        )}
      />

      {/* Private routes, require authentication */}
      <Route
        path="/dashboard"
        component={() => (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        )}
      />
      <Route
        path="/students"
        component={() => (
          <AuthGuard>
            <Students />
          </AuthGuard>
        )}
      />
      <Route
        path="/teachers"
        component={() => (
          <AuthGuard>
            <Teachers />
          </AuthGuard>
        )}
      />
      <Route
        path="/schools"
        component={() => (
          <AuthGuard>
            <Schools />
          </AuthGuard>
        )}
      />
      <Route
        path="/subjects"
        component={() => (
          <AuthGuard>
            <Subjects />
          </AuthGuard>
        )}
      />
      <Route
        path="/reports"
        component={() => (
          <AuthGuard>
            <Reports />
          </AuthGuard>
        )}
      />
      <Route
        path="/analytics"
        component={() => (
          <AuthGuard>
            <Analytics />
          </AuthGuard>
        )}
      />
      <Route component={NotFound} />
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
        <LoadingRoot>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Toaster />
            <Router />
          </div>
        </LoadingRoot>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
