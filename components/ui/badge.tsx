import React from "react";

export function Badge({ className = "", children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground border border-border ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
