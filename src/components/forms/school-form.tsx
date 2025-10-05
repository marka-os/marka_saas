import { useState, useCallback, useMemo } from "react";
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

type SchoolLevel = "primary" | "o_level" | "a_level" | "combined";

export interface InsertSchool {
  name: string;
  code?: string;
  level?: SchoolLevel;
  address?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
}

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
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

interface SchoolFormProps {
  school?: InsertSchool;
  onSubmit: (data: InsertSchool) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "School details" },
  { id: 2, title: "Location", description: "Address & region" },
  { id: 3, title: "Contact", description: "Phone & email" },
] as const;

const TOTAL_STEPS = STEPS.length;

export function SchoolForm({
  school,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SchoolFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const defaultValues = useMemo(
    () => ({
      name: school?.name ?? "",
      code: school?.code ?? "",
      level: school?.level,
      address: school?.address ?? "",
      city: school?.city ?? "",
      district: school?.district ?? "",
      region: school?.region ?? "",
      postalCode: school?.postalCode ?? "",
      phone: school?.phone ?? "",
      email: school?.email ?? "",
      website: school?.website ?? "",
      logoUrl: school?.logoUrl ?? "",
    }),
    [school]
  );

  const form = useForm<InsertSchool>({
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
    defaultValues,
  });

  const handleNext = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();

      // Validate only required fields for current step
      if (currentStep === 1) {
        const isValid = await form.trigger(["name"]);
        if (!isValid) return;
      }

      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    },
    [currentStep, form]
  );

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    (data: InsertSchool) => {
      // Clean up data - only include fields with actual values
      const cleanedData: InsertSchool = { name: data.name };

      // Add optional fields only if they have values
      if (data.code?.trim()) cleanedData.code = data.code.trim();
      if (data.level) cleanedData.level = data.level;
      if (data.address?.trim()) cleanedData.address = data.address.trim();
      if (data.city?.trim()) cleanedData.city = data.city.trim();
      if (data.district?.trim()) cleanedData.district = data.district.trim();
      if (data.region?.trim()) cleanedData.region = data.region.trim();
      if (data.postalCode?.trim())
        cleanedData.postalCode = data.postalCode.trim();
      if (data.phone?.trim()) cleanedData.phone = data.phone.trim();
      if (data.email?.trim()) cleanedData.email = data.email.trim();
      if (data.website?.trim()) cleanedData.website = data.website.trim();
      if (data.logoUrl?.trim()) cleanedData.logoUrl = data.logoUrl.trim();

      onSubmit(cleanedData);
    },
    [onSubmit]
  );

  const StepIndicator = useCallback(
    () => (
      <div className="w-full mb-6 sm:mb-8">
        {/* Mobile Step Indicator */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-muted-foreground">
              {STEPS[currentStep - 1].title}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                      currentStep >= step.id
                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium transition-colors ${
                        currentStep >= step.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < TOTAL_STEPS - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors duration-200 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    [currentStep]
  );

  const Step1BasicInfo = useCallback(
    () => (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Basic Information
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Let's start with the essential details about your school
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  School Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter school name"
                    className="h-11 sm:h-12"
                    {...field}
                    data-testid="school-name"
                  />
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
                  <Input
                    placeholder="e.g., SMCK001"
                    className="h-11 sm:h-12"
                    {...field}
                    data-testid="school-code"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  Optional unique identifier for your school
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className="h-11 sm:h-12"
                      data-testid="school-level"
                    >
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

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Logo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    className="h-11 sm:h-12"
                    {...field}
                    data-testid="school-logo"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  URL to your school's logo image
                </p>
              </FormItem>
            )}
          />
        </div>
      </div>
    ),
    [form.control]
  );

  const Step2Location = useCallback(
    () => (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Location Information
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Where is your school located?
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the full street address"
                    className="min-h-[100px] resize-none"
                    {...field}
                    data-testid="school-address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Town</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Kampala"
                      className="h-11 sm:h-12"
                      {...field}
                      data-testid="school-city"
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
                      placeholder="e.g., Kampala District"
                      className="h-11 sm:h-12"
                      {...field}
                      data-testid="school-district"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Central Region"
                      className="h-11 sm:h-12"
                      {...field}
                      data-testid="school-region"
                    />
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
                    <Input
                      placeholder="e.g., P.O. Box 1234"
                      className="h-11 sm:h-12"
                      {...field}
                      data-testid="school-postal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    ),
    [form.control]
  );

  const Step3Contact = useCallback(
    () => (
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Contact Information
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            How can people reach your school?
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+256 700 000 000"
                    className="h-11 sm:h-12"
                    {...field}
                    data-testid="school-phone"
                  />
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
                    className="h-11 sm:h-12"
                    {...field}
                    data-testid="school-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.school.ug"
                    className="h-11 sm:h-12"
                    {...field}
                    data-testid="school-website"
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  School's official website
                </p>
              </FormItem>
            )}
          />
        </div>
      </div>
    ),
    [form.control]
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Location />;
      case 3:
        return <Step3Contact />;
      default:
        return <Step1BasicInfo />;
    }
  };

  const NavigationButtons = useCallback(
    () => (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t">
        {/* Mobile Layout */}
        <div className="block sm:hidden space-y-3">
          {currentStep < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={handleNext}
              className="w-full h-12"
              data-testid="next-button"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12"
              data-testid="submit-button"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  {school ? "Updating..." : "Creating..."}
                </>
              ) : school ? (
                "Update School"
              ) : (
                "Create School"
              )}
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 h-11"
              data-testid="cancel-button"
            >
              Cancel
            </Button>

            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 h-11"
                data-testid="previous-button"
              >
                Previous
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:justify-between sm:w-full">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 h-11"
              data-testid="cancel-button"
            >
              Cancel
            </Button>

            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="px-6 h-11"
                data-testid="previous-button"
              >
                Previous
              </Button>
            )}
          </div>

          <div>
            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="px-6 h-11"
                data-testid="next-button"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 h-11"
                data-testid="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    {school ? "Updating..." : "Creating..."}
                  </>
                ) : school ? (
                  "Update School"
                ) : (
                  "Create School"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    ),
    [currentStep, handleNext, handlePrevious, onCancel, isSubmitting, school]
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <StepIndicator />

          <div className="min-h-[400px] sm:min-h-[500px]">
            {renderCurrentStep()}
          </div>

          <NavigationButtons />
        </form>
      </Form>
    </div>
  );
}
