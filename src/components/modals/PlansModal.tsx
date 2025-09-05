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
import { Check, Crown, Zap, Building, Sparkles } from "lucide-react";

const plans = [
  {
    id: "standard",
    name: "Standard",
    icon: Zap,
    description: "Perfect for small schools and individual educators",
    features: [
      "Up to 200 students",
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
    description: "Ideal for growing institutions with more needs",
    features: [
      "Up to 500 students",
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
    description: "Tailored solutions for unique requirements",
    features: ["Tailored to your needs", "Available upon request (via call)"],
    highlight: false,
  },
];

export function PlanModal() {
  const { setValue, watch } = useFormContext();
  const selectedPlan = watch("plan");

  const handleSelect = (planId: string) => {
    setValue("plan", planId, { shouldValidate: true });
  };

  return (
    <Dialog>
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
      <DialogContent className="max-w-6xl p-0 overflow-hidden animate-fade-in">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Choose Your Plan
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Select the plan that best fits your institution's needs
          </p>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`group relative cursor-pointer transition-all duration-300 h-full flex flex-col overflow-hidden
                    ${
                      selectedPlan === plan.id
                        ? "ring-2 ring-primary shadow-lg border-primary"
                        : "border-border/70 hover:border-primary/50 hover:shadow-md"
                    }
                    ${
                      plan.highlight
                        ? "border-primary/30 ring-1 ring-primary/20 shadow-md"
                        : ""
                    }
                  `}
                  onClick={() => handleSelect(plan.id)}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground text-xs font-medium py-1 text-center">
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
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        ${
                          plan.id === "pro"
                            ? "bg-purple-100 text-purple-600"
                            : ""
                        }
                        ${
                          plan.id === "enterprise"
                            ? "bg-amber-100 text-amber-600"
                            : ""
                        }
                        ${
                          plan.id === "custom"
                            ? "bg-green-100 text-green-600"
                            : ""
                        }
                      `}
                      >
                        <IconComponent size={20} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-center">
                        {plan.name}
                      </CardTitle>
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
                          <span className="text-foreground/80">{feature}</span>
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

        <div className="px-6 py-4 border-t bg-muted/20 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {selectedPlan
              ? `You've selected the ${selectedPlan} plan`
              : "Please select a plan to continue"}
          </p>
          <Button
            type="button"
            disabled={!selectedPlan}
            onClick={() => {
              if (!selectedPlan) setValue("plan", "standard");
            }}
            className="animate-slide-in-right"
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
