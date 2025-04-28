import * as React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  centerContent?: boolean;
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = "xl",
  padding = "md",
  centerContent = false,
}: ResponsiveContainerProps) {
  const { isMobile } = useResponsive();
  
  const maxWidthClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };
  
  const paddingClasses = {
    none: "px-0",
    sm: isMobile ? "px-2" : "px-4",
    md: isMobile ? "px-3" : "px-6",
    lg: isMobile ? "px-4" : "px-8",
  };
  
  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centerContent && "flex flex-col items-center",
        className
      )}
    >
      {children}
    </div>
  );
}