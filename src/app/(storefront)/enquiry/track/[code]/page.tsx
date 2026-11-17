import React from "react";
import Link from "next/link";
import { backendFetch } from "@/lib/backend-client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const STATUS_STEPS = [
  { key: "RECEIVED", label: "Enquiry Logged" },
  { key: "UNDER_REVIEW", label: "Slab Lot Verification" },
  { key: "QUOTATION_SHARED", label: "Trade BOQ Shared" },
  { key: "SAMPLE_DISPATCHED", label: "Physical Sample Box Dispatched" },
  { key: "CONVERTED", label: "Order Reserved" },
];

interface EnquiryTrackResponse {
  reference: string;
  status: string;
  statusUpdatedAt?: string;
  createdAt?: string;
}

export default async function TrackEnquiryPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { token?: string };
}) {
  const cleanCode = decodeURIComponent(params.code || "").trim();
  const token = searchParams.token?.trim();

  const cookieStore = cookies();
  const staffCookie = cookieStore.get("candela_access_token")?.value;

  const headers: Record<string, string> = {};
  if (token) {
    headers["X-Tracking-Token"] = token;
  }
  if (staffCookie) {
    headers["Authorization"] = `Bearer ${staffCookie}`;
  }

  let enquiry: EnquiryTrackResponse | null = null;
  try {
    const res = await backendFetch<{ data?: EnquiryTrackResponse } | EnquiryTrackResponse>(
      `/api/v1/enquiries/track/${encodeURIComponent(cleanCode)}${token ? `?token=${encodeURIComponent(token)}` : ""}`,
      {
        headers,
        timeoutMs: 6000,
      }
    );
    if (res.status === 200 && res.data) {
      enquiry = ((res.data as any).data || res.data) as EnquiryTrackResponse;
    }
  } catch (err) {
    // 404 / 401 / cold start
  }

  if (!enquiry) {
    if (!token) {
      return (
        <div className="mx-auto max-w-md px-6 py-16 text-center space-y-5 border border-candela-border bg-candela-surface my-12">
          <div className="font-mono text-xs text-candela-accent uppercase tracking-widest">
            Secure Verification Required
          </div>
          <h1 className="font-heading text-2xl text-candela-text">Verify Tracking Access</h1>
          <p className="text-xs text-candela-secondary">
            Reference <span className="font-mono font-bold text-candela-text">{cleanCode}</span> requires a secure tracking token to view specification status.
          </p>
          <form method="GET" action={`/enquiry/track/${cleanCode}`} className="space-y-4 pt-2">
            <input
              type="text"
              name="token"
              placeholder="Enter tracking token"
              required
              className="w-full border border-candela-border bg-candela-bg px-4 py-2 text-xs font-mono text-candela-text outline-none focus:border-candela-accent"
            />
            <button
              type="submit"
              className="w-full bg-candela-accent py-2.5 font-mono text-xs uppercase tracking-widest text-white hover:bg-candela-dark transition"
            >
              Verify &amp; Track
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-candela-accent">
          Enquiry Lookup • {cleanCode}
        </span>
        <h1 className="font-heading text-3xl text-candela-text">Enquiry Not Found</h1>
        <p className="text-sm text-candela-secondary">
          We could not find an architectural specification matching reference code{" "}
          <span className="font-mono font-semibold text-candela-text">{cleanCode}</span>, or the supplied tracking credentials were invalid.
        </p>
        <div className="pt-2">
          <Link
            href="/enquiry"
            className="inline-block bg-candela-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-candela-dark transition"
          >
            Submit New Enquiry
          </Link>
        </div>
      </div>
    );
  }

  const currentIdx = Math.max(
    0,
    STATUS_STEPS.findIndex((s) => s.key === enquiry!.status)
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
      <div className="border border-candela-border bg-candela-surface p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-candela-accent uppercase tracking-wider">
            LIVE ENQUIRY TRACKER • {enquiry.reference}
          </span>
          <span className="bg-candela-dark px-3 py-1 font-mono text-xs text-candela-bg uppercase">
            STATUS: {enquiry.status.replace(/_/g, " ")}
          </span>
        </div>

        <div>
          <h1 className="font-heading text-3xl text-candela-text">
            Specification Status: {enquiry.status.replace(/_/g, " ")}
          </h1>
          {enquiry.createdAt && (
            <p className="mt-1 text-xs text-candela-secondary font-mono">
              Logged:{" "}
              {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-5">
          {STATUS_STEPS.map((step, idx) => {
            const done = idx <= currentIdx;
            return (
              <div
                key={step.key}
                className={`border p-3 text-xs ${
                  done
                    ? "border-candela-accent bg-candela-bg text-candela-text"
                    : "border-candela-border bg-candela-surface/50 text-candela-secondary"
                }`}
              >
                <div className="font-mono text-[10px] text-candela-accent">
                  STEP 0{idx + 1}
                </div>
                <div className="mt-1 font-medium">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
