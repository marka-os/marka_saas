import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
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
import { StudentsTable } from "@marka/components/tables/students-table";
import { StudentForm } from "@marka/components/forms/student-form";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";
import { getStudents, createStudent, deleteStudent, updateStudent } from "@marka/lib/api";
import { Student } from "@marka/types/api";

export default function Students() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For now, using a default schoolId - in real app this would come from user context
  const schoolId = "default-school-id";

  const {
    data: studentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/v1/students", schoolId],
    queryFn: () => getStudents(schoolId),
    enabled: !!schoolId,
  });

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/students"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Student created",
        description: "The student has been successfully added to the system.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error creating student",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateStudent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/students"] });
      setEditingStudent(null);
      toast({
        title: "Student updated",
        description: "The student information has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating student",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/students"] });
      toast({
        title: "Student deleted",
        description:
          "The student has been successfully removed from the system.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error deleting student",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleCreateStudent = (data: any) => {
    createMutation.mutate({
      ...data,
      schoolId,
    });
  };

  const handleUpdateStudent = (data: any) => {
    if (editingStudent) {
      updateMutation.mutate({
        id: editingStudent.id,
        updates: data,
      });
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Filter students based on search and filters
  const filteredStudents =
    studentsData?.students?.filter((student: Student) => {
      const matchesSearch =
        !searchQuery ||
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.lin?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass =
        classFilter === "all" || student.class === classFilter;
      const matchesStream =
        streamFilter === "all" || student.stream === streamFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && student.status === "active") ||
        (statusFilter === "inactive" && !student.status);

      return matchesSearch && matchesClass && matchesStream && matchesStatus;
    }) || [];

  if (isLoading) {
    return (
      <DashboardLayout title="Students">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Students">
        <div className="p-6">
          <EmptyState
            icon={Search}
            title="Error loading students"
            description="There was an error loading the student data. Please try again."
            action={{
              label: "Retry",
              onClick: () =>
                queryClient.invalidateQueries({
                  queryKey: ["/api/v1/students"],
                }),
            }}
          />
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
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0" data-testid="add-student-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <StudentForm
                onSubmit={handleCreateStudent}
                onCancel={() => setIsCreateDialogOpen(false)}
                isSubmitting={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

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

        {/* Students Table */}
        {filteredStudents.length > 0 ? (
          <StudentsTable
            students={filteredStudents}
            onEdit={setEditingStudent}
            onDelete={handleDeleteStudent}
            isLoading={deleteMutation.isPending}
          />
        ) : (
          <EmptyState
            icon={Search}
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

        {/* Edit Student Dialog */}
        <Dialog
          open={!!editingStudent}
          onOpenChange={(open) => !open && setEditingStudent(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <StudentForm
                student={editingStudent}
                onSubmit={handleUpdateStudent}
                onCancel={() => setEditingStudent(null)}
                isSubmitting={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
