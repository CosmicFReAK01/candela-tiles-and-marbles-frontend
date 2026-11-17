import {
  AdminProduct,
  EnquiryRecord,
  EnquirySubmissionPayload,
  PublicProduct,
} from "@/types";
import { EnquiryStatus } from "@/types";

const API_BASE_URL = "/api/v1";

function mapEnquiryStatus(status?: string): EnquiryStatus {
  switch (status?.toUpperCase()) {
    case "CONTACTED":
      return "UNDER_REVIEW";
    case "QUOTED":
      return "QUOTATION_SHARED";
    case "COMPLETED":
      return "CONVERTED";
    case "CANCELLED":
      return "ARCHIVED";
    default:
      return "RECEIVED";
  }
}

function mapEnquiry(record: Record<string, unknown>): EnquiryRecord {
  return {
    id: String(record.id),
    referenceCode: String(record.referenceCode),
    clientName: String(record.customerName || "Architectural Client"),
    firmOrProjectName: String(record.projectType || ""),
    role: "Architect / Interior Designer",
    phoneWhatsApp: String(record.customerPhone || ""),
    email: record.customerEmail ? String(record.customerEmail) : undefined,
    projectCity: "Mumbai / Navi Mumbai",
    projectTimeline: "1-3 Months",
    notes: record.message ? String(record.message) : undefined,
    items: [],
    status: mapEnquiryStatus(record.status as string),
    createdAt: String(record.createdAt),
    updatedAt: String(record.updatedAt),
  };
}

/**
 * Next.js API client. Next.js Route Handlers backed by Supabase PostgreSQL are the sole backend.
 */
export const candelaApi = {
  async fetchPublicProducts(filters?: {
    category?: string;
    finish?: string;
    search?: string;
  }): Promise<PublicProduct[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "All") {
        params.set("category", filters.category);
      }
      if (filters?.finish && filters.finish !== "All") {
        params.set("finish", filters.finish);
      }
      if (filters?.search) {
        params.set("q", filters.search);
      }
      const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error(`Product service returned ${res.status}`);
      const response = (await res.json()) as { data?: { content?: PublicProduct[] } };
      return response.data?.content ?? [];
    } catch (error) {
      throw error instanceof Error ? error : new Error("Product service unavailable");
    }
  },

  async fetchProductBySlug(slug: string): Promise<PublicProduct | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;
      const response = (await res.json()) as { data?: PublicProduct };
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  async submitEnquiry(
    payload: EnquirySubmissionPayload
  ): Promise<{ referenceCode: string; status: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: payload.clientName,
          customerPhone: payload.phoneWhatsApp,
          customerEmail: payload.email,
          projectType: payload.firmOrProjectName || payload.role,
          quantityArea: payload.items
            .map((item) => `${item.productName}: ${item.effectiveSqft} sq.ft`)
            .join("; "),
          productName: payload.items.map((item) => item.productName).join(", "),
          website: payload.website || "",
          message: [
            payload.notes,
            payload.items.length > 0
              ? `Requested items: ${payload.items
                  .map((item) => `${item.sku} (${item.estimatedBoxes} boxes)`)
                  .join(", ")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      if (!res.ok) throw new Error("The enquiry service is unavailable");
      const response = (await res.json()) as Record<string, unknown>;
      const enquiry = (response.data || response.enquiry || response) as Record<string, unknown>;
      const refCode = String(enquiry.referenceCode || response.referenceCode || `CND-${Date.now().toString().slice(-6)}`);
      return {
        referenceCode: refCode,
        status: mapEnquiryStatus(enquiry.status as string),
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to submit enquiry");
    }
  },

  async trackEnquiry(referenceCode: string): Promise<EnquiryRecord | null> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/enquiries/track/${encodeURIComponent(referenceCode)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return null;
      const response = (await res.json()) as Record<string, unknown>;
      return mapEnquiry((response.data || response) as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  // Admin Console Endpoints (Requires Staff JWT Bearer Token)
  async fetchAdminInventory(jwtToken?: string): Promise<AdminProduct[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Product service returned ${res.status}`);
      const response = (await res.json()) as { data?: { content?: AdminProduct[] } };
      return response.data?.content ?? [];
    } catch (error) {
      throw error instanceof Error ? error : new Error("Admin product service unavailable");
    }
  },
};

/**
 * Formats a multi-product Quote Basket into a structured architectural WhatsApp message
 */
export function buildWhatsAppEnquiryUrl(
  payload: EnquirySubmissionPayload,
  referenceCode?: string
): string {
  const showroomPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917063099602";

  const lines = [
    `*CANDELA TILES & MARBLES — ARCHITECTURAL QUOTE REQUEST*`,
    referenceCode ? `Reference ID: *${referenceCode}*` : null,
    `-----------------------------------------`,
    `*Client:* ${payload.clientName} (${payload.role})`,
    payload.firmOrProjectName ? `*Project / Firm:* ${payload.firmOrProjectName}` : null,
    `*Location:* ${payload.projectCity}`,
    `*Timeline:* ${payload.projectTimeline}`,
    ``,
    `*SELECTED SURFACES (${payload.items.length}):*`,
    ...payload.items.map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}* [${item.sku}]
   • Area: ${item.effectiveSqft} sq.ft (${item.estimatedBoxes} crates/boxes)
   • Application: ${item.applicationNote || "General"}`
    ),
    ``,
    payload.notes ? `*Architectural Notes:* ${payload.notes}` : null,
    `-----------------------------------------`,
    `Please share trade pricing, current lot availability, and slab inspection schedule.`,
  ].filter(Boolean);

  return `https://wa.me/${showroomPhone}?text=${encodeURIComponent(
    lines.join("\n")
  )}`;
}
