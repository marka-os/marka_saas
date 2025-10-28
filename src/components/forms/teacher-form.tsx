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
  FormDescription,
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
import { Teacher } from "@marka/types/api";

const teacherSchema = z.object({
  // Personal Information
  employeeId: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),

  // Emergency Contact
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),

  // Employment Information
  employmentStatus: z
    .enum(["active", "inactive", "suspended", "terminated"])
    .default("active"),
  contractType: z
    .enum(["permanent", "contract", "temporary", "probation"])
    .optional(),
  hireDate: z.string().optional(),
  contractEndDate: z.string().optional(),

  // Qualifications
  highestQualification: z
    .enum(["certificate", "diploma", "degree", "masters", "phd", "other"])
    .optional(),
  qualificationDetails: z.string().optional(),
  specializations: z.string().optional(),
  yearsOfExperience: z.string().optional(),

  // Salary Information
  baseSalary: z.string().optional(),
  basicSalary: z.string().optional(),
  allowances: z.string().optional(),
  deductions: z.string().optional(),

  // Additional Information
  notes: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: TeacherFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TeacherForm({
  teacher,
  onSubmit,
  onCancel,
  isSubmitting,
}: TeacherFormProps) {
  const isEditMode = !!teacher;

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      employeeId: teacher?.employeeId || "",
      firstName: teacher?.firstName || "",
      lastName: teacher?.lastName || "",
      middleName: teacher?.middleName || "",
      email: teacher?.email || "",
      phone: teacher?.phone || "",
      nationalId: teacher?.nationalId || "",
      dateOfBirth: teacher?.dateOfBirth
        ? new Date(teacher.dateOfBirth).toISOString().split("T")[0]
        : "",
      address: teacher?.address || "",
      city: teacher?.city || "",
      district: teacher?.district || "",
      emergencyContact: teacher?.emergencyContact || "",
      emergencyPhone: teacher?.emergencyPhone || "",
      employmentStatus: teacher?.employmentStatus || "active",
      contractType: teacher?.contractType || undefined,
      hireDate: teacher?.hireDate
        ? new Date(teacher.hireDate).toISOString().split("T")[0]
        : "",
      contractEndDate: teacher?.contractEndDate
        ? new Date(teacher.contractEndDate).toISOString().split("T")[0]
        : "",
      highestQualification: teacher?.highestQualification || undefined,
      qualificationDetails: teacher?.qualificationDetails || "",
      specializations: teacher?.specializations || "",
      yearsOfExperience: teacher?.yearsOfExperience?.toString() || "",
      baseSalary: teacher?.baseSalary?.toString() || "",
      basicSalary: teacher?.salaryStructure?.basic?.toString() || "",
      allowances: teacher?.salaryStructure?.allowances?.toString() || "",
      deductions: teacher?.salaryStructure?.deductions?.toString() || "",
      notes: teacher?.notes || "",
    },
  });

  const handleSubmit = (data: TeacherFormData) => {
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
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Auto-generated if empty"
                      {...field}
                      disabled={isEditMode} // Disable only when editing
                      data-testid="employee-id"
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditMode 
                      ? "Employee ID cannot be changed" 
                      : "Leave empty for auto-generation"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CM12345678901234"
                      {...field}
                      disabled={isEditMode} // Disable only when editing
                      data-testid="national-id"
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditMode && "National ID cannot be changed"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="teacher@school.com"
                      {...field}
                      data-testid="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+256 700 000 000"
                      {...field}
                      data-testid="phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    disabled={isEditMode} // Disable only when editing
                    data-testid="date-of-birth" 
                  />
                </FormControl>
                <FormDescription>
                  {isEditMode && "Date of birth cannot be changed"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter residential address"
                    className="resize-none"
                    {...field}
                    data-testid="address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Kampala"
                      {...field}
                      data-testid="city"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Central"
                      {...field}
                      data-testid="district"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contact</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter emergency contact name"
                      {...field}
                      data-testid="emergency-contact"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+256 700 000 000"
                      {...field}
                      data-testid="emergency-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="employment-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="contract-type">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="probation">Probation</SelectItem>
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
              name="hireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hire Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      disabled={isEditMode} // Disable only when editing
                      data-testid="hire-date" 
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditMode && "Hire date cannot be changed"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract End Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="contract-end-date"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for permanent contracts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Qualifications & Experience - All fields remain editable */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Qualifications & Experience</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="highestQualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest Qualification</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="highest-qualification">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="masters">Masters</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 5"
                      {...field}
                      data-testid="years-of-experience"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="qualificationDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualification Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Bachelor of Education in Mathematics"
                    className="resize-none"
                    {...field}
                    data-testid="qualification-details"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specializations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specializations</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Mathematics, Physics"
                    {...field}
                    data-testid="specializations"
                  />
                </FormControl>
                <FormDescription>
                  Separate multiple specializations with commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Salary Information - All fields remain editable */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Salary Information</h3>

          <FormField
            control={form.control}
            name="baseSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Salary (UGX)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 1500000"
                    {...field}
                    data-testid="base-salary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="basicSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basic Salary (UGX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 1000000"
                      {...field}
                      data-testid="basic-salary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowances (UGX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 500000"
                      {...field}
                      data-testid="allowances"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deductions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductions (UGX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 100000"
                      {...field}
                      data-testid="deductions"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Notes - Remain editable */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional notes or comments"
                    className="resize-none min-h-[100px]"
                    {...field}
                    data-testid="notes"
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
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Teacher"
            ) : (
              "Create Teacher"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}