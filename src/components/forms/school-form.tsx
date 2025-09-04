import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@marka/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@marka/components/ui/form";
import { Input } from "@marka/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@marka/components/ui/select";
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

export function SchoolForm({ school, onSubmit, onCancel, isSubmitting }: SchoolFormProps) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} data-testid="school-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SMCK001" {...field} data-testid="school-code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="school-level">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="o_level">O-Level (Secondary)</SelectItem>
                    <SelectItem value="a_level">A-Level (Advanced)</SelectItem>
                    <SelectItem value="combined">Combined School</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Location Information</h3>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter school address" 
                    className="resize-none" 
                    {...field} 
                    data-testid="school-address"
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
                  <FormLabel>City/Town</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kampala" {...field} data-testid="school-city" />
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
                    <Input placeholder="e.g., Kampala District" {...field} data-testid="school-district" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Central Region" {...field} data-testid="school-region" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., P.O. Box 1234" {...field} data-testid="school-postal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+256 700 000 000" {...field} data-testid="school-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="contact@school.ug" 
                      {...field} 
                      data-testid="school-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://www.school.ug" 
                    {...field} 
                    data-testid="school-website"
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
                {school ? "Updating..." : "Creating..."}
              </>
            ) : (
              school ? "Update School" : "Create School"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
