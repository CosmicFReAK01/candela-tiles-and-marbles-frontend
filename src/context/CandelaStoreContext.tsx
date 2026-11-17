"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { productService } from "@/services/product.service";
import {
  AdminProduct,
  CategoryCardData,
  HomePageCmsData,
  InspirationProject,
  AuditLogEntry,
  AdminRole,
  VendorCategoryScope,
  EnquiryRecord,
  EnquiryStatus,
  EnquirySubmissionPayload,
} from "@/types";
import {
  STYLE_SHOWCASE,
  MATERIAL_SHOWCASE,
  SHAPE_SHOWCASE,
  COLOUR_SHOWCASE,
  BRAND_SHOWCASE,
  SHOP_SPACES,
  MASTER_SHOP_CATEGORIES,
  DEFAULT_HOMEPAGE_CMS,
  INSPIRATION_PROJECTS,
} from "@/lib/catalogue-taxonomy";

export type CategoryType =
  | "style"
  | "material"
  | "shape"
  | "colour"
  | "brand"
  | "collections"
  | "rooms"
  | "shop";

interface CandelaStoreContextValue {
  products: AdminProduct[];
  homePageCms: HomePageCmsData;
  styleShowcase: CategoryCardData[];
  materialShowcase: CategoryCardData[];
  shapeShowcase: CategoryCardData[];
  colourShowcase: CategoryCardData[];
  brandShowcase: CategoryCardData[];
  collectionsShowcase: CategoryCardData[];
  roomsShowcase: CategoryCardData[];
  shopShowcase: CategoryCardData[];
  isLoaded: boolean;
  error: string | null;
  clearError: () => void;

  // RBAC & Scoping
  activeRole: AdminRole;
  setActiveRole: (role: AdminRole) => void;
  vendorCategoryScope: VendorCategoryScope;
  setVendorCategoryScope: (scope: VendorCategoryScope) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, entityType: string, entityId: string, details: string) => void;

  // Enquiries
  enquiries: EnquiryRecord[];
  updateEnquiryStatus: (id: string, status: EnquiryStatus, advisor?: string) => void;
  updateEnquiry: (id: string, partial: Partial<EnquiryRecord>) => void;
  deleteEnquiry: (id: string) => void;
  createManualEnquiry: (record: EnquiryRecord) => void;
  addEnquiry: (enquiry: EnquirySubmissionPayload) => string;

  // Product mutations
  updateProduct: (id: string, partial: Partial<AdminProduct>) => void;
  addProduct: (product: AdminProduct) => void;
  deleteProduct: (id: string) => void;
  isProductImageUpdated: (product: AdminProduct) => boolean;
  removeUnupdatedImageProducts: () => number;

  // CMS mutations
  updateHomePageCms: (data: Partial<HomePageCmsData>) => void;

  // Inspiration Design Projects
  inspirations: InspirationProject[];
  addInspiration: (item: InspirationProject) => void;
  updateInspiration: (id: string, partial: Partial<InspirationProject>) => void;
  deleteInspiration: (id: string) => void;

  // Category mutations
  updateShowcaseItem: (
    category: CategoryType,
    id: string,
    partial: Partial<CategoryCardData>
  ) => void;
  addShowcaseItem: (category: CategoryType, item: CategoryCardData) => void;
  deleteShowcaseItem: (category: CategoryType, id: string) => void;

  // Reload live Postgres data
  resetToDefaults: () => void;
}

const CandelaStoreContext = createContext<CandelaStoreContextValue | undefined>(undefined);

export function isProductImageUpdated(product: AdminProduct): boolean {
  if (!product) return false;

  const img = product.media?.primaryImage;
  if (!img || typeof img !== "string" || img.trim() === "") return false;
  if (img.includes("placeholder") || img.includes("data:image/svg+xml")) return false;

  if (
    (product.id.startsWith("prod-custom-") ||
      product.name.toLowerCase().includes("new architectural surface")) &&
    img === "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  ) {
    return false;
  }

  return true;
}

const initialBrandCards = (): CategoryCardData[] =>
  BRAND_SHOWCASE.map((b) => ({
    id: b.id,
    title: b.name,
    slug: b.slug,
    description: b.desc,
    imageUrl: b.imageUrl,
    origin: b.origin,
    rating: b.rating,
    tag: b.rating,
  }));

const initialRoomCards = (): CategoryCardData[] =>
  SHOP_SPACES.map((s) => ({
    id: s.id,
    title: s.name,
    slug: s.slug,
    description: s.description,
    imageUrl: s.imageUrl,
    tag: s.tagline,
    itemCount: 12,
  }));

const initialShopCards = (): CategoryCardData[] =>
  MASTER_SHOP_CATEGORIES.map((cat) => ({
    id: cat.id,
    title: cat.name,
    slug: cat.slug,
    description: cat.description,
    imageUrl: cat.imageUrl,
    tag: cat.tagline,
    itemCount: cat.subcategories.length,
  }));

export function CandelaStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [homePageCms, setHomePageCms] = useState<HomePageCmsData>(DEFAULT_HOMEPAGE_CMS);
  const [inspirations, setInspirations] = useState<InspirationProject[]>(INSPIRATION_PROJECTS);
  const [styleShowcase, setStyleShowcase] = useState<CategoryCardData[]>(STYLE_SHOWCASE);
  const [materialShowcase, setMaterialShowcase] = useState<CategoryCardData[]>(MATERIAL_SHOWCASE);
  const [shapeShowcase, setShapeShowcase] = useState<CategoryCardData[]>(SHAPE_SHOWCASE);
  const [colourShowcase, setColourShowcase] = useState<CategoryCardData[]>(COLOUR_SHOWCASE);
  const [brandShowcase, setBrandShowcase] = useState<CategoryCardData[]>(initialBrandCards);
  const [collectionsShowcase, setCollectionsShowcase] = useState<CategoryCardData[]>([]);
  const [roomsShowcase, setRoomsShowcase] = useState<CategoryCardData[]>(initialRoomCards);
  const [shopShowcase, setShopShowcase] = useState<CategoryCardData[]>(initialShopCards);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeRole, setActiveRole] = useState<AdminRole>("super_admin");
  const [vendorCategoryScope, setVendorCategoryScope] = useState<VendorCategoryScope>("all");
  const [isLoaded, setIsLoaded] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchLiveStoreData = useCallback(async (isMountedCheck?: () => boolean) => {
    const alive = () => (isMountedCheck ? isMountedCheck() : true);
    const isAdminRoute =
      typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

    const tasks: Promise<void>[] = [
      productService
        .getProducts({ limit: 100 })
        .then((dbResult) => {
          if (alive() && dbResult?.products) {
            setProducts(dbResult.products);
          }
        })
        .catch((err) => {
          console.warn("Live product fetch notice:", err);
        }),

      fetch("/api/content/homepage", { cache: "no-store" })
        .then(async (res) => {
          if (!res.ok) return;
          const cms = await res.json();
          const hero = cms?.hero;
          const liveCms = cms?.cms;
          if (!alive()) return;
          if (liveCms) {
            setHomePageCms({ ...DEFAULT_HOMEPAGE_CMS, ...liveCms });
          } else if (hero) {
            const extra = hero.extraData || {};
            setHomePageCms({
              ...DEFAULT_HOMEPAGE_CMS,
              ...(extra as HomePageCmsData),
              heroTitle: hero.title || DEFAULT_HOMEPAGE_CMS.heroTitle,
              heroTagline: hero.subtitle || DEFAULT_HOMEPAGE_CMS.heroTagline,
              heroDescription: hero.description || DEFAULT_HOMEPAGE_CMS.heroDescription,
              heroBgImage: hero.imageUrl || DEFAULT_HOMEPAGE_CMS.heroBgImage,
              heroCtaPrimaryText: hero.ctaText || DEFAULT_HOMEPAGE_CMS.heroCtaPrimaryText,
              heroCtaPrimaryUrl: hero.ctaUrl || DEFAULT_HOMEPAGE_CMS.heroCtaPrimaryUrl,
            });
          }
        })
        .catch((err) => {
          console.warn("Homepage CMS fetch notice:", err);
        }),

      fetch("/api/v1/categories", { cache: "no-store" })
        .then(async (res) => {
          if (!res.ok) return;
          const catJson = await res.json();
          if (alive() && Array.isArray(catJson.data) && catJson.data.length > 0) {
            const masterBySlug = new Map(
              MASTER_SHOP_CATEGORIES.map((m) => [m.slug.toLowerCase(), m])
            );
            setShopShowcase(
              catJson.data.map((row: Record<string, unknown>) => {
                const slug = String(row.slug || "");
                const master = masterBySlug.get(slug.toLowerCase());
                return {
                  id: String(row.id),
                  title: String(row.name || master?.name || ""),
                  slug: slug || master?.slug || "",
                  description: String(row.description || master?.description || ""),
                  imageUrl: String(row.image_url || row.imageUrl || master?.imageUrl || ""),
                  tag: master?.tagline || "",
                  itemCount: master?.subcategories.length || 0,
                };
              })
            );
          }
        })
        .catch((err) => {
          console.warn("Live categories fetch notice:", err);
        }),

      fetch("/api/v1/collections", { cache: "no-store" })
        .then(async (res) => {
          if (!res.ok) return;
          const colJson = await res.json();
          if (alive() && Array.isArray(colJson.data)) {
            setCollectionsShowcase(
              colJson.data.map((row: Record<string, unknown>) => ({
                id: String(row.id),
                title: String(row.name || ""),
                slug: String(row.slug || ""),
                description: String(row.description || ""),
                imageUrl: String(row.cover_image_url || ""),
                tag: String(row.tagline || "Curated Archive"),
                itemCount: Number(row.product_count ?? 0),
              }))
            );
          }
        })
        .catch((err) => {
          console.warn("Live collections fetch notice:", err);
        }),
    ];

    if (isAdminRoute) {
      tasks.push(
        fetch("/api/v1/enquiries", { cache: "no-store" })
          .then(async (res) => {
            if (!res.ok) return;
            const enqJson = await res.json();
            if (alive() && Array.isArray(enqJson.data)) {
              setEnquiries(enqJson.data);
            }
          })
          .catch(() => undefined)
      );
    }

    await Promise.allSettled(tasks);
    if (alive()) setIsLoaded(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Retire legacy split-brain browser storage snapshots from older builds
    try {
      localStorage.removeItem("candela_admin_cms_store_v5");
      localStorage.removeItem("candela_admin_cms_store_v4");
      localStorage.removeItem("candela_admin_cms_store_v3");
    } catch {
      // Ignore storage access errors
    }

    fetchLiveStoreData(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [fetchLiveStoreData]);

  const addAuditLog = (
    action: string,
    entityType: string,
    entityId: string,
    details: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user: activeRole === "super_admin" ? "Arjun Yadav" : `Vendor (${vendorCategoryScope})`,
      role: activeRole,
      action,
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  const updateProduct = (id: string, partial: Partial<AdminProduct>) => {
    let updatedItem: AdminProduct | null = null;
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...partial };
          const currentVersions = updated.versions || [];
          const newVersion = {
            version: currentVersions.length + 1,
            updatedAt: new Date().toISOString(),
            updatedBy: activeRole,
            summary: `Updated: ${Object.keys(partial).join(", ")}`,
            snapshot: { ...item },
          };
          updated.versions = [newVersion, ...currentVersions.slice(0, 9)];
          updatedItem = updated;
          return updated;
        }
        return item;
      })
    );

    if (updatedItem) {
      productService.saveProduct(updatedItem, false).catch((err) => {
        console.error("Failed to persist updated product to database API:", err);
      });
    }

    addAuditLog("UPDATE_PRODUCT", "Product", id, `Modified fields: ${Object.keys(partial).join(", ")}`);
  };

  const addProduct = (product: AdminProduct) => {
    const withVersion: AdminProduct = {
      ...product,
      versions: [
        {
          version: 1,
          updatedAt: new Date().toISOString(),
          updatedBy: activeRole,
          summary: "Initial Creation & Publication",
          snapshot: { ...product },
        },
      ],
    };
    setProducts((prev) => [withVersion, ...prev]);

    productService.saveProduct(withVersion, true).catch((err) => {
      console.error("Failed to persist new product to database API:", err);
    });

    addAuditLog("CREATE_PRODUCT", "Product", product.sku || product.id, `Created product "${product.name}"`);
  };

  const deleteProduct = (id: string) => {
    const toDelete = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));

    productService.deleteProduct(id).catch((err) => {
      console.error("Failed to delete product from database API:", err);
    });

    addAuditLog("DELETE_PRODUCT", "Product", id, `Removed product "${toDelete?.name || id}"`);
  };

  const removeUnupdatedImageProducts = () => {
    let count = 0;
    setProducts((prev) =>
      prev.filter((p) => {
        const keep = isProductImageUpdated(p);
        if (!keep) count++;
        return keep;
      })
    );

    productService.purgeUnupdatedProducts().catch((err) => {
      console.error("Failed to bulk-purge un-updated products in database API:", err);
    });

    addAuditLog(
      "CLEANUP_PRODUCTS",
      "Catalogue",
      "Products",
      `Removed items without updated display image`
    );
    return count;
  };

  const updateHomePageCms = (data: Partial<HomePageCmsData>) => {
    setHomePageCms((prev) => ({ ...prev, ...data }));
    addAuditLog("UPDATE_HOMEPAGE_CMS", "Website", "Homepage", `Updated homepage block properties`);
  };

  const showcaseSetters: Record<CategoryType, React.Dispatch<React.SetStateAction<CategoryCardData[]>>> = {
    style: setStyleShowcase,
    material: setMaterialShowcase,
    shape: setShapeShowcase,
    colour: setColourShowcase,
    brand: setBrandShowcase,
    collections: setCollectionsShowcase,
    rooms: setRoomsShowcase,
    shop: setShopShowcase,
  };

  const updateShowcaseItem = (
    category: CategoryType,
    id: string,
    partial: Partial<CategoryCardData>
  ) => {
    const setter = showcaseSetters[category];
    if (setter) {
      setter((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    }
    addAuditLog("UPDATE_CATEGORY_ITEM", category.toUpperCase(), id, `Updated showcase card "${partial.title || id}"`);
  };

  const addShowcaseItem = (category: CategoryType, item: CategoryCardData) => {
    const setter = showcaseSetters[category];
    if (setter) {
      setter((prev) => [item, ...prev]);
    }
    addAuditLog("ADD_CATEGORY_ITEM", category.toUpperCase(), item.id, `Created card "${item.title}"`);
  };

  const deleteShowcaseItem = (category: CategoryType, id: string) => {
    const setter = showcaseSetters[category];
    if (setter) {
      setter((prev) => prev.filter((item) => item.id !== id));
    }
    addAuditLog("DELETE_CATEGORY_ITEM", category.toUpperCase(), id, `Removed card from ${category}`);
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, advisor?: string) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              assignedAdvisor: advisor || e.assignedAdvisor,
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
    addAuditLog("UPDATE_ENQUIRY", "Enquiry", id, `Status updated to ${status}`);
  };

  const updateEnquiry = (id: string, partial: Partial<EnquiryRecord>) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...partial, updatedAt: new Date().toISOString() } : e
      )
    );
    addAuditLog("UPDATE_ENQUIRY_DETAILS", "Enquiry", id, `Updated enquiry for client "${partial.clientName || id}"`);
  };

  const deleteEnquiry = (id: string) => {
    const toDelete = enquiries.find((e) => e.id === id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    addAuditLog("DELETE_ENQUIRY", "Enquiry", id, `Deleted enquiry from "${toDelete?.clientName || id}"`);
  };

  const createManualEnquiry = (record: EnquiryRecord) => {
    setEnquiries((prev) => [record, ...prev]);
    addAuditLog("CREATE_MANUAL_ENQUIRY", "Enquiry", record.referenceCode, `Created manual showroom lead for "${record.clientName}"`);
  };

  const addEnquiry = (payload: EnquirySubmissionPayload): string => {
    const refCode = `CND-ENQ-${Date.now().toString().slice(-6)}`;
    const newEnquiry: EnquiryRecord = {
      ...payload,
      id: `enq-${Date.now()}`,
      referenceCode: refCode,
      status: "RECEIVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedAdvisor: "Bhiwandi Showroom Concierge",
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    addAuditLog("NEW_ENQUIRY", "Enquiry", refCode, `Customer enquiry received from ${payload.clientName}`);

    fetch("/api/v1/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEnquiry),
    }).catch((err) => console.warn("Background PostgreSQL enquiry insert error:", err));

    return refCode;
  };

  const addInspiration = (item: InspirationProject) => {
    setInspirations((prev) => [item, ...prev]);
    addAuditLog("CREATE", "Inspiration", item.id, `Created design inspiration: ${item.title}`);
  };

  const updateInspiration = (id: string, partial: Partial<InspirationProject>) => {
    setInspirations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    addAuditLog("UPDATE", "Inspiration", id, `Updated inspiration project details`);
  };

  const deleteInspiration = (id: string) => {
    setInspirations((prev) => prev.filter((item) => item.id !== id));
    addAuditLog("DELETE", "Inspiration", id, `Deleted inspiration project`);
  };

  const resetToDefaults = () => {
    setStyleShowcase(STYLE_SHOWCASE);
    setMaterialShowcase(MATERIAL_SHOWCASE);
    setShapeShowcase(SHAPE_SHOWCASE);
    setColourShowcase(COLOUR_SHOWCASE);
    setBrandShowcase(initialBrandCards());
    setRoomsShowcase(initialRoomCards());
    setShopShowcase(initialShopCards());
    setInspirations(INSPIRATION_PROJECTS);
    setAuditLogs([]);
    setActiveRole("super_admin");
    setVendorCategoryScope("all");
    fetchLiveStoreData();
  };

  const contextValue = useMemo<CandelaStoreContextValue>(
    () => ({
      products,
      homePageCms,
      styleShowcase,
      materialShowcase,
      shapeShowcase,
      colourShowcase,
      brandShowcase,
      collectionsShowcase,
      roomsShowcase,
      shopShowcase,
      isLoaded,
      error,
      clearError,
      activeRole,
      setActiveRole,
      vendorCategoryScope,
      setVendorCategoryScope,
      auditLogs,
      addAuditLog,
      enquiries,
      updateEnquiryStatus,
      updateEnquiry,
      deleteEnquiry,
      createManualEnquiry,
      addEnquiry,
      updateProduct,
      addProduct,
      deleteProduct,
      isProductImageUpdated,
      removeUnupdatedImageProducts,
      updateHomePageCms,
      inspirations,
      addInspiration,
      updateInspiration,
      deleteInspiration,
      updateShowcaseItem,
      addShowcaseItem,
      deleteShowcaseItem,
      resetToDefaults,
    }),
    [
      products,
      homePageCms,
      styleShowcase,
      materialShowcase,
      shapeShowcase,
      colourShowcase,
      brandShowcase,
      collectionsShowcase,
      roomsShowcase,
      shopShowcase,
      isLoaded,
      error,
      activeRole,
      vendorCategoryScope,
      auditLogs,
      enquiries,
      inspirations,
    ]
  );

  return (
    <CandelaStoreContext.Provider value={contextValue}>
      {children}
    </CandelaStoreContext.Provider>
  );
}

export function useCandelaStore() {
  const context = useContext(CandelaStoreContext);
  if (!context) {
    throw new Error("useCandelaStore must be used within a CandelaStoreProvider");
  }
  return context;
}
