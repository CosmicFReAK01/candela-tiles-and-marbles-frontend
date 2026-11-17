"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "gold";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-candela-dark text-candela-bg hover:bg-black border border-transparent shadow-xs",
      secondary:
        "bg-candela-surface text-candela-text hover:bg-candela-border/40 border border-candela-border",
      gold: "bg-[#9E7B47] text-white hover:bg-[#856535] border border-transparent shadow-xs font-semibold",
      outline:
        "bg-transparent text-candela-text hover:bg-candela-surface border border-candela-border",
      ghost:
        "bg-transparent text-candela-secondary hover:text-candela-text hover:bg-candela-surface/60",
      danger:
        "bg-red-600 text-white hover:bg-red-700 border border-transparent",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-[10px] px-2.5 py-1.5 gap-1.5 rounded-xs",
      md: "text-xs px-4 py-2 gap-2 rounded-xs",
      lg: "text-xs px-6 py-3 gap-2.5 rounded-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
