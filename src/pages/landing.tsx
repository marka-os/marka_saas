// Landing.tsx
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@marka/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@marka/components/ui/card";
import { Badge } from "@marka/components/ui/badge";
import {
  GraduationCap,
  Users,
  FileText,
  BarChart3,
  Shield,
  Smartphone,
  ArrowRight,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";

export default function Landing() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Marka OS features
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Maintain complete student profiles, LIN integration, class placement, and academic history.",
    },
    {
      icon: GraduationCap,
      title: "Teacher Portal",
      description:
        "Empower teachers with grade entry, lesson planning, and classroom management tools.",
    },
    {
      icon: FileText,
      title: "UNEB-Compliant Reports",
      description:
        "Generate official report cards and transcripts that meet UNEB standards.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Real-time academic, financial, and attendance insights for smarter decisions.",
    },
    {
      icon: Shield,
      title: "Multi-Tenant Security",
      description:
        "Enterprise-grade security with role-based access and school-level isolation.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Progressive Web App with offline support, built for schools with limited internet.",
    },
  ];

  const stats = [
    { number: "500+", label: "Schools Running on Marka OS" },
    { number: "70K+", label: "Students Empowered" },
    { number: "15K+", label: "Teachers Enabled" },
    { number: "24/7", label: "Dedicated Support" },
  ];

  const schoolImages = [
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Marka OS
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=1920&h=1080')`,
          }}
        />
        <div className="relative z-10 text-center max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Uganda’s{" "}
            <span className="text-primary">School Operating System</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Marka OS helps schools manage students, teachers, finance, and
            reports in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-6">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 bg-white/10 border-white/20 text-white"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
      {/* Features */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              All-in-One School Management
            </h2>
            <p className="text-xl text-muted-foreground">
              From classrooms to finances, everything runs on Marka OS.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="shadow-md hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{f.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold mb-2">{s.number}</div>
              <div className="text-sm opacity-90">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Schools Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Schools
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Trusted Across Uganda</h2>
          <p className="text-muted-foreground mb-12">
            Hundreds of schools already run on Marka OS
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {schoolImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}{" "}
      <footer className="bg-card border-t border-border py-12">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <div className="grid md:grid-cols-4 gap-8">
            {" "}
            <div>
              {" "}
              <div className="flex items-center space-x-2 mb-4">
                {" "}
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  {" "}
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />{" "}
                </div>{" "}
                <span className="font-bold text-foreground">Marka OS</span>{" "}
              </div>{" "}
              <p className="text-muted-foreground mb-4">
                {" "}
                Transforming education in Uganda with modern, UNEB-compliant
                report card generation.{" "}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <h4 className="font-semibold text-foreground mb-4">
                Product
              </h4>{" "}
              <ul className="space-y-2 text-muted-foreground">
                {" "}
                <li>
                  {" "}
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Features{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Pricing{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a
                    href="#api"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    API Docs{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            <div>
              {" "}
              <h4 className="font-semibold text-foreground mb-4">
                Support
              </h4>{" "}
              <ul className="space-y-2 text-muted-foreground">
                {" "}
                <li>
                  {" "}
                  <a
                    href="#help"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Help Center{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a
                    href="#contact"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Contact Us{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a
                    href="#training"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Training{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            <div>
              {" "}
              <h4 className="font-semibold text-foreground mb-4">
                Company
              </h4>{" "}
              <ul className="space-y-2 text-muted-foreground">
                {" "}
                <li>
                  {" "}
                  <a
                    href="#about"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    About{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a
                    href="#privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Privacy{" "}
                  </a>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <a
                    href="#terms"
                    className="hover:text-foreground transition-colors"
                  >
                    {" "}
                    Terms{" "}
                  </a>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            {" "}
            <p>
              {" "}
              &copy; {new Date().getFullYear()} Marka OS. All rights reserved.
              Built for Uganda's educational excellence.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
}
