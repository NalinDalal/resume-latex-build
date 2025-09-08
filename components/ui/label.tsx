import React from "react";

export function Label({ className = "", children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`block text-sm font-medium text-foreground mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
}
