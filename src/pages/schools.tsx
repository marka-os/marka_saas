import { useEffect, useState } from "react";
import {
  Plus,
  School as SchoolIcon,
  Users,
  FileText,
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@marka/components/layout/dashboard-layout";
import { Button } from "@marka/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { SchoolForm } from "@marka/components/forms/school-form";
import { StatsCard } from "@marka/components/ui/stats-card";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";
import { useSchoolStore } from "@marka/stores/school-store";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@marka/components/ui/alert";
import { Badge } from "@marka/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@marka/components/ui/card";
//import { Separator } from "@marka/components/ui/separator";
import type { InsertSchool } from "@marka/types/api";

export default function Schools() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { toast } = useToast();

  const {
    school,
    isLoading,
    error,
    fetchSchool,
    createSchoolAction,
    updateSchoolAction,
    deleteSchoolAction,
    clearError,
  } = useSchoolStore();

  // Fetch school on mount
  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  const handleCreateSchool = async (data: InsertSchool) => {
    try {
      await createSchoolAction(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "School created",
        description: "Your school has been successfully created.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating school",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleUpdateSchool = async (data: InsertSchool) => {
    try {
      await updateSchoolAction(data);
      setIsEditDialogOpen(false);
      toast({
        title: "School updated",
        description: "Your school has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating school",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleDeleteSchool = async () => {
    try {
      await deleteSchoolAction();
      setShowDeleteDialog(false);
      toast({
        title: "School deleted",
        description: "Your school has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting school",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchSchool();
      toast({
        title: "Refreshed",
        description: "School data has been refreshed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error refreshing",
        description: error.message || "Failed to refresh data.",
      });
    }
  };

  // Mock stats (in production, these would come from backend)
  const stats = {
    totalStudents: school ? 450 : 0,
    totalTeachers: school ? 32 : 0,
    totalReports: school ? 1350 : 0,
    activeClasses: school ? 18 : 0,
  };

  if (isLoading && !school) {
    return (
      <DashboardLayout title="School Management">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="School Management">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              School Management
            </h1>
            <p className="text-muted-foreground">
              {school
                ? "Manage your school institution and configuration"
                : "Set up your school to get started"}
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {school && (
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
            {!school && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button data-testid="add-school-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Create School
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create Your School</DialogTitle>
                    <DialogDescription>
                      Set up your school profile. Only one school per account is
                      allowed.
                    </DialogDescription>
                  </DialogHeader>
                  <SchoolForm
                    onSubmit={handleCreateSchool}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isSubmitting={isLoading}
                  />
                </DialogContent>
              </Dialog>
            )}
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

        {school ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Students"
                value={stats.totalStudents.toLocaleString()}
                icon={Users}
                description="enrolled students"
              />
              <StatsCard
                title="Teaching Staff"
                value={stats.totalTeachers}
                icon={Users}
                description="active teachers"
              />
              <StatsCard
                title="Active Classes"
                value={stats.activeClasses}
                icon={SchoolIcon}
                description="running this term"
              />
              <StatsCard
                title="Reports Generated"
                value={stats.totalReports.toLocaleString()}
                icon={FileText}
                description="this academic year"
              />
            </div>

            {/* School Details Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {school.logoUrl && (
                      <img
                        src={school.logoUrl}
                        alt={`${school.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    )}
                    <div>
                      <CardTitle className="text-2xl">{school.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {school.code && (
                          <>
                            <Badge variant="secondary">{school.code}</Badge>
                            <span className="text-xs">•</span>
                          </>
                        )}
                        {school.level && (
                          <Badge variant="outline">
                            {school.level.replace("_", "-").toUpperCase()}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location Information */}
                  {(school.address ||
                    school.city ||
                    school.district ||
                    school.region) && (
                    <div>
                      <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                        Location
                      </h3>
                      <div className="space-y-2 text-sm">
                        {school.address && (
                          <p className="text-foreground">{school.address}</p>
                        )}
                        {(school.city || school.district) && (
                          <p className="text-muted-foreground">
                            {[school.city, school.district]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                        {school.region && (
                          <p className="text-muted-foreground">
                            {school.region}
                          </p>
                        )}
                        {school.postalCode && (
                          <p className="text-muted-foreground">
                            {school.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {(school.phone || school.email || school.website) && (
                    <div>
                      <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                        Contact
                      </h3>
                      <div className="space-y-2 text-sm">
                        {school.phone && (
                          <div>
                            <span className="text-muted-foreground">
                              Phone:{" "}
                            </span>
                            <a
                              href={`tel:${school.phone}`}
                              className="text-foreground hover:text-primary"
                            >
                              {school.phone}
                            </a>
                          </div>
                        )}
                        {school.email && (
                          <div>
                            <span className="text-muted-foreground">
                              Email:{" "}
                            </span>
                            <a
                              href={`mailto:${school.email}`}
                              className="text-foreground hover:text-primary"
                            >
                              {school.email}
                            </a>
                          </div>
                        )}
                        {school.website && (
                          <div>
                            <span className="text-muted-foreground">
                              Website:{" "}
                            </span>
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-primary"
                            >
                              {school.website.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty State - No School Created */
          <div className="flex items-center justify-center min-h-[500px]">
            <EmptyState
              icon={SchoolIcon}
              title="No School Created"
              description="You haven't set up your school yet. Create your school profile to get started with the system. Only one school per account is allowed."
              action={{
                label: "Create School",
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          </div>
        )}

        {/* Edit School Dialog */}
        {school && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit School</DialogTitle>
                <DialogDescription>
                  Update your school's information
                </DialogDescription>
              </DialogHeader>
              <SchoolForm
                school={school}
                onSubmit={handleUpdateSchool}
                onCancel={() => setIsEditDialogOpen(false)}
                isSubmitting={isLoading}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete School?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                school and all associated data including students, assessments,
                and reports.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSchool}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading ? "Deleting..." : "Delete School"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
