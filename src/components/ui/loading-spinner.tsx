import { cn } from "@marka/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div 
      className={cn(
        "loading-spinner border-2 border-muted border-t-primary rounded-full",
        sizeClasses[size],
        className
      )}
      data-testid="loading-spinner"
    />
  );
}
