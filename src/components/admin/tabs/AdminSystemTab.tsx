"use client";

import React, { useState } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";
import {
  ShieldCheck,
  Clock,
  RotateCcw,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export function AdminSystemTab() {
  const { auditLogs, resetToDefaults } = useCandelaStore();
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagResult, setDiagResult] = useState<{
    ok: boolean;
    latencyMs: number;
    source: string;
    enquiriesProtected: boolean;
    message: string;
  } | null>(null);

  const runLiveDiagnostics = async () => {
    setDiagLoading(true);
    const start = performance.now();
    try {
      const [prodRes, enqRes] = await Promise.all([
        fetch("/api/v1/products?limit=1", { cache: "no-store" }),
        fetch("/api/v1/enquiries", { cache: "no-store" }),
      ]);
      const prodJson = await prodRes.json();
      const latencyMs = Math.round(performance.now() - start);
      const isSupabase = String(prodJson.source || "").includes("Supabase");

      setDiagResult({
        ok: prodRes.ok && enqRes.ok && isSupabase,
        latencyMs,
        source: prodJson.source || "Local Fallback",
        enquiriesProtected: enqRes.ok,
        message: isSupabase
          ? "Supabase PostgreSQL & Staff JWT Session verified."
          : "Connected in fallback mode — verify Supabase database availability.",
      });
    } catch (err) {
      setDiagResult({
        ok: false,
        latencyMs: Math.round(performance.now() - start),
        source: "Unreachable",
        enquiriesProtected: false,
        message: err instanceof Error ? err.message : "Diagnostic request failed",
      });
    } finally {
      setDiagLoading(false);
    }
  };

  const handleClearLocalCache = () => {
    if (
      confirm(
        "Clear browser localStorage draft state and reload live defaults?"
      )
    ) {
      resetToDefaults();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Security Posture & Live DB Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-candela-border pb-3">
            <ShieldCheck className="h-4 w-4 text-candela-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-candela-text">
              Active Perimeter Security
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border border-candela-border bg-candela-surface/50 px-3.5 py-2.5">
              <span className="text-candela-secondary">Edge Middleware Gate</span>
              <span className="text-emerald-700 font-semibold">ACTIVE (/admin &amp; /api/v1)</span>
            </div>
            <div className="flex items-center justify-between border border-candela-border bg-candela-surface/50 px-3.5 py-2.5">
              <span className="text-candela-secondary">Token Verification</span>
              <span className="text-emerald-700 font-semibold">HS256 WebCrypto JWT</span>
            </div>
            <div className="flex items-center justify-between border border-candela-border bg-candela-surface/50 px-3.5 py-2.5">
              <span className="text-candela-secondary">Enquiry Lead Protection</span>
              <span className="text-emerald-700 font-semibold">POST Public / GET Auth Only</span>
            </div>
          </div>
        </div>

        {/* Live Database Diagnostics */}
        <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-candela-border pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-candela-accent" aria-hidden="true" />
              <h2 className="font-heading text-xl text-candela-text">
                Supabase &amp; API Diagnostics
              </h2>
            </div>

            <button
              type="button"
              onClick={runLiveDiagnostics}
              disabled={diagLoading}
              className="inline-flex items-center gap-1.5 bg-candela-accent px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-candela-dark transition cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3 w-3 ${diagLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span>{diagLoading ? "Checking..." : "Run Live Check"}</span>
            </button>
          </div>

          {diagResult ? (
            <div
              className={`border p-4 space-y-2 text-xs font-mono ${
                diagResult.ok
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : "border-amber-300 bg-amber-50 text-amber-950"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {diagResult.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-700" aria-hidden="true" />
                )}
                <span>{diagResult.message}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>Data Source: {diagResult.source}</div>
                <div>Round-trip Latency: {diagResult.latencyMs} ms</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-candela-secondary leading-relaxed">
              Click <strong>Run Live Check</strong> to test end-to-end PostgreSQL pool connectivity,
              JWT authorization headers, and live enquiry table availability.
            </p>
          )}

          <div className="pt-2 border-t border-candela-border flex justify-end">
            <button
              type="button"
              onClick={handleClearLocalCache}
              className="inline-flex items-center gap-1.5 border border-red-300 bg-red-50 px-3.5 py-1.5 font-mono text-[11px] text-red-800 hover:bg-red-100 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear Browser Draft Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* Session Audit Log Feed (Real In-Session Actions Only) */}
      <div className="border border-candela-border bg-candela-bg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-candela-border pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-candela-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-candela-text">
              Session Activity Log ({auditLogs.length})
            </h2>
          </div>
          <span className="font-mono text-[10px] text-candela-secondary uppercase tracking-wider">
            Live Session Actions
          </span>
        </div>

        {auditLogs.length > 0 ? (
          <div className="border border-candela-border overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-candela-surface border-b border-candela-border font-mono text-[10px] uppercase text-candela-secondary tracking-wider">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-candela-border/60 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-candela-surface/40 transition">
                    <td className="py-2.5 px-3 text-candela-secondary whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-candela-surface px-2 py-0.5 border border-candela-border text-candela-accent font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-candela-text whitespace-nowrap">
                      {log.entityType}: {log.entityId}
                    </td>
                    <td className="py-2.5 px-3 text-candela-secondary font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-dashed border-candela-border bg-candela-surface/30 py-8 text-center font-mono text-xs text-candela-secondary">
            No administrative mutations recorded in this session yet.
          </div>
        )}
      </div>
    </div>
  );
}
