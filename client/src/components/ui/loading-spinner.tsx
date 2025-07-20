
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const variantClasses = {
    default: "border-muted-foreground border-t-foreground",
    primary: "border-primary/30 border-t-primary",
    secondary: "border-secondary/30 border-t-secondary",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" variant="primary" />
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export function FullPageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
}
