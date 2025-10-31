import { Link, useLocation } from "wouter";
import { cn } from "@marka/lib/utils";
import { Button } from "@marka/components/ui/button";
import { ScrollArea } from "@marka/components/ui/scroll-area";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: UserCheck,
  },
  {
    title: "Classes",
    href: "/classes",
    icon: FolderKanban,
  },
  {
    title: "Schools",
    href: "/schools",
    icon: School,
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: BookOpen,
  },
  {
    title: "Assessments",
    href: "/assessments",
    icon: ClipboardCheck,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div
      className={cn(
        "relative border-r border-border bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Marka</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed ? "px-2" : "px-3",
                  location === item.href &&
                    "bg-secondary text-secondary-foreground"
                )}
                data-testid={`nav-${item.title.toLowerCase()}`}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.title}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Settings */}
      {!isCollapsed && (
        <div className="border-t border-border p-3">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4" />
            <span className="ml-3">Settings</span>
          </Button>
        </div>
      )}

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background hover:bg-accent"
        data-testid="sidebar-toggle"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
