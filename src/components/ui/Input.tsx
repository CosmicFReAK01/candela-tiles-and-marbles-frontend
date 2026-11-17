"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono uppercase text-gray-500 tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded border bg-white text-xs text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none ${
              leftIcon ? "pl-9" : "pl-3"
            } pr-3 py-2 ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-[#9E7B47]"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] font-mono text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-gray-500 font-light">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono uppercase text-gray-500 tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full rounded border bg-white p-2.5 text-xs text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none font-light ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-[#9E7B47]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] font-mono text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-gray-500 font-light">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
