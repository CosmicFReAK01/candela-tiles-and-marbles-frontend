"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Candela ErrorBoundary caught error]:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[320px] w-full flex flex-col items-center justify-center p-8 bg-candela-surface border border-candela-border text-center rounded-sm space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9E7B47]">
              Atelier Recovery Mode
            </span>
            <h3 className="font-heading text-xl font-bold text-candela-text">
              {this.props.fallbackTitle || "Architectural Rendering Notice"}
            </h3>
            <p className="text-xs text-candela-secondary font-light">
              {this.props.fallbackDescription ||
                "A temporary issue occurred while rendering this architectural surface component."}
            </p>
            {this.state.error?.message && (
              <p className="font-mono text-[11px] text-gray-500 bg-gray-100 p-2 rounded mt-2 text-left truncate">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 bg-[#9E7B47] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-[#8B6914] transition cursor-pointer rounded-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Component</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 border border-candela-border text-candela-text px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-candela-bg transition rounded-xs"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
