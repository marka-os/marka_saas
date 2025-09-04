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
import { Student } from "@marka/types/api";

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  lin: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  currentClass: z.string().min(1, "Class is required"),
  currentStream: z.string().min(1, "Stream is required"),
  parentGuardianName: z.string().optional(),
  parentGuardianPhone: z.string().optional(),
  parentGuardianEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  admissionNumber: z.string().optional(),
  admissionDate: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function StudentForm({
  student,
  onSubmit,
  onCancel,
  isSubmitting,
}: StudentFormProps) {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      middleName: student?.middleName || "",
      lin: student?.lin || "",
      gender: student?.gender || undefined,
      dateOfBirth: student?.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
      currentClass: student?.class || "",
      currentStream: student?.stream || "",
      parentGuardianName: student?.parentName || "",
      parentGuardianPhone: student?.parentPhone || "",
      parentGuardianEmail: student?.parentEmail || "",
      address: student?.address || "",
      // admissionNumber: student?.admissionNumber || "",
      admissionDate: student?.admissionDate
        ? new Date(student.admissionDate).toISOString().split("T")[0]
        : "",
    },
  });

  const handleSubmit = (data: StudentFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      data-testid="first-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      data-testid="last-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter middle name"
                      {...field}
                      data-testid="middle-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LIN (Learner Identification Number)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter LIN"
                      {...field}
                      data-testid="lin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="date-of-birth" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Academic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="current-class">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="P1">Primary 1</SelectItem>
                      <SelectItem value="P2">Primary 2</SelectItem>
                      <SelectItem value="P3">Primary 3</SelectItem>
                      <SelectItem value="P4">Primary 4</SelectItem>
                      <SelectItem value="P5">Primary 5</SelectItem>
                      <SelectItem value="P6">Primary 6</SelectItem>
                      <SelectItem value="P7">Primary 7</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentStream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="current-stream">
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">Stream A</SelectItem>
                      <SelectItem value="B">Stream B</SelectItem>
                      <SelectItem value="C">Stream C</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="admissionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter admission number"
                      {...field}
                      data-testid="admission-number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="admission-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Parent/Guardian Information</h3>

          <FormField
            control={form.control}
            name="parentGuardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent/Guardian Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter parent/guardian name"
                    {...field}
                    data-testid="parent-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parentGuardianPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+256 700 000 000"
                      {...field}
                      data-testid="parent-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentGuardianEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="parent@example.com"
                      {...field}
                      data-testid="parent-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter home address"
                    className="resize-none"
                    {...field}
                    data-testid="address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                {student ? "Updating..." : "Creating..."}
              </>
            ) : student ? (
              "Update Student"
            ) : (
              "Create Student"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
