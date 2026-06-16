import { BirdIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BirdSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
  iconClassName?: string;
}

export function BirdSpinner({
  className,
  size = 48,
  label = "Loading...",
  iconClassName,
}: BirdSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex flex-col items-center">
        <BirdIcon
          size={size}
          className={cn("animate-bounce relative z-10", iconClassName)}
        />

        <div
          className="bg-current/20 rounded-full mt-1 animate-pulse"
          style={{
            width: size * 0.66,
            height: size * 0.125,
          }}
        />
      </div>

      {label && (
        <p className="mt-6 text-sm font-medium animate-pulse tracking-wide opacity-70">
          {label}
        </p>
      )}
    </div>
  );
}
