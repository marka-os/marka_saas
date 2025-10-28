import { useEffect, useState } from "react";
import { Plus, Search, Users, Upload, Download } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@marka/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@marka/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@marka/components/ui/select";
import { StudentsTable } from "@marka/components/tables/students-table";
import { StudentForm } from "@marka/components/forms/student-form";
import { BulkImportDialog } from "@marka/components/dialogs/bulk-import-dialog";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@marka/components/ui/alert";
import { useToast } from "@marka/hooks/use-toast";
import { useStudentStore } from "@marka/stores/student-store";
import { useSchoolStore } from "@marka/stores/school-store";
import { Student } from "@marka/types/api";
import { AlertCircle } from "lucide-react";

export default function Students() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { toast } = useToast();

  // Get school from school store
  const { school } = useSchoolStore();

  // Get students store
  const {
    students,
    isLoading,
    error,
    fetchStudents,
    createStudentAction,
    updateStudentAction,
    deleteStudentAction,
    downloadTemplate,
    importStudentsAction,
    exportStudentsAction,
    clearError,
  } = useStudentStore();

  // Fetch students when school is available
  useEffect(() => {
    if (school?.id) {
      fetchStudents(school.id);
    }
  }, [school?.id, fetchStudents]);

  const handleCreateStudent = async (data: any) => {
    if (!school?.id) {
      toast({
        variant: "destructive",
        title: "No school found",
        description: "Please create a school first before adding students.",
      });
      return;
    }

    try {
      await createStudentAction({
        ...data,
        schoolId: school.id,
      });
      setIsCreateDialogOpen(false);
      toast({
        title: "Student created",
        description: "The student has been successfully added to the system.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating student",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleUpdateStudent = async (data: any) => {
    if (!editingStudent) return;

    try {
      await updateStudentAction(editingStudent.id, data);
      setEditingStudent(null);
      toast({
        title: "Student updated",
        description: "The student information has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating student",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudentAction(id);
      setDeletingStudentId(null);
      toast({
        title: "Student deleted",
        description:
          "The student has been successfully removed from the system.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting student",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleBulkImport = async (file: File) => {
    try {
      const result = await importStudentsAction(file);

      if (result.successful > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${result.successful} of ${result.total} students.`,
        });
      }

      if (result.failed > 0) {
        toast({
          variant: "destructive",
          title: "Some imports failed",
          description: `${result.failed} students could not be imported. Check the error details.`,
        });
      }

      return result;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error.message || "Failed to import students.",
      });
      throw error;
    }
  };

  const handleDownloadTemplate = async (format: "xlsx" | "csv") => {
    try {
      await downloadTemplate(format);
      toast({
        title: "Template downloaded",
        description: `The ${format.toUpperCase()} template has been downloaded.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message || "Failed to download template.",
      });
    }
  };

  const handleExport = async (format: "xlsx" | "csv") => {
    try {
      await exportStudentsAction(format, school?.id);
      toast({
        title: "Export successful",
        description: `Students exported to ${format.toUpperCase()}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error.message || "Failed to export students.",
      });
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter((student: Student) => {
    const matchesSearch =
      !searchQuery ||
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.lin?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter === "all" || student.class === classFilter;
    const matchesStream =
      streamFilter === "all" || student.stream === streamFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.status === "active") ||
      (statusFilter === "inactive" && student.status !== "active");

    return matchesSearch && matchesClass && matchesStream && matchesStatus;
  });

  // Show loading state on initial load
  if (isLoading && students.length === 0) {
    return (
      <DashboardLayout title="Students">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if no school exists
  if (!school) {
    return (
      <DashboardLayout title="Students">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No School Found</AlertTitle>
            <AlertDescription>
              Please create a school first before managing students.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Students">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Student Management
            </h1>
            <p className="text-muted-foreground">
              Manage student records, enrollment, and academic information
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                  Export as Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Import Button */}
            <Button variant="outline" onClick={() => setIsBulkImportOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>

            {/* Add Student Button */}
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button data-testid="add-student-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <StudentForm
                  onSubmit={handleCreateStudent}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isSubmitting={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
                className="ml-4"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-students"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger data-testid="filter-class">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="P1">Primary 1</SelectItem>
                <SelectItem value="P2">Primary 2</SelectItem>
                <SelectItem value="P3">Primary 3</SelectItem>
                <SelectItem value="P4">Primary 4</SelectItem>
                <SelectItem value="P5">Primary 5</SelectItem>
                <SelectItem value="P6">Primary 6</SelectItem>
                <SelectItem value="P7">Primary 7</SelectItem>
              </SelectContent>
            </Select>
            <Select value={streamFilter} onValueChange={setStreamFilter}>
              <SelectTrigger data-testid="filter-stream">
                <SelectValue placeholder="All Streams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                <SelectItem value="A">Stream A</SelectItem>
                <SelectItem value="B">Stream B</SelectItem>
                <SelectItem value="C">Stream C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Students Table or Empty State */}
        {filteredStudents.length > 0 ? (
          <StudentsTable
            students={filteredStudents}
            onEdit={setEditingStudent}
            onDelete={(id) => setDeletingStudentId(id)}
            isLoading={isLoading}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No students found"
            description={
              searchQuery ||
              classFilter !== "all" ||
              streamFilter !== "all" ||
              statusFilter !== "all"
                ? "No students match your current filters. Try adjusting your search criteria."
                : "No students have been added yet. Start by adding your first student."
            }
            action={
              !searchQuery &&
              classFilter === "all" &&
              streamFilter === "all" &&
              statusFilter === "all"
                ? {
                    label: "Add First Student",
                    onClick: () => setIsCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        )}

        {/* Bulk Import Dialog */}
        <BulkImportDialog
          open={isBulkImportOpen}
          onOpenChange={setIsBulkImportOpen}
          onImport={handleBulkImport}
          onDownloadTemplate={handleDownloadTemplate}
          isLoading={isLoading}
        />

        {/* Edit Student Dialog */}
        <Dialog
          open={!!editingStudent}
          onOpenChange={(open) => !open && setEditingStudent(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <StudentForm
                student={editingStudent}
                onSubmit={handleUpdateStudent}
                onCancel={() => setEditingStudent(null)}
                isSubmitting={isLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletingStudentId}
          onOpenChange={(open) => !open && setDeletingStudentId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Student?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                student and all associated data including assessments and
                reports.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deletingStudentId && handleDeleteStudent(deletingStudentId)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading ? "Deleting..." : "Delete Student"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
