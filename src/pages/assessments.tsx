import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  ClipboardCheck,
  Calendar,
  TrendingUp,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@marka/components/layout/dashboard-layout";
import { Button } from "@marka/components/ui/button";
import { Input } from "@marka/components/ui/input";
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
import { AssessmentForm } from "@marka/components/forms/assessment-form";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";
import {
  getAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from "@marka/lib/api";
import {
  Assessment,
  InsertAssessment,
  UpdateAssessment,
} from "@marka/types/api";

export default function Assessments() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [examLevelFilter, setExamLevelFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");
  const [selectedStudentId] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock student ID for demonstration - in real app this would come from context or selection
  const defaultStudentId = "demo-student-id";

  const {
    data: assessmentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "/api/v1/assessments",
      selectedStudentId || defaultStudentId,
      examLevelFilter,
    ],
    queryFn: () =>
      getAssessments(
        selectedStudentId || defaultStudentId,
        examLevelFilter !== "all" ? examLevelFilter : undefined
      ),
    enabled: !!selectedStudentId || !!defaultStudentId,
  });

  const createMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/assessments"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Assessment created",
        description:
          "The assessment has been successfully added to the system.",
      });
    },
    onError: (error: unknown) => {
      let message = "Something went wrong. Please try again.";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message?: string }).message || message;
      }
      toast({
        variant: "destructive",
        title: "Error creating assessment",
        description: message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateAssessment }) =>
      updateAssessment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/assessments"] });
      setEditingAssessment(null);
      toast({
        title: "Assessment updated",
        description: "The assessment has been successfully updated.",
      });
    },
    onError: (error: unknown) => {
      let message = "Something went wrong. Please try again.";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message?: string }).message || message;
      }
      toast({
        variant: "destructive",
        title: "Error creating assessment",
        description: message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/assessments"] });
      toast({
        title: "Assessment deleted",
        description:
          "The assessment has been successfully removed from the system.",
      });
    },
    onError: (error: unknown) => {
      let message = "Something went wrong. Please try again.";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message?: string }).message || message;
      }
      toast({
        variant: "destructive",
        title: "Error creating assessment",
        description: message,
      });
    },
  });

  const handleCreateAssessment = (data: {
    AssessmentName: string;
    type: "exam" | "test" | "quiz" | "assignment" | "project" | "practical";
    caScore: number;
    subjectId: string;
    studentId: string;
    examLevel: "ple" | "uce" | "uace";
    examScore?: number;
    remark?: string;
    metadata?: Record<string, unknown>;
  }) => {
    const mappedData: InsertAssessment = {
      AssessmentName: data.AssessmentName,
      type: data.type,
      caScore: data.caScore,
      subjectId: data.subjectId,
      studentId: data.studentId,
      examLevel: data.examLevel,
      examScore: typeof data.examScore === "number" ? data.examScore : 0,
      remark: data.remark ?? "",
      metadata: data.metadata ?? {},
    };
    createMutation.mutate(mappedData);
  };

  const handleUpdateAssessment = (data: UpdateAssessment) => {
    if (editingAssessment) {
      updateMutation.mutate({
        id: editingAssessment.id,
        updates: {
          ...data,
          id: editingAssessment.id,
          remark: data.remark || "", // Map remarks to remark
        },
      });
    }
  };

  const handleDeleteAssessment = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this assessment? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Filter assessments based on search and filters
  const filteredAssessments = assessmentsData?.assessments?.filter(
    (assessment: Assessment) => {
      //const matchesSearch =
      // !searchQuery ||
      // assessment.assessmentType
      //  ?.toLowerCase()
      //  .includes(searchQuery.toLowerCase()) ||
      // assessment.term?.toLowerCase().includes(searchQuery.toLowerCase());
      console.log("Assessment Data:", assessment);
      //const matchesTerm =
      // termFilter === "all" || assessment.term === termFilter;

      // return matchesSearch && matchesTerm;
      // }) || [];

      // Calculate stats
      const totalAssessments = filteredAssessments.length;
      const completedAssessments = filteredAssessments.filter(
        (a: Assessment) => a.examScore !== null
      ).length;
      const averageScore =
        filteredAssessments.length > 0
          ? filteredAssessments.reduce(
              (sum: number, a: Assessment) => sum + (a.examScore || 0),
              0
            ) / completedAssessments || 0
          : 0;

      // Assessment types for quick creation
      const assessmentTypes = [
        {
          title: "Continuous Assessment",
          description: "Regular class work and homework",
          icon: ClipboardCheck,
          color: "bg-blue-500",
          type: "continuous",
        },
        {
          title: "Mid-Term Examination",
          description: "Mid-term comprehensive exam",
          icon: Calendar,
          color: "bg-green-500",
          type: "midterm",
        },
        {
          title: "End of Term Exam",
          description: "Final term examination",
          icon: TrendingUp,
          color: "bg-purple-500",
          type: "final",
        },
      ];

      if (isLoading) {
        return (
          <DashboardLayout title="Assessments">
            <div className="flex items-center justify-center h-96">
              <LoadingSpinner size="lg" />
            </div>
          </DashboardLayout>
        );
      }

      if (error) {
        return (
          <DashboardLayout title="Assessments">
            <div className="p-6">
              <EmptyState
                icon={Search}
                title="Error loading assessments"
                description="There was an error loading the assessment data. Please try again."
                action={{
                  label: "Retry",
                  onClick: () =>
                    queryClient.invalidateQueries({
                      queryKey: ["/api/v1/assessments"],
                    }),
                }}
              />
            </div>
          </DashboardLayout>
        );
      }

      return (
        <DashboardLayout title="Assessments">
          <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Assessments & Examinations
                </h1>
                <p className="text-muted-foreground">
                  Create and manage assessments, tests, and examinations
                </p>
              </div>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="mt-4 sm:mt-0"
                    data-testid="add-assessment-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Assessment</DialogTitle>
                  </DialogHeader>
                  <AssessmentForm
                    onSubmit={handleCreateAssessment}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isSubmitting={createMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Total Assessments"
                value={totalAssessments}
                icon={ClipboardCheck}
                data-testid="stats-total-assessments"
              />
              <StatsCard
                title="Completed"
                value={completedAssessments}
                icon={Users}
                description={`${
                  totalAssessments - completedAssessments
                } pending`}
                data-testid="stats-completed-assessments"
              />
              <StatsCard
                title="Average Score"
                value={`${averageScore.toFixed(1)}%`}
                icon={TrendingUp}
                trend={{ value: "2.3%", isPositive: true }}
                data-testid="stats-average-score"
              />
            </div>

            {/* Assessment Types */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Assessment Creation
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {assessmentTypes.map((type, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setIsCreateDialogOpen(true)}
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
                        Create {type.title}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="search-assessments"
                  />
                </div>
                <Select
                  value={examLevelFilter}
                  onValueChange={setExamLevelFilter}
                >
                  <SelectTrigger data-testid="filter-exam-level">
                    <SelectValue placeholder="All Exam Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exam Levels</SelectItem>
                    <SelectItem value="ple">PLE</SelectItem>
                    <SelectItem value="uce">UCE</SelectItem>
                    <SelectItem value="uace">UACE</SelectItem>
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
                <div></div> {/* Empty div for grid alignment */}
              </div>
            </div>

            {/* Assessments List */}
            {filteredAssessments.length > 0 ? (
              <div className="space-y-4">
                {filteredAssessments.map((assessment: Assessment) => (
                  <Card
                    key={assessment.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {assessment.type || "Assessment"}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {/**<span>Term: {assessment.term || "Not specified"}</span>
                        <span>
                          Academic Year:{" "}
                          {assessment.academicYear || "Not specified"}
                        </span>*/}
                            <Badge variant="outline">
                              {assessment.examLevel?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAssessment(assessment)}
                            data-testid={`edit-assessment-${assessment.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteAssessment(assessment.id)
                            }
                            className="text-destructive hover:text-destructive"
                            data-testid={`delete-assessment-${assessment.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            Score
                          </div>
                          <div className="text-lg">
                            {assessment.examScore !== null
                              ? `${assessment.examScore}/${
                                  assessment.caScore || 100
                                }`
                              : "Not graded"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            Grade
                          </div>
                          <div className="text-lg">
                            {/**assessment.grade || "Not assigned"*/}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            Percentage
                          </div>
                          <div className="text-lg">
                            {assessment.examScore && assessment.caScore
                              ? `${(
                                  (assessment.examScore / assessment.caScore) *
                                  100
                                ).toFixed(1)}%`
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            Status
                          </div>
                          <Badge
                            variant={
                              assessment.examScore !== null
                                ? "default"
                                : "secondary"
                            }
                          >
                            {assessment.examScore !== null
                              ? "Completed"
                              : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      {assessment.remark && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-foreground">
                            Remarks
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {assessment.remark}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ClipboardCheck}
                title="No assessments found"
                description={
                  searchQuery ||
                  termFilter !== "all" ||
                  examLevelFilter !== "all"
                    ? "No assessments match your current filters. Try adjusting your search criteria."
                    : "No assessments have been created yet. Start by creating your first assessment."
                }
                action={
                  !searchQuery &&
                  termFilter === "all" &&
                  examLevelFilter === "all"
                    ? {
                        label: "Create First Assessment",
                        onClick: () => setIsCreateDialogOpen(true),
                      }
                    : undefined
                }
              />
            )}

            {/* Edit Assessment Dialog */}
            <Dialog
              open={!!editingAssessment}
              onOpenChange={(open) => !open && setEditingAssessment(null)}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Assessment</DialogTitle>
                </DialogHeader>
                {editingAssessment && (
                  <AssessmentForm
                    assessment={editingAssessment}
                    onSubmit={(data) =>
                      handleUpdateAssessment({
                        ...data,
                        id: editingAssessment.id,
                      })
                    }
                    onCancel={() => setEditingAssessment(null)}
                    isSubmitting={updateMutation.isPending}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </DashboardLayout>
      );
    }
  );
}
