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
import { School } from "@marka/types/api";

const schoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  code: z.string().optional(),
  level: z.enum(["primary", "o_level", "a_level", "combined"]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  school?: School;
  onSubmit: (data: SchoolFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SchoolForm({
  school,
  onSubmit,
  onCancel,
  isSubmitting,
}: SchoolFormProps) {
  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || "",
      code: school?.code || "",
      level: school?.level || undefined,
      address: school?.address || "",
      city: school?.city || "",
      district: school?.district || "",
      region: school?.region || "",
      postalCode: school?.postalCode || "",
      phone: school?.phone || "",
      email: school?.email || "",
      website: school?.website || "",
    },
  });

  const handleSubmit = (data: SchoolFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      School Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter school name"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-name"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      School Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., SMCK001"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-code"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Education Level
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="w-full h-10 sm:h-11"
                        data-testid="school-level"
                      >
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="o_level">
                        O-Level (Secondary)
                      </SelectItem>
                      <SelectItem value="a_level">
                        A-Level (Advanced)
                      </SelectItem>
                      <SelectItem value="combined">Combined School</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 border-b pb-2">
              Location Information
            </h3>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter school address"
                      className="w-full min-h-[80px] sm:min-h-[100px] resize-none"
                      {...field}
                      data-testid="school-address"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      City/Town
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Kampala"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-city"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      District
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Kampala District"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-district"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Region
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Central Region"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-region"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., P.O. Box 1234"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-postal"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 border-b pb-2">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+256 700 000 000"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-phone"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@school.ug"
                        className="w-full h-10 sm:h-11"
                        {...field}
                        data-testid="school-email"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.school.ug"
                      className="w-full h-10 sm:h-11"
                      {...field}
                      data-testid="school-website"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 px-6"
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-10 sm:h-11 px-6"
              data-testid="submit-button"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  {school ? "Updating..." : "Creating..."}
                </>
              ) : school ? (
                "Update School"
              ) : (
                "Create School"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
