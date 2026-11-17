"use client";

import React from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center border border-dashed border-candela-border rounded-sm bg-candela-surface/40 flex flex-col items-center justify-center space-y-3">
      <div className="h-12 w-12 rounded-full bg-candela-surface flex items-center justify-center text-candela-secondary border border-candela-border">
        {icon || <PackageOpen className="h-6 w-6" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-heading text-lg font-semibold text-candela-text">
          {title}
        </h4>
        <p className="text-xs text-candela-secondary font-light">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
