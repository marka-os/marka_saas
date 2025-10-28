import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@marka/components/layout/dashboard-layout";
import { Button } from "@marka/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@marka/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@marka/components/ui/card";
import { Badge } from "@marka/components/ui/badge";
import { StatsCard } from "@marka/components/ui/stats-card";

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState("current-term");
  const [classFilter, setClassFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Mock analytics data - in real app this will come from API
  const analyticsData = {
    overview: {
      averagePerformance: 78.5,
      performanceTrend: 5.2,
      topSubject: "Mathematics",
      topSubjectScore: 85.3,
      attendanceRate: 94.2,
      totalStudents: 1247,
      completionRate: 98.7,
    },
    subjectPerformance: [
      {
        subject: "Mathematics",
        average: 85.3,
        highest: 98,
        lowest: 45,
        passRate: 89,
        trend: 5.2,
        students: 156,
      },
      {
        subject: "English",
        average: 79.1,
        highest: 95,
        lowest: 52,
        passRate: 83,
        trend: 2.8,
        students: 156,
      },
      {
        subject: "Science",
        average: 76.8,
        highest: 94,
        lowest: 48,
        passRate: 78,
        trend: -1.2,
        students: 156,
      },
      {
        subject: "Social Studies",
        average: 82.4,
        highest: 96,
        lowest: 58,
        passRate: 91,
        trend: 3.7,
        students: 156,
      },
    ],
    classPerformance: [
      { class: "P.7A", students: 45, average: 82.1, passRate: 93 },
      { class: "P.7B", students: 43, average: 78.9, passRate: 88 },
      { class: "P.6A", students: 47, average: 79.5, passRate: 85 },
      { class: "P.6B", students: 44, average: 75.2, passRate: 82 },
    ],
    performanceDistribution: [
      { grade: "Distinction (80-100%)", count: 234, percentage: 18.8 },
      { grade: "Credit (70-79%)", count: 356, percentage: 28.6 },
      { grade: "Pass (50-69%)", count: 467, percentage: 37.5 },
      { grade: "Fail (0-49%)", count: 190, percentage: 15.1 },
    ],
  };

  const timeRanges = [
    { value: "current-term", label: "Current Term" },
    { value: "previous-term", label: "Previous Term" },
    { value: "academic-year", label: "Academic Year" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Performance Analytics
            </h1>
            <p className="text-muted-foreground">
              Comprehensive insights into academic performance and trends
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time Range
              </label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger data-testid="filter-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Class Level
              </label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger data-testid="filter-class">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="p7">Primary 7</SelectItem>
                  <SelectItem value="p6">Primary 6</SelectItem>
                  <SelectItem value="p5">Primary 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger data-testid="filter-subject">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Average Performance"
            value={`${analyticsData.overview.averagePerformance}%`}
            icon={TrendingUp}
            trend={{
              value: `${analyticsData.overview.performanceTrend}%`,
              isPositive: true,
            }}
            description="from last term"
            data-testid="stats-average-performance"
          />
          <StatsCard
            title="Top Subject"
            value={analyticsData.overview.topSubject}
            icon={Award}
            description={`Average: ${analyticsData.overview.topSubjectScore}%`}
            data-testid="stats-top-subject"
          />
          <StatsCard
            title="Attendance Rate"
            value={`${analyticsData.overview.attendanceRate}%`}
            icon={Users}
            description="this academic term"
            data-testid="stats-attendance"
          />
          <StatsCard
            title="Completion Rate"
            value={`${analyticsData.overview.completionRate}%`}
            icon={BarChart3}
            description="assessments completed"
            data-testid="stats-completion"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Subject Performance Analysis
              </CardTitle>
              <CardDescription>
                Performance breakdown by subject with trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground">
                    Subject performance chart
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integration with Chart.js or similar library needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Grade Distribution
              </CardTitle>
              <CardDescription>
                Distribution of student performance levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performanceDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          index === 0
                            ? "bg-green-500"
                            : index === 1
                            ? "bg-blue-500"
                            : index === 2
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-foreground">
                        {item.grade}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {item.count}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject Performance Breakdown</CardTitle>
            <CardDescription>
              Detailed analysis of performance by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Subject
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Students
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Average
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Highest
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Lowest
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Pass Rate
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analyticsData.subjectPerformance.map((subject, index) => (
                    <tr
                      key={index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              index % 4 === 0
                                ? "bg-blue-100 text-blue-600"
                                : index % 4 === 1
                                ? "bg-green-100 text-green-600"
                                : index % 4 === 2
                                ? "bg-purple-100 text-purple-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {subject.subject === "Mathematics"
                              ? "📊"
                              : subject.subject === "English"
                              ? "📚"
                              : subject.subject === "Science"
                              ? "🧪"
                              : "🌍"}
                          </div>
                          <span className="font-medium text-foreground">
                            {subject.subject}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">
                        {subject.students}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">
                          {subject.average}%
                        </div>
                      </td>
                      <td className="p-4 text-green-600 font-medium">
                        {subject.highest}%
                      </td>
                      <td className="p-4 text-red-600 font-medium">
                        {subject.lowest}%
                      </td>
                      <td className="p-4 text-foreground">
                        {subject.passRate}%
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center text-sm font-medium ${
                            subject.trend > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {subject.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(subject.trend)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Comparison</CardTitle>
            <CardDescription>
              Average performance and pass rates by class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.classPerformance.map((classData, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">
                      {classData.class}
                    </h4>
                    <Badge variant="outline">
                      {classData.students} students
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average:</span>
                      <span className="font-medium text-foreground">
                        {classData.average}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate:</span>
                      <span className="font-medium text-foreground">
                        {classData.passRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
