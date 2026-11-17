# Candela Tiles & Marbles — Storefront & Atelier Backoffice

> Architectural Surfaces Atelier & Trade Backoffice — Built with Next.js 14 (App Router), React Server Components (RSC), Tailwind CSS, and TypeScript.

---

## 🏛️ Architectural Overview

The frontend serves as the customer-facing luxury digital atelier and the staff trade backoffice. It bridges directly to the **Spring Boot Modular Monolith** backend via an authenticated gateway layer, providing server-rendered pages with sub-second TTFB, edge-cached catalogue navigation, and resilient fallback handling.

```
                           HTTPS (End-User Browser)
                                      │
                         ┌────────────▼────────────┐
                         │   Vercel / Cloudflare   │
                         │    Edge Network CDN     │
                         └────────────┬────────────┘
                                      │
                   ┌──────────────────▼──────────────────┐
                   │    Next.js 14 App Router Runtime    │
                   │                                     │
                   │  ┌───────────────────────────────┐  │
                   │  │ Edge Middleware (JWT & RBAC)  │  │
                   │  └───────────────┬───────────────┘  │
                   │                  │                  │
                   │  ┌───────────────┴───────────────┐  │
                   │  │ Storefront Pages (RSC / SSR)  │  │
                   │  │ • Hero Showcase & Collections │  │
                   │  │ • Product Deep-Dive & Slugs   │  │
                   │  │ • Live Enquiry Order Tracker  │  │
                   │  └───────────────┬───────────────┘  │
                   │                  │                  │
                   │  ┌───────────────┴───────────────┐  │
                   │  │ Admin Console ((admin)/admin) │  │
                   │  │ • Catalogue & CMS Builder     │  │
                   │  │ • Inventory & Price Control   │  │
                   │  │ • Sales & Enquiries Workflow  │  │
                   │  └───────────────┬───────────────┘  │
                   │                  │                  │
                   │  ┌───────────────┴───────────────┐  │
                   │  │ Gateway Proxy Bridge Layer    │  │
                   │  │ (`lib/backend-client.ts`)     │  │
                   │  └───────────────┬───────────────┘  │
                   └──────────────────┼──────────────────┘
                                      │
                   HTTP (REST / Auth / Multipart Uploads)
                                      │
                   ┌──────────────────▼──────────────────┐
                   │     Spring Boot Modular Monolith    │
                   │      (`candela-tiles-and-marbles    │
                   │               -backend`)            │
                   └─────────────────────────────────────┘
```

---

## ✨ Key Capabilities

### 💎 Customer Storefront
- **Dynamic Catalogue Taxonomy:** Hierarchical exploration across Material (`Marble`, `Onyx`, `Granite`), Finish (`Polished`, `Honed`), Shape, Brand, and Curated Collections.
- **High-Definition Surface Viewer:** High-resolution texture zoom, bookmatch pattern previews, and multi-angle product photography.
- **Surface Coverage Calculator:** Real-time square-footage and box/crate estimator for residential and commercial flooring.
- **Privacy-First Live Enquiry Tracker:** PII-scrubbed order tracking using reference codes and cryptographically hashed secret tokens.
- **Interactive Baskets:** Trade Quote Request Drawer, Wishlist persistence, and side-by-side spec comparison.

### 🛡️ Atelier Admin Console (`/admin`)
- **Role-Based Access Control (RBAC):** Granular permissions for `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`, and `SHOWROOM_ADVISOR`.
- **Catalogue & Product Editor:** Full product identity management, technical specification tables, price rules, and versioned publishing.
- **Inventory Control:** Warehouse stock adjustments with optimistic concurrency guards.
- **Visual CMS Builder:** Live homepage banner configuration and curated editorial collections.
- **Media Asset Manager:** Direct upload pipeline with file validation and public asset indexing.

---

## 🌉 Backend Gateway Bridge (`backend-client.ts`)

All API mutations and dynamic lookups route through the gateway proxy bridge:
- **Cookie & Token Forwarding:** Transparently forwards `candela_access_token` cookies and `Bearer` headers to the Java monolith.
- **Client IP Attribution:** Injects client IP headers (`X-Forwarded-For`) to preserve backend rate limiting.
- **Multipart Stream Handling:** Buffers and pipes media asset binary uploads directly to the backend without truncation.
- **Fault Tolerance:** Enforces configurable 10-second request timeouts and injects provenance headers (`X-Handled-By: Spring-Boot-Modular-Monolith`).

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` for local execution or configure in Vercel:

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `BACKEND_URL` | **Yes (Prod)** | `http://localhost:8080` | URL of the Spring Boot monolith backend |
| `NEXT_PUBLIC_SITE_URL` | No | `http://localhost:3000` | Canonical public URL of the web application |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | — | Concierge WhatsApp contact number |
| `NEXT_PUBLIC_CONCIERGE_PHONE` | No | — | Dedicated concierge inquiry telephone line |
| `NEXT_PUBLIC_CONCIERGE_EMAIL` | No | — | Public concierge contact email address |
| `NEXT_PUBLIC_SUPABASE_URL` | No | — | Supabase project URL for object storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | — | Supabase public anonymous API key |
| `SUPABASE_STORAGE_BUCKET` | No | `candela-media` | Object storage bucket for textures and media |

---

## 🛠️ Development & Tooling

### Prerequisites
- **Node.js 20+**
- **npm** or **pnpm**

### Local Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure local environment
cp .env.example .env.local

# 3. Start development server
npm run dev
```

### Build for Production
```bash
# Compile and optimize production Next.js bundle
npm run build

# Start production server
npm start
```

### Security & Static Analysis Audit
```bash
# Execute OWASP ASVS v4.0.3 compliance scanner
node scripts/security-scan.js
```
