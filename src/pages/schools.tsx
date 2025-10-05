import { useEffect, useState } from "react";
import {
  Plus,
  School as SchoolIcon,
  Users,
  FileText,
  RefreshCw,
  AlertCircle,
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
import { SchoolForm } from "@marka/components/forms/school-form";
import { StatsCard } from "@marka/components/ui/stats-card";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";
import {
  useSchool,
  useSchoolLoading,
  useSchoolError,
  useCanCreateSchool,
} from "@marka/stores/school-store";
import {
  useSchoolActions,
  useSchoolMetadata,
} from "@marka/hooks/use-school-action";
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
import { Separator } from "@marka/components/ui/separator";
import type { InsertSchool } from "@marka/types/api";

export default function Schools() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { toast } = useToast();

  // Store selectors
  const school = useSchool();
  const isLoading = useSchoolLoading();
  const error = useSchoolError();
  const canCreateSchool = useCanCreateSchool();

  // Store actions using custom hooks
  const {
    createSchool,
    updateSchool,
    deleteSchool,
    refreshSchool,
    initializeSchool,
  } = useSchoolActions();

  // Metadata
  const { isInitialized, syncStatus } = useSchoolMetadata();

  // Initialize store on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeSchool({
        onError: (err) => {
          console.error("Failed to initialize school:", err);
        },
      });
    }
  }, [isInitialized, initializeSchool]);

  // Handlers with callbacks
  const handleCreateSchool = async (data: InsertSchool) => {
    await createSchool(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        toast({
          title: "School created successfully",
          description: "Your school has been added to the system.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to create school",
          description:
            error.message || "Something went wrong. Please try again.",
        });
      },
    });
  };

  const handleUpdateSchool = async (data: InsertSchool) => {
    await updateSchool(data, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        toast({
          title: "School updated successfully",
          description: "Your school information has been updated.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to update school",
          description:
            error.message || "Something went wrong. Please try again.",
        });
      },
    });
  };

  const handleDeleteSchool = async () => {
    await deleteSchool({
      onSuccess: () => {
        setShowDeleteConfirm(false);
        toast({
          title: "School deleted successfully",
          description: "Your school has been removed from the system.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to delete school",
          description:
            error.message || "Something went wrong. Please try again.",
        });
      },
    });
  };

  const handleRefresh = async () => {
    await refreshSchool({
      onSuccess: () => {
        toast({
          title: "Data refreshed",
          description: "School information has been updated.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to refresh",
          description: error.message || "Could not refresh data.",
        });
      },
    });
  };

  // Calculate mock stats (in production, these would come from the backend)
  const stats = {
    totalStudents: school ? 450 : 0,
    totalTeachers: school ? 32 : 0,
    totalReports: school ? 1350 : 0,
    activeClasses: school ? 18 : 0,
  };

  // Loading state
  if (!isInitialized || (isLoading && !school)) {
    return (
      <DashboardLayout title="School Management">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading school data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error && !school) {
    return (
      <DashboardLayout title="School Management">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading School Data</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
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
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              School Management
              {syncStatus === "pending" && (
                <Badge variant="outline" className="animate-pulse">
                  Syncing...
                </Badge>
              )}
              {syncStatus === "error" && (
                <Badge variant="destructive">Sync Error</Badge>
              )}
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
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
            {canCreateSchool && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="add-school-button">
                    <Plus className="w-4 h-4" />
                    Create School
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create Your School</DialogTitle>
                    <DialogDescription>
                      Set up your school profile. You can only create one school
                      per account.
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

        {/* Sync Status Alert */}
        {error && school && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sync Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
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
                data-testid="stats-total-students"
              />
              <StatsCard
                title="Teaching Staff"
                value={stats.totalTeachers}
                icon={Users}
                description="active teachers"
                data-testid="stats-total-teachers"
              />
              <StatsCard
                title="Active Classes"
                value={stats.activeClasses}
                icon={SchoolIcon}
                description="running this term"
                data-testid="stats-active-classes"
              />
              <StatsCard
                title="Reports Generated"
                value={stats.totalReports.toLocaleString()}
                icon={FileText}
                description="this academic year"
                data-testid="stats-total-reports"
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
                        {school.isActive && (
                          <>
                            <span className="text-xs">•</span>
                            <Badge variant="default">Active</Badge>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(true)}
                      data-testid="edit-school-button"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      data-testid="delete-school-button"
                    >
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

                <Separator className="my-6" />

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {school.createdAt && (
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(school.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {school.updatedAt && (
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(school.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
              description="You haven't set up your school yet. Create your school profile to get started with the system. You can only create one school per account."
              action={{
                label: "Create School",
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          </div>
        )}

        {/* Edit School Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit School</DialogTitle>
              <DialogDescription>
                Update your school's information
              </DialogDescription>
            </DialogHeader>
            {school && (
              <SchoolForm
                school={school}
                onSubmit={handleUpdateSchool}
                onCancel={() => setIsEditDialogOpen(false)}
                isSubmitting={isLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete School?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                school and all associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  All students, assessments, and reports associated with this
                  school will also be removed.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSchool}
                  disabled={isLoading}
                  data-testid="confirm-delete-button"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete School"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
