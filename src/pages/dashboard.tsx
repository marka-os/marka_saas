import {
  Users,
  UserCheck,
  FileText,
  School,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@marka/components/layout/dashboard-layout";
import { StatsCard } from "@marka/components/ui/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@marka/components/ui/card";
import { Button } from "@marka/components/ui/button";
import { Badge } from "@marka/components/ui/badge";
import { Link } from "wouter";


export default function Dashboard() {
 
  // Mock data for now - in real app this would come from API
  const statsData = {
    totalStudents: 1247,
    activeTeachers: 85,
    reportsGenerated: 542,
    totalSchools: 3,
  };

  const recentActivities = [
    {
      id: 1,
      type: "student_added",
      title: "Sarah Nakato added to Primary 6A",
      time: "2 hours ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "report_generated",
      title: "Term 1 reports generated for S4 class",
      time: "5 hours ago",
      icon: FileText,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "teacher_updated",
      title: "Mr. James Okello updated Mathematics grades",
      time: "1 day ago",
      icon: UserCheck,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Add New Student",
      description: "Register a new student in the system",
      href: "/students",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Add New Teacher",
      description: "Add a new teacher to your school",
      href: "/teachers",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Generate Reports",
      description: "Create report cards for students",
      href: "/reports",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "View Analytics",
      description: "Analyze performance and trends",
      href: "/analytics",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at your school today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={statsData.totalStudents.toLocaleString()}
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
            data-testid="stats-students"
          />
          <StatsCard
            title="Active Teachers"
            value={statsData.activeTeachers}
            icon={UserCheck}
            trend={{ value: "3", isPositive: true }}
            description="new this term"
            data-testid="stats-teachers"
          />
          <StatsCard
            title="Reports Generated"
            value={statsData.reportsGenerated}
            icon={FileText}
            trend={{ value: "98%", isPositive: true }}
            description="completion rate"
            data-testid="stats-reports"
          />
          <StatsCard
            title="Schools"
            value={statsData.totalSchools}
            icon={School}
            description="active institutions"
            data-testid="stats-schools"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-4 hover:bg-accent"
                      data-testid={`quick-action-${action.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and changes in your school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${activity.color}`}
                      >
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Academic Calendar Preview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Academic Calendar
                  </CardTitle>
                  <CardDescription>
                    Upcoming events and important dates
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View Full Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Term 2 Mid-Term Exams</h4>
                    <p className="text-sm text-muted-foreground">
                      Assessment period for all classes
                    </p>
                  </div>
                  <Badge variant="outline">May 15-19, 2025</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Report Cards Distribution</h4>
                    <p className="text-sm text-muted-foreground">
                      Parent-teacher conferences
                    </p>
                  </div>
                  <Badge variant="outline">May 26, 2025</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Term 2 Holidays Begin</h4>
                    <p className="text-sm text-muted-foreground">
                      End of academic term
                    </p>
                  </div>
                  <Badge variant="outline">June 2, 2025</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
