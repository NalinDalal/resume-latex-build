import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <div className="relative inline-block text-left">{children}</div>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

export function DropdownMenuTrigger({ children, asChild, onClick }: DropdownMenuTriggerProps) {
  return (
    <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={onClick}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenuContent({ children, align = "start", className = "" }: DropdownMenuContentProps) {
  return (
    <div className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${align === "end" ? "right-0" : "left-0"} ${className}`}>
      <div className="py-1">{children}</div>
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function DropdownMenuItem({ children, onClick }: DropdownMenuItemProps) {
  return (
    <button type="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={onClick}>
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 my-1" />;
}
