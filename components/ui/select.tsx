import React from "react";

export function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`block w-full rounded-md border border-border bg-input px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
