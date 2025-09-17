import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  School as SchoolIcon,
  Users,
  FileText,
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
import { SchoolsTable } from "@marka/components/tables/schools-table";
import { SchoolForm } from "@marka/components/forms/school-form";
import { StatsCard } from "@marka/components/ui/stats-card";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";
import {
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} from "@marka/lib/api";
import { School } from "@marka/types/api";

export default function Schools() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();
  

  const {
    data: schoolsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/v1/schools"],
    queryFn: getSchools,
  });

  const createMutation = useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/schools"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "School created",
        description: "The school has been successfully added to the system.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error creating school",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateSchool(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/schools"] });
      setEditingSchool(null);
      toast({
        title: "School updated",
        description: "The school information has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating school",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/schools"] });
      toast({
        title: "School deleted",
        description:
          "The school has been successfully removed from the system.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error deleting school",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleCreateSchool = (data: any) => {
    createMutation.mutate({
      ...data,
      tenantId: "default-tenant-id", // In real app, this would come from user context
    });
  };

  const handleUpdateSchool = (data: any) => {
    if (editingSchool) {
      updateMutation.mutate({
        id: editingSchool.id,
        updates: data,
      });
    }
  };

  const handleDeleteSchool = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this school? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Filter schools based on search
  const filteredSchools =
    schoolsData?.schools?.filter((school: School) => {
      const matchesSearch =
        !searchQuery ||
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.district?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    }) || [];

  // Calculate stats (mock data since we don't have student/teacher counts in school data)
  const totalSchools = schoolsData?.schools?.length || 0;
  const activeSchools =
    schoolsData?.schools?.filter((school: School) => school.isActive).length ||
    0;
  const totalStudents = totalSchools * 300; // Mock calculation
  const totalReports = totalStudents * 3; // Mock calculation

  if (isLoading) {
    return (
      <DashboardLayout title="Schools">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Schools">
        <div className="p-6">
          <EmptyState
            icon={Search}
            title="Error loading schools"
            description="There was an error loading the school data. Please try again."
            action={{
              label: "Retry",
              onClick: () =>
                queryClient.invalidateQueries({
                  queryKey: ["/api/v1/schools"],
                }),
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Schools">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Schools Management
            </h1>
            <p className="text-muted-foreground">
              Manage school institutions and their configurations
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0" data-testid="add-school-button">
                <Plus className="w-4 h-4 mr-2" />
                Add School
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
              </DialogHeader>
              <SchoolForm
                onSubmit={handleCreateSchool}
                onCancel={() => setIsCreateDialogOpen(false)}
                isSubmitting={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Schools"
            value={totalSchools}
            icon={SchoolIcon}
            data-testid="stats-total-schools"
          />
          <StatsCard
            title="Active Schools"
            value={activeSchools}
            icon={SchoolIcon}
            description="currently operational"
            data-testid="stats-active-schools"
          />
          <StatsCard
            title="Total Students"
            value={totalStudents.toLocaleString()}
            icon={Users}
            description="across all schools"
            data-testid="stats-total-students"
          />
          <StatsCard
            title="Reports Generated"
            value={totalReports.toLocaleString()}
            icon={FileText}
            description="this academic year"
            data-testid="stats-total-reports"
          />
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-schools"
            />
          </div>
        </div>

        {/* Schools Table */}
        {filteredSchools.length > 0 ? (
          <SchoolsTable
            schools={filteredSchools}
            onEdit={setEditingSchool}
            onDelete={handleDeleteSchool}
            isLoading={deleteMutation.isPending}
          />
        ) : (
          <EmptyState
            icon={SchoolIcon}
            title="No schools found"
            description={
              searchQuery
                ? "No schools match your search criteria. Try adjusting your search."
                : "No schools have been added yet. Start by adding your first school."
            }
            action={
              !searchQuery
                ? {
                    label: "Add First School",
                    onClick: () => setIsCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        )}

        {/* Edit School Dialog */}
        <Dialog
          open={!!editingSchool}
          onOpenChange={(open) => !open && setEditingSchool(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit School</DialogTitle>
            </DialogHeader>
            {editingSchool && (
              <SchoolForm
                school={editingSchool}
                onSubmit={handleUpdateSchool}
                onCancel={() => setEditingSchool(null)}
                isSubmitting={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
