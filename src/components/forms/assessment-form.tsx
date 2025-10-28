import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@marka/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@marka/components/ui/form";
import { Input } from "@marka/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@marka/components/ui/select";
import { Textarea } from "@marka/components/ui/textarea";
import { Assessment } from "@marka/types/api";

const assessmentSchema = z.object({
  AssessmentName: z.string().min(1, "Assessment name is required"),
  type: z.enum(["exam", "test", "quiz", "assignment", "project", "practical"]),
  caScore: z
    .number()
    .min(0, "CA examScore must be non-negative")
    .max(100, "CA examScore cannot exceed 100"),
  subjectId: z.string().min(1, "Subject is required"),
  studentId: z.string().min(1, "Student ID is required"),
  examLevel: z.enum(["ple", "uce", "uace"]),
  //academicYear: z.string().min(1, "Academic year is required"),
  // term: z.string().min(1, "Term is required"),
  //assessmentType: z.string().min(1, "Assessment type is required"),
  examScore: z
    .number()
    .min(0, "Score must be non-negative")
    .max(100, "Score cannot exceed maximum")
    .optional(),
  //maxScore: z
  //.number()
  //.min(1, "Maximum examScore must be at least 1")
  // .optional(),
  //grade: z.string().optional(),
  remark: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  assessment?: Assessment;
  onSubmit: (data: AssessmentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AssessmentForm({
  assessment,
  onSubmit,
  onCancel,
  isSubmitting,
}: AssessmentFormProps) {
  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      subjectId: assessment?.subjectId || "",
      examLevel: assessment?.examLevel || "ple",
      //academicYear:
      // assessment?.academicYear || new Date().getFullYear().toString(),
      //term: assessment?.term || "",
      //assessmentType: assessment?.type || "",
      examScore: assessment?.examScore || undefined,
      // maxScore: assessment?.maxScore || 100,
      //grade: assessment?.grade || "",
      remark: assessment?.remark || "",
      metadata: assessment?.metadata || {},
    },
  });

  const handleSubmit = (data: AssessmentFormData) => {
    onSubmit(data);
  };

  // Mock subjects for dropdown
  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "english", name: "English" },
    { id: "science", name: "Science" },
    { id: "social", name: "Social Studies" },
  ];

  const assessmentTypes = [
    "Continuous Assessment",
    "Mid-Term Examination",
    "End of Term Examination",
    "Mock Examination",
    "Practice Test",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Assessment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Assessment Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="subject-select">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Examination Level *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="exam-level-select">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ple">
                        Primary Leaving Examination (PLE)
                      </SelectItem>
                      <SelectItem value="uce">
                        Uganda Certificate of Education (UCE)
                      </SelectItem>
                      <SelectItem value="uace">
                        Uganda Advanced Certificate of Education (UACE)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/**<FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2025"
                      {...field}
                      data-testid="academic-year"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="term-select">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                      <SelectItem value="Term 3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />*/}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="assessment-type-select">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assessmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Scoring */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Scoring</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="examScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter examScore"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                      data-testid="examScore-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/**<FormField
              control={form.control}
              name="maxScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      min="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                      data-testid="max-examScore-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />*/}

            {/** <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="grade-select">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="D1">D1 (Distinction 1)</SelectItem>
                      <SelectItem value="D2">D2 (Distinction 2)</SelectItem>
                      <SelectItem value="C3">C3 (Credit 3)</SelectItem>
                      <SelectItem value="C4">C4 (Credit 4)</SelectItem>
                      <SelectItem value="C5">C5 (Credit 5)</SelectItem>
                      <SelectItem value="C6">C6 (Credit 6)</SelectItem>
                      <SelectItem value="P7">P7 (Pass 7)</SelectItem>
                      <SelectItem value="P8">P8 (Pass 8)</SelectItem>
                      <SelectItem value="F9">F9 (Failure)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />*/}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>

          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks/Comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional remarks or comments about this assessment..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    data-testid="remarks-textarea"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* UNEB Compliance Notice */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary-foreground text-xs font-bold">
                !
              </span>
            </div>
            <div className="text-sm">
              <p className="text-foreground font-medium mb-1">
                UNEB Compliance
              </p>
              <p className="text-muted-foreground">
                This assessment will be recorded according to Uganda National
                Examinations Board standards and will be included in the
                student's official academic record.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
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
            disabled={isSubmitting}
            data-testid="submit-button"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner w-4 h-4 mr-2"></div>
                {assessment ? "Updating..." : "Creating..."}
              </>
            ) : assessment ? (
              "Update Assessment"
            ) : (
              "Create Assessment"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
