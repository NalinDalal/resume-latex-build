import React from "react";

export function Button({ className = "", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-semibold shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
