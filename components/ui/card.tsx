import React from "react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
