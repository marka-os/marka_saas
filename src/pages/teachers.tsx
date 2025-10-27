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
import { TeachersTable } from "@marka/components/tables/teachers-table";
import { TeacherForm } from "@marka/components/forms/teacher-form";
import { BulkImportDialog } from "@marka/components/dialogs/bulk-import-dialog";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@marka/components/ui/alert";
import { useToast } from "@marka/hooks/use-toast";
import { useTeacherStore } from "@marka/stores/teacher-store";
import { useSchoolStore } from "@marka/stores/school-store";
import { Teacher, UpdateTeacher } from "@marka/types/api";
import { AlertCircle } from "lucide-react";

export default function Teachers() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");

  const { toast } = useToast();

  // Get school from school store
  const { school } = useSchoolStore();

  // Get teachers store
  const {
    teachers,
    isLoading,
    error,
    fetchTeachers,
    createTeacherAction,
    updateTeacherAction,
    deleteTeacherAction,
    downloadTemplate,
    importTeachersAction,
    exportTeachersAction,
    clearError,
  } = useTeacherStore();

  // Fetch teachers when school is available
  useEffect(() => {
    if (school?.id) {
      fetchTeachers();
    }
  }, [school?.id, fetchTeachers]);

  const handleCreateTeacher = async (data: any) => {
    if (!school?.id) {
      toast({
        variant: "destructive",
        title: "No school found",
        description: "Please create a school first before adding teachers.",
      });
      return;
    }

    try {
      // Process salary data
      const processedData = {
        ...data,
        baseSalary: data.baseSalary ? Number(data.baseSalary) : undefined,
        yearsOfExperience: data.yearsOfExperience
          ? Number(data.yearsOfExperience)
          : undefined,
        salaryStructure: {
          basic: data.basicSalary ? Number(data.basicSalary) : undefined,
          allowances: data.allowances ? Number(data.allowances) : undefined,
          deductions: data.deductions ? Number(data.deductions) : undefined,
        },
      };

      // Remove form-specific fields
      delete processedData.basicSalary;
      delete processedData.allowances;
      delete processedData.deductions;

      await createTeacherAction(processedData);
      setIsCreateDialogOpen(false);
      toast({
        title: "Teacher created",
        description: "The teacher has been successfully added to the system.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating teacher",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleUpdateTeacher = async (data: any) => {
    if (!editingTeacher) return;

    try {
      // Process salary data
      const processedData: UpdateTeacher = {
        ...data,
        baseSalary: data.baseSalary ? Number(data.baseSalary) : undefined,
        yearsOfExperience: data.yearsOfExperience
          ? Number(data.yearsOfExperience)
          : undefined,
        salaryStructure: {
          basic: data.salaryStructure?.basic ? Number(data.salaryStructure?.basic) : undefined,
          allowances: data.salaryStructure?.allowances ? Number(data.salaryStructure?.allowances) : undefined,
          deductions: data.salaryStructure?.deductions ? Number(data.salaryStructure?.deductions) : undefined, 
        },
      };

      // Remove form-specific fields
      delete processedData.baseSalary;
      delete processedData.salaryStructure?.allowances;
      delete processedData.salaryStructure?.deductions;

      await updateTeacherAction(editingTeacher.id, processedData);
      setEditingTeacher(null);
      toast({
        title: "Teacher updated",
        description: "The teacher information has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating teacher",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      await deleteTeacherAction(id);
      setDeletingTeacherId(null);
      toast({
        title: "Teacher deleted",
        description:
          "The teacher has been successfully removed from the system.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting teacher",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleBulkImport = async (file: File) => {
    try {
      const result = await importTeachersAction(file);

      if (result.successful > 0) {
        toast({
          title: "Import completed",
          description: `Successfully imported ${result.successful} of ${result.total} teachers.`,
        });
      }

      if (result.failed > 0) {
        toast({
          variant: "destructive",
          title: "Some imports failed",
          description: `${result.failed} teachers could not be imported. Check the error details.`,
        });
      }

      return result;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error.message || "Failed to import teachers.",
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
      await exportTeachersAction(format, school?.id);
      toast({
        title: "Export successful",
        description: `Teachers exported to ${format.toUpperCase()}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error.message || "Failed to export teachers.",
      });
    }
  };

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter((teacher: Teacher) => {
    const matchesSearch =
      !searchQuery ||
      `${teacher.firstName} ${teacher.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || teacher.employmentStatus === statusFilter;

    const matchesContract =
      contractFilter === "all" || teacher.contractType === contractFilter;

    const matchesQualification =
      qualificationFilter === "all" ||
      teacher.highestQualification === qualificationFilter;

    return (
      matchesSearch && matchesStatus && matchesContract && matchesQualification
    );
  });

  // Show loading state on initial load
  if (isLoading && teachers.length === 0) {
    return (
      <DashboardLayout title="Teachers">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if no school exists
  if (!school) {
    return (
      <DashboardLayout title="Teachers">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No School Found</AlertTitle>
            <AlertDescription>
              Please create a school first before managing teachers.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teachers">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Teacher Management
            </h1>
            <p className="text-muted-foreground">
              Manage teaching staff, qualifications, and employment information
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

            {/* Add Teacher Button */}
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button data-testid="add-teacher-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                </DialogHeader>
                <TeacherForm
                  onSubmit={handleCreateTeacher}
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
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-teachers"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="filter-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger data-testid="filter-contract">
                <SelectValue placeholder="All Contracts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contracts</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={qualificationFilter}
              onValueChange={setQualificationFilter}
            >
              <SelectTrigger data-testid="filter-qualification">
                <SelectValue placeholder="All Qualifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Qualifications</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="degree">Degree</SelectItem>
                <SelectItem value="masters">Masters</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Teachers Table or Empty State */}
        {filteredTeachers.length > 0 ? (
          <TeachersTable
            teachers={filteredTeachers}
            onEdit={setEditingTeacher}
            onDelete={(id) => setDeletingTeacherId(id)}
            isLoading={isLoading}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No teachers found"
            description={
              searchQuery ||
              statusFilter !== "all" ||
              contractFilter !== "all" ||
              qualificationFilter !== "all"
                ? "No teachers match your current filters. Try adjusting your search criteria."
                : "No teachers have been added yet. Start by adding your first teacher."
            }
            action={
              !searchQuery &&
              statusFilter === "all" &&
              contractFilter === "all" &&
              qualificationFilter === "all"
                ? {
                    label: "Add First Teacher",
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

        {/* Edit Teacher Dialog */}
        <Dialog
          open={!!editingTeacher}
          onOpenChange={(open) => !open && setEditingTeacher(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
            </DialogHeader>
            {editingTeacher && (
              <TeacherForm
                teacher={editingTeacher}
                onSubmit={handleUpdateTeacher}
                onCancel={() => setEditingTeacher(null)}
                isSubmitting={isLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletingTeacherId}
          onOpenChange={(open) => !open && setDeletingTeacherId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                teacher and all associated data including attendance records and
                assignments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deletingTeacherId && handleDeleteTeacher(deletingTeacherId)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading ? "Deleting..." : "Delete Teacher"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
