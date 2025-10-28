import { useState } from "react";
import { Plus, FileText, Download, Share, Eye, Calendar } from "lucide-react";
import { DashboardLayout } from "@marka/components/layout/dashboard-layout";
import { Button } from "@marka/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@marka/components/ui/dialog";
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
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";

interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  term: string;
  academicYear: string;
  generatedDate: string;
  status: "generated" | "processing" | "failed";
  subjects: number;
  averageScore: number;
}

export default function Reports() {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [classFilter, setClassFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { toast } = useToast();

  // Mock data for demonstration
  const reportsData = {
    reports: [
      {
        id: "1",
        studentId: "student-1",
        studentName: "Sarah Nakato",
        className: "P.7A",
        term: "Term 1",
        academicYear: "2025",
        generatedDate: "2025-03-15",
        status: "generated" as const,
        subjects: 8,
        averageScore: 78.5,
      },
      {
        id: "2",
        studentId: "student-2",
        studentName: "David Okello",
        className: "P.6B",
        term: "Term 1",
        academicYear: "2025",
        generatedDate: "2025-03-14",
        status: "generated" as const,
        subjects: 7,
        averageScore: 82.3,
      },
      {
        id: "3",
        studentId: "student-3",
        studentName: "Grace Achieng",
        className: "P.7A",
        term: "Term 1",
        academicYear: "2025",
        generatedDate: "2025-03-13",
        status: "processing" as const,
        subjects: 8,
        averageScore: 0,
      },
    ] as ReportCard[],
  };

  // Filter reports
  const filteredReports = reportsData.reports.filter((report) => {
    const matchesClass =
      classFilter === "all" || report.className.includes(classFilter);
    const matchesTerm = termFilter === "all" || report.term === termFilter;
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesClass && matchesTerm && matchesStatus;
  });

  // Calculate stats
  const totalReports = reportsData.reports.length;
  const generatedReports = reportsData.reports.filter(
    (r) => r.status === "generated"
  ).length;
  const processingReports = reportsData.reports.filter(
    (r) => r.status === "processing"
  ).length;
  const averageScore =
    reportsData.reports
      .filter((r) => r.status === "generated")
      .reduce((sum, r) => sum + r.averageScore, 0) / generatedReports || 0;

  const handleGenerateReport = (data: any) => {
    toast({
      title: "Report generation started",
      description:
        "Your report cards are being generated. This may take a few minutes.",
    });
    setIsGenerateDialogOpen(false);
    console.log(data);
  };

  const handleDownload = (reportId: string) => {
    toast({
      title: "Download started",
      description: "Your report card is being downloaded as PDF.",
    });
    console.log(reportId);
  };

  const handleShare = (reportId: string) => {
    toast({
      title: "Share link copied",
      description: "The shareable link has been copied to your clipboard.",
    });
    console.log(reportId);
  };

  const reportTypes = [
    {
      title: "Individual Reports",
      description: "Generate report card for a specific student",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Class Reports",
      description: "Generate reports for entire class",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Bulk Reports",
      description: "Generate reports for multiple classes",
      icon: FileText,
      color: "bg-purple-500",
    },
  ];

  return (
    <DashboardLayout title="Report Cards">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Report Card Generation
            </h1>
            <p className="text-muted-foreground">
              Generate UNEB-compliant report cards for students
            </p>
          </div>
          <Dialog
            open={isGenerateDialogOpen}
            onOpenChange={setIsGenerateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="mt-4 sm:mt-0"
                data-testid="generate-reports-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Report Cards</DialogTitle>
              </DialogHeader>
              <GenerateReportForm
                onSubmit={handleGenerateReport}
                onCancel={() => setIsGenerateDialogOpen(false)}
                isSubmitting={false}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Reports"
            value={totalReports}
            icon={FileText}
            data-testid="stats-total-reports"
          />
          <StatsCard
            title="Generated"
            value={generatedReports}
            icon={FileText}
            description="completed reports"
            data-testid="stats-generated-reports"
          />
          <StatsCard
            title="Processing"
            value={processingReports}
            icon={FileText}
            description="in progress"
            data-testid="stats-processing-reports"
          />
          <StatsCard
            title="Average Score"
            value={`${averageScore.toFixed(1)}%`}
            icon={FileText}
            trend={{ value: "3.2%", isPositive: true }}
            data-testid="stats-average-score"
          />
        </div>

        {/* Report Types */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Report Generation Options
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reportTypes.map((type, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setIsGenerateDialogOpen(true)}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-3`}
                  >
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Generate {type.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger data-testid="filter-class">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="P.7">Primary 7</SelectItem>
                <SelectItem value="P.6">Primary 6</SelectItem>
                <SelectItem value="P.5">Primary 5</SelectItem>
              </SelectContent>
            </Select>
            <Select value={termFilter} onValueChange={setTermFilter}>
              <SelectTrigger data-testid="filter-term">
                <SelectValue placeholder="All Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <div></div> {/* Empty div for grid alignment */}
          </div>
        </div>

        {/* Reports Table */}
        {filteredReports.length > 0 ? (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Recently generated report cards</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Student
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Class
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Term
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Generated
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-foreground">
                              {report.studentName}
                            </div>
                            {report.status === "generated" && (
                              <div className="text-sm text-muted-foreground">
                                Average: {report.averageScore.toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{report.className}</Badge>
                        </td>
                        <td className="p-4 text-foreground">
                          {report.term}, {report.academicYear}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              report.status === "generated"
                                ? "default"
                                : report.status === "processing"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {report.status === "generated"
                              ? "Generated"
                              : report.status === "processing"
                              ? "Processing"
                              : "Failed"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {report.status === "generated" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {}}
                                  data-testid={`view-report-${report.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(report.id)}
                                  data-testid={`download-report-${report.id}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShare(report.id)}
                                  data-testid={`share-report-${report.id}`}
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {report.status === "processing" && (
                              <div className="flex items-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                <span className="text-sm text-muted-foreground">
                                  Processing...
                                </span>
                              </div>
                            )}
                            {report.status === "failed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsGenerateDialogOpen(true)}
                                data-testid={`retry-report-${report.id}`}
                              >
                                Retry
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={FileText}
            title="No reports found"
            description={
              classFilter !== "all" ||
              termFilter !== "all" ||
              statusFilter !== "all"
                ? "No reports match your current filters. Try adjusting your search criteria."
                : "No report cards have been generated yet. Start by generating your first report."
            }
            action={
              classFilter === "all" &&
              termFilter === "all" &&
              statusFilter === "all"
                ? {
                    label: "Generate First Report",
                    onClick: () => setIsGenerateDialogOpen(true),
                  }
                : undefined
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}

interface GenerateReportFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function GenerateReportForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: GenerateReportFormProps) {
  const [formData, setFormData] = useState({
    reportType: "",
    academicTerm: "",
    classLevel: "",
    stream: "",
    students: "all",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Report Type *
        </label>
        <Select
          value={formData.reportType}
          onValueChange={(value) =>
            setFormData({ ...formData, reportType: value })
          }
        >
          <SelectTrigger data-testid="report-type">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mid-term">Mid-Term Report</SelectItem>
            <SelectItem value="end-term">End of Term Report</SelectItem>
            <SelectItem value="annual">Annual Report</SelectItem>
            <SelectItem value="progress">Progress Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Academic Term *
        </label>
        <Select
          value={formData.academicTerm}
          onValueChange={(value) =>
            setFormData({ ...formData, academicTerm: value })
          }
        >
          <SelectTrigger data-testid="academic-term">
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term1-2025">Term 1, 2025</SelectItem>
            <SelectItem value="term2-2025">Term 2, 2025</SelectItem>
            <SelectItem value="term3-2025">Term 3, 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Class Level *
        </label>
        <Select
          value={formData.classLevel}
          onValueChange={(value) =>
            setFormData({ ...formData, classLevel: value })
          }
        >
          <SelectTrigger data-testid="class-level">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="p7">Primary 7 (P.7)</SelectItem>
            <SelectItem value="p6">Primary 6 (P.6)</SelectItem>
            <SelectItem value="p5">Primary 5 (P.5)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Stream (Optional)
        </label>
        <Select
          value={formData.stream}
          onValueChange={(value) => setFormData({ ...formData, stream: value })}
        >
          <SelectTrigger data-testid="stream">
            <SelectValue placeholder="All Streams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Streams</SelectItem>
            <SelectItem value="a">Stream A</SelectItem>
            <SelectItem value="b">Stream B</SelectItem>
            <SelectItem value="c">Stream C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">
              UNEB Compliance Notice
            </p>
            <p className="text-muted-foreground">
              Reports will be generated according to Uganda National
              Examinations Board standards and will include all required
              academic assessments and grading criteria.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          data-testid="cancel-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.reportType ||
            !formData.academicTerm ||
            !formData.classLevel
          }
          data-testid="submit-button"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner w-4 h-4 mr-2"></div>
              Generating...
            </>
          ) : (
            "Generate Reports"
          )}
        </Button>
      </div>
    </form>
  );
}
