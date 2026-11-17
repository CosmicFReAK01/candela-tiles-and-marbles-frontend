"use client";

import React from "react";

export type BadgeVariant =
  | "gold"
  | "dark"
  | "neutral"
  | "success"
  | "warning"
  | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  icon,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    gold: "bg-[#9E7B47]/10 text-[#9E7B47] border-[#9E7B47]/30",
    dark: "bg-candela-dark text-candela-bg border-candela-border/20",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  const sizeStyles = {
    sm: "text-[9px] px-1.5 py-0.5 gap-1",
    md: "text-[10px] px-2 py-0.5 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-wider rounded border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
