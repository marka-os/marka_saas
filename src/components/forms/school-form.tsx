import  { useState } from "react";
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

const steps = [
  { id: 1, title: "Basic Info", description: "School details" },
  { id: 2, title: "Location", description: "Address & region" },
  { id: 3, title: "Contact", description: "Phone & email" },
];

export function SchoolForm({
  school,
  onSubmit,
  onCancel,
  isSubmitting,
}: SchoolFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
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

  const handleNext = async () => {
    let fieldsToValidate: (keyof SchoolFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["name"];
    } else if (currentStep === 2) {
      fieldsToValidate = [];
    } else if (currentStep === 3) {
      fieldsToValidate = ["email", "website"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (data: SchoolFormData) => {
    onSubmit(data);
  };

  const renderStepIndicator = () => (
    <div className="w-full mb-6 sm:mb-8">
      {/* Mobile Step Indicator */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {steps[currentStep - 1].title}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-all ${
                    currentStep >= step.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Let's start with the essential details about your school
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                School Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter school name"
                  className="w-full h-11 sm:h-12 text-base"
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
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                School Code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., SMCK001"
                  className="w-full h-11 sm:h-12 text-base"
                  {...field}
                  data-testid="school-code"
                />
              </FormControl>
              <FormMessage className="text-xs" />
              <p className="text-xs text-gray-500">
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
              <FormLabel className="text-sm font-medium text-gray-700">
                Education Level
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="w-full h-11 sm:h-12 text-base"
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
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Location Information
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Where is your school located?
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Street Address
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the full street address"
                  className="w-full min-h-[100px] text-base resize-none"
                  {...field}
                  data-testid="school-address"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  City/Town
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Kampala"
                    className="w-full h-11 sm:h-12 text-base"
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
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  District
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Kampala District"
                    className="w-full h-11 sm:h-12 text-base"
                    {...field}
                    data-testid="school-district"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Region
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Central Region"
                    className="w-full h-11 sm:h-12 text-base"
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
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Postal Code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., P.O. Box 1234"
                    className="w-full h-11 sm:h-12 text-base"
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Contact Information
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          How can people reach your school?
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+256 700 000 000"
                  className="w-full h-11 sm:h-12 text-base"
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
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contact@school.ug"
                  className="w-full h-11 sm:h-12 text-base"
                  {...field}
                  data-testid="school-email"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Website
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.school.ug"
                  className="w-full h-11 sm:h-12 text-base"
                  {...field}
                  data-testid="school-website"
                />
              </FormControl>
              <FormMessage className="text-xs" />
              <p className="text-xs text-gray-500">
                School's official website (optional)
              </p>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const renderNavigationButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-3">
        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="w-full h-12 text-base font-medium"
            data-testid="next-button"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-medium"
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
          {currentStep < 3 ? (
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
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
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
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {renderStepIndicator()}

          <div className="min-h-[400px] sm:min-h-[500px]">
            {renderCurrentStep()}
          </div>

          {renderNavigationButtons()}
        </form>
      </Form>
    </div>
  );
}
