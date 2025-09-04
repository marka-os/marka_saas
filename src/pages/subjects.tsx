import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, BookOpen, Award } from "lucide-react";
import { DashboardLayout } from "@marka/components/layout/dashboard-layout";
import { Button } from "@marka/components/ui/button";
import { Input } from "@marka/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@marka/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@marka/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@marka/components/ui/card";
import { Badge } from "@marka/components/ui/badge";
import { LoadingSpinner } from "@marka/components/ui/loading-spinner";
import { EmptyState } from "@marka/components/ui/empty-state";
import { useToast } from "@marka/hooks/use-toast";
import { getSubjects,  deleteSubject } from "@marka/lib/api";
import { Subject } from "@marka/types/api";

export default function Subjects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [examLevelFilter, setExamLevelFilter] = useState<string>("ple");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subjectsData, isLoading, error } = useQuery({
    queryKey: ["/api/v1/subjects", examLevelFilter],
    queryFn: () => getSubjects(examLevelFilter),
    enabled: !!examLevelFilter,
  });

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/subjects"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Subject created",
        description: "The subject has been successfully added to the system.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error creating subject",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateSubject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/subjects"] });
      setEditingSubject(null);
      toast({
        title: "Subject updated",
        description: "The subject information has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error updating subject",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/subjects"] });
      toast({
        title: "Subject deleted",
        description: "The subject has been successfully removed from the system.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error deleting subject",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleCreateSubject = (data: any) => {
    createMutation.mutate({
      ...data,
      examLevel: examLevelFilter,
    });
  };

  const handleUpdateSubject = (data: any) => {
    if (editingSubject) {
      updateMutation.mutate({
        id: editingSubject.id,
        updates: data,
      });
    }
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm("Are you sure you want to delete this subject? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter subjects based on search
  const filteredSubjects = subjectsData?.subjects?.filter((subject: Subject) => {
    const matchesSearch = !searchQuery || 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];

  // Group subjects by core/elective
  const coreSubjects = filteredSubjects.filter((subject: Subject) => subject.isCore);
  const electiveSubjects = filteredSubjects.filter((subject: Subject) => !subject.isCore);

  const examLevels = [
    { value: "ple", label: "Primary Leaving Examination (PLE)" },
    { value: "uce", label: "Uganda Certificate of Education (UCE)" },
    { value: "uace", label: "Uganda Advanced Certificate of Education (UACE)" },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Subjects">
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Subjects">
        <div className="p-6">
          <EmptyState
            icon={Search}
            title="Error loading subjects"
            description="There was an error loading the subject data. Please try again."
            action={{
              label: "Retry",
              onClick: () => queryClient.invalidateQueries({ queryKey: ["/api/v1/subjects"] }),
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Subjects">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subjects Management</h1>
            <p className="text-muted-foreground">
              Manage curriculum subjects and UNEB requirements
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0" data-testid="add-subject-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>
              <SubjectForm
                examLevel={examLevelFilter}
                onSubmit={handleCreateSubject}
                onCancel={() => setIsCreateDialogOpen(false)}
                isSubmitting={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Examination Level
              </label>
              <Select value={examLevelFilter} onValueChange={setExamLevelFilter}>
                <SelectTrigger data-testid="filter-exam-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {examLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Subjects
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-subjects"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredSubjects.length > 0 ? (
          <div className="space-y-8">
            {/* Core Subjects */}
            {coreSubjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Core Subjects</h2>
                  <Badge variant="outline">{coreSubjects.length}</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {coreSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onEdit={setEditingSubject}
                      onDelete={handleDeleteSubject}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Elective Subjects */}
            {electiveSubjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Elective Subjects</h2>
                  <Badge variant="outline">{electiveSubjects.length}</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {electiveSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onEdit={setEditingSubject}
                      onDelete={handleDeleteSubject}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No subjects found"
            description={
              searchQuery
                ? "No subjects match your search criteria. Try adjusting your search."
                : "No subjects have been added for this examination level yet."
            }
            action={
              !searchQuery
                ? {
                    label: "Add First Subject",
                    onClick: () => setIsCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        )}

        {/* Edit Subject Dialog */}
        <Dialog open={!!editingSubject} onOpenChange={(open) => !open && setEditingSubject(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
            </DialogHeader>
            {editingSubject && (
              <SubjectForm
                subject={editingSubject}
                examLevel={examLevelFilter}
                onSubmit={handleUpdateSubject}
                onCancel={() => setEditingSubject(null)}
                isSubmitting={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            subject.isCore ? 'bg-primary/10' : 'bg-accent/10'
          }`}>
            {subject.isCore ? (
              <Award className={`w-5 h-5 ${subject.isCore ? 'text-primary' : 'text-accent'}`} />
            ) : (
              <BookOpen className={`w-5 h-5 ${subject.isCore ? 'text-primary' : 'text-accent'}`} />
            )}
          </div>
          <Badge variant={subject.isActive ? "default" : "secondary"}>
            {subject.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div>
          <CardTitle className="text-lg">{subject.name}</CardTitle>
          {subject.code && (
            <CardDescription className="font-mono">{subject.code}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {subject.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {subject.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <Badge variant="outline">
            {subject.examLevel.toUpperCase()}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(subject)}
              data-testid={`edit-subject-${subject.id}`}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(subject.id)}
              className="text-destructive hover:text-destructive"
              data-testid={`delete-subject-${subject.id}`}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SubjectFormProps {
  subject?: Subject;
  examLevel: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function SubjectForm({ subject, examLevel, onSubmit, onCancel, isSubmitting }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    code: subject?.code || "",
    description: subject?.description || "",
    isCore: subject?.isCore || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Subject Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mathematics"
          required
          data-testid="subject-name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Subject Code
        </label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="e.g., MATH"
          data-testid="subject-code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the subject"
          data-testid="subject-description"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isCore"
          checked={formData.isCore}
          onChange={(e) => setFormData({ ...formData, isCore: e.target.checked })}
          className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          data-testid="subject-is-core"
        />
        <label htmlFor="isCore" className="text-sm text-foreground">
          Core Subject (Required for all students)
        </label>
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
          disabled={isSubmitting || !formData.name}
          data-testid="submit-button"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner w-4 h-4 mr-2"></div>
              {subject ? "Updating..." : "Creating..."}
            </>
          ) : (
            subject ? "Update Subject" : "Create Subject"
          )}
        </Button>
      </div>
    </form>
  );
}
