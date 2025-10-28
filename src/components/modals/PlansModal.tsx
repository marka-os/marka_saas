import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@marka/components/ui/dialog";
import { Button } from "@marka/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@marka/components/ui/card";
import { useFormContext } from "react-hook-form";
import { Check, Crown, Zap, Building, Sparkles, X } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "standard",
    name: "Standard",
    icon: Zap,
    price: "133,000",
    period: "termly",
    description: "Perfect for small schools and individual educators",
    features: [
      "Up to 500 students",
      "2GB storage",
      "Unlimited assessments",
      "Support: Email",
      "Basic analytics",
      "Limited customization",
      "5 integrations",
      "3 users",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    price: "266,000",
    period: "termly",
    description: "Ideal for growing institutions with more needs",
    features: [
      "Up to 1000 students",
      "10GB storage",
      "Unlimited assessments",
      "Support: Priority",
      "Advanced analytics",
      "Full customization",
      "25 integrations",
      "10 users",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building,
    price: "532,000",
    period: "termly",
    description: "For large institutions with extensive requirements",
    features: [
      "Up to 2000 students",
      "100GB storage",
      "Unlimited assessments",
      "Support: Dedicated",
      "Enterprise analytics",
      "Custom customization",
      "50 integrations",
      "20 users",
    ],
    highlight: false,
  },
  {
    id: "custom",
    name: "Custom",
    icon: Sparkles,
    price: "Custom",
    period: "",
    description: "Tailored solutions for unique requirements",
    features: ["Tailored to your needs", "Available upon request (via call)"],
    highlight: false,
  },
];

export function PlanModal() {
  const { setValue, watch } = useFormContext();
  const selectedPlan = watch("plan");
  const [open, setOpen] = useState(false);

  const handleSelect = (planId: string) => {
    setValue("plan", planId, { shouldValidate: true });
  };

  const handleConfirm = () => {
    if (!selectedPlan) {
      setValue("plan", "standard", { shouldValidate: true });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-background hover:bg-accent transition-all duration-300 border-border/60 hover:border-primary/50"
        >
          {selectedPlan ? (
            <div className="flex items-center gap-2">
              <span className="text-foreground/80">Selected plan:</span>
              <span className="font-medium text-primary capitalize">
                {selectedPlan}
              </span>
            </div>
          ) : (
            <span className="text-foreground/70">Choose a plan</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Choose Your Plan
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Select the plan that best fits your institution's needs
          </p>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-4">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`group relative cursor-pointer transition-all duration-300 h-full flex flex-col overflow-hidden
                    ${
                      selectedPlan === plan.id
                        ? "ring-2 ring-primary shadow-lg border-primary"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    }
                    ${
                      plan.highlight
                        ? "border-primary/50 ring-2 ring-primary/20 shadow-md"
                        : ""
                    }
                  `}
                  onClick={() => handleSelect(plan.id)}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-1 text-center">
                      Most Popular
                    </div>
                  )}

                  <CardHeader
                    className={`pb-3 ${plan.highlight ? "pt-5" : "pt-4"}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-2 rounded-full mb-3 
                        ${
                          plan.id === "standard"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                            : ""
                        }
                        ${
                          plan.id === "pro"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200"
                            : ""
                        }
                        ${
                          plan.id === "enterprise"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                            : ""
                        }
                        ${
                          plan.id === "custom"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200"
                            : ""
                        }
                      `}
                      >
                        <IconComponent size={20} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-center text-foreground">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-2 text-center">
                        <span className="text-2xl font-bold text-foreground">
                          {plan.price}
                          {plan.period && (
                            <span className="text-sm font-normal text-muted-foreground">
                              /{plan.period}
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {plan.description}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow pb-4">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-foreground/80 text-xs sm:text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <div className="px-4 pb-4 mt-auto">
                    <Button
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      className="w-full"
                      size="sm"
                    >
                      {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-3 sticky bottom-0 bg-background">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {selectedPlan
              ? `You've selected the ${selectedPlan} plan`
              : "Please select a plan to continue"}
          </p>
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
