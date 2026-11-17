"use client";

import { useState } from "react";
import { useQuoteBasket } from "@/context/ItemCartContext";
import { buildWhatsAppEnquiryUrl, candelaApi } from "@/lib/api";
import { EnquirySubmissionPayload } from "@/types";
import { CheckCircle2, MessageSquare, Send, Trash2 } from "lucide-react";

export default function EnquiryBasketPage() {
  const { items, removeItem, updateItemSqft, totalEffectiveSqft, totalBoxes, clearBasket } =
    useQuoteBasket();

  const [clientName, setClientName] = useState("");
  const [firmOrProjectName, setFirmOrProjectName] = useState("");
  const [role, setRole] = useState<EnquirySubmissionPayload["role"]>(
    "Architect / Interior Designer"
  );
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [email, setEmail] = useState("");
  const [projectCity, setProjectCity] = useState("Mumbai / Navi Mumbai");
  const [projectTimeline, setProjectTimeline] =
    useState<EnquirySubmissionPayload["projectTimeline"]>("1-3 Months");
  const [notes, setNotes] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [lastPayload, setLastPayload] =
    useState<EnquirySubmissionPayload | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");

  const buildPayload = (): EnquirySubmissionPayload => ({
    clientName: clientName || "Architect / Trade Client",
    firmOrProjectName,
    role,
    phoneWhatsApp,
    email,
    projectCity,
    projectTimeline,
    notes,
    website,
    items: items.map((i) => ({
      productId: i.product.id,
      sku: i.product.sku,
      productName: i.product.name,
      requestedSqft: i.requestedSqft,
      effectiveSqft: i.effectiveSqft,
      estimatedBoxes: i.estimatedBoxes,
      applicationNote: i.applicationNote || "General Area",
    })),
  });

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const payload = buildPayload();
    try {
      setSubmitError(null);
      const res = await candelaApi.submitEnquiry(payload);
      setLastPayload(payload);
      setSubmittedRef(res.referenceCode);
      clearBasket();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your enquiry. Please try again."
      );
    }
  };

  if (submittedRef && lastPayload) {
    const waUrl = buildWhatsAppEnquiryUrl(lastPayload, submittedRef);
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="border border-candela-accent bg-candela-surface p-8 space-y-6">
          <div className="flex items-center gap-3 text-candela-accent">
            <CheckCircle2 className="h-7 w-7" />
            <span className="font-mono text-xs uppercase tracking-widest">
              ENQUIRY REGISTERED WITH CANDELA QUOTE SERVICE
            </span>
          </div>
          <h1 className="font-heading text-4xl text-candela-text">
            Quote Reference:{" "}
            <span className="font-mono text-candela-accent">{submittedRef}</span>
          </h1>
          <p className="text-sm text-candela-secondary leading-relaxed">
            Your multi-surface specification has been logged in our Enquiry Service. Our Senior Architectural Consultant will prepare your trade BOQ and slab lot photographs. You can also launch an instant WhatsApp thread with this reference code below.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-candela-accent px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-candela-dark"
            >
              <MessageSquare className="h-4 w-4" />
              Send Structured BOQ via WhatsApp
            </a>
            <a
              href={`/enquiry/track/${submittedRef}`}
              className="border border-candela-border bg-candela-bg px-6 py-3.5 font-mono text-xs uppercase text-candela-text hover:border-candela-accent"
            >
              Track Live Quote Status →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="border-b border-candela-border pb-6 mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-candela-accent">
          MULTI-SURFACE SPECIFICATION & BOQ DESK
        </span>
        <h1 className="mt-1 font-heading text-4xl text-candela-text">
          Project Quote Basket & Trade Enquiry
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left 7 Cols: Selected Slabs & Sq.Ft Adjustments */}
        <div className="lg:col-span-7 space-y-4">
          {items.length === 0 ? (
            <div className="border border-dashed border-candela-border bg-candela-surface p-12 text-center space-y-3">
              <p className="font-heading text-2xl text-candela-text">
                Your Project Basket is Empty
              </p>
              <p className="text-xs text-candela-secondary">
                Add imported marbles or sintered slabs from our surface catalog to build your project BOQ.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="border border-candela-border bg-candela-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="font-mono text-xs text-candela-secondary">
                    {item.product.sku} • {item.product.dimensionsMm}
                  </span>
                  <h3 className="font-heading text-2xl font-semibold text-candela-text">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-candela-secondary">
                    Zone: {item.applicationNote} • Coverage: {item.product.sqftPerBox} sq.ft/slab
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-candela-secondary">
                      Net Area (Sq.Ft)
                    </label>
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={item.requestedSqft}
                      onChange={(e) =>
                        updateItemSqft(
                          item.product.id,
                          Number(e.target.value),
                          item.includeWastage10Percent
                        )
                      }
                      className="mt-1 w-24 border border-candela-border bg-candela-bg px-2.5 py-1.5 font-mono text-xs"
                    />
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-semibold text-candela-accent">
                      {item.effectiveSqft} sq.ft
                    </div>
                    <div className="text-[11px] text-candela-secondary">
                      {item.estimatedBoxes} Slabs
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-candela-secondary hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="border border-candela-border bg-candela-bg p-4 flex justify-between items-center font-mono text-xs">
            <span>CONSOLIDATED PROJECT REQUIREMENT:</span>
            <span className="text-sm font-semibold text-candela-accent">
              {totalEffectiveSqft} Sq.Ft ({totalBoxes} Slabs / Crates)
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Architect / Client Submission Form */}
        {submitError && (
          <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {submitError}
          </p>
        )}

        <form
          onSubmit={handleSubmitQuote}
          className="lg:col-span-5 border border-candela-border bg-candela-surface p-6 space-y-4"
        >
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="basket-website">Leave blank</label>
            <input
              id="basket-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-candela-text">
            Request Trade Quotation
          </h2>
          <div>
            <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
              Your Name *
            </label>
            <input
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., Ar. Meera Deshmukh"
              className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                Profile / Role *
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as EnquirySubmissionPayload["role"])
                }
                className="w-full border border-candela-border bg-candela-bg px-3 py-2.5 text-sm"
              >
                <option value="Architect / Interior Designer">
                  Architect / Interior Designer
                </option>
                <option value="Homeowner">Homeowner</option>
                <option value="Builder / Developer">Builder / Developer</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
                WhatsApp Number *
              </label>
              <input
                required
                value={phoneWhatsApp}
                onChange={(e) => setPhoneWhatsApp(e.target.value)}
                placeholder="+91 98201 XXXXX"
                className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
              Firm / Project Name
            </label>
            <input
              value={firmOrProjectName}
              onChange={(e) => setFirmOrProjectName(e.target.value)}
              placeholder="e.g., Studio Verve — Worli Penthouse"
              className="w-full border border-candela-border bg-candela-bg px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-candela-secondary mb-1">
              Architectural Notes (Bookmatching / Dry-Lay / Cut-to-Size)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-candela-border bg-candela-bg px-3.5 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-candela-accent px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-candela-dark disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            Submit Consolidated Quote Request
          </button>
        </form>
      </div>
    </div>
  );
}
