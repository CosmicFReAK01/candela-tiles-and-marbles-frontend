export type MasterCategory =
  | "Tiles"
  | "Marbles"
  | "Kitchen"
  | "Bathroom"
  | "Sanitaryware"
  | "Faucets"
  | "Showers"
  | "Hardware"
  | "Wellness & Spa"
  | "Bathroom Accessories";

export type MaterialCategory =
  | "Italian Marble"
  | "Sintered Stone"
  | "Porcelain Slab"
  | "Onyx & Quartzite"
  | "Travertine"
  | "Ceramic"
  | "Natural Stone"
  | "Quartz"
  | "Terrazzo"
  | "Brass & Chrome"
  | "Vitreous China"
  | "Stainless Steel"
  | "Stainless Steel SS-304"
  | "Solid Brass"
  | "Vanity Console"
  | "Mineral Composite"
  | "Lucite Acrylic & Mineral Resin"
  | (string & {});

export type SurfaceFinish =
  | "Bookmatched Polished"
  | "Silk Honed"
  | "Natural Matte"
  | "Leathered"
  | "Fluted Architectural"
  | "Matte"
  | "Glossy"
  | "Polished"
  | "Textured"
  | "Velvet Satin Touch"
  | "Nano PVD Gunmetal"
  | "Brushed Warm Bronze PVD"
  | "Fluted Natural Oak & Statuario Top"
  | "Velvety Matte Silk White"
  | "Gloss Alpine White with Brushed Bronze Accents"
  | (string & {});

export type ApplicationArea =
  | "Flooring"
  | "Floor"
  | "Feature Wall"
  | "Wall"
  | "Countertop"
  | "Facade"
  | "Bathroom Sanctuary"
  | "Bathroom"
  | "Kitchen"
  | "Kitchen Countertops"
  | "Wall Cladding"
  | "Living Room"
  | "Outdoor"
  | "Commercial Space"
  | "Commercial"
  | (string & {});

export type RoomCategory =
  | "Living Room"
  | "Bedroom"
  | "Bathroom"
  | "Kitchen"
  | "Balcony"
  | "Outdoor"
  | "Commercial";

export type StyleCategory =
  | "Modern"
  | "Minimal"
  | "Luxury"
  | "Classic"
  | "Industrial"
  | "Natural";

export interface FilterOption {
  key: string;
  label: string;
  type: "multi_select" | "single_select" | "range" | "boolean";
  values: string[];
}

export interface CategoryFilterConfig {
  categorySlug: string;
  categoryName: string;
  filters: FilterOption[];
}

export interface ProductMediaConfig {
  primaryImage: string;
  galleryImages: string[];
  /** Dedicated Multi-Angle View Images (Editable by Admin) */
  bookmatchImage?: string; // Bookmatch Quad / A+B Quad
  architecturalImage?: string; // Architectural / Kitchen Waterfall
  macroImage?: string; // Macro Vein Detail / 4X Zoom
  edgeImage?: string; // Edge Profile (20mm Mitred Edge / 8mm Edge)
  /** Additional custom view angles configured by admin */
  customViews?: {
    id: string;
    title: string;
    badge: string;
    imageUrl: string;
    desc?: string;
  }[];
  /** Optional 3D GLB model stored in Supabase Storage */
  glbModelUrl?: string | null;
  /** Optional 360-degree turntable frame sequence URLs in Supabase Storage */
  frames360Urls?: string[];
  /** Surface roughness (0.05 = mirror polished, 0.65 = matte) for 3D viewer lighting */
  roughness?: number;
  veinColorHex?: string;
  baseColorHex?: string;
}

/**
 * Public Storefront Product DTO
 */
export interface PublicProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  collectionName: string;
  collectionSlug: string;
  masterCategory?: MasterCategory;
  subcategory?: string;
  /** Multi-category assignment: An item can belong to multiple master categories */
  categories?: string[];
  /** Multi-family / subcategory tags: An item can belong to multiple subcategories */
  subcategories?: string[];
  /** Multi-collection assignment: An item can belong to multiple collections */
  collectionSlugs?: string[];
  /** Multi-colour assignment */
  colours?: string[];
  category: MaterialCategory;
  finish: SurfaceFinish;
  origin: string;
  dimensionsMm: string; // e.g., "1600 x 3200 mm", "600 x 1200 mm"
  thicknessMm: number;  // e.g., 12, 18, 20
  sqftPerBox: number;   // Coverage per box/slab crate
  piecesPerBox: number;
  applications: ApplicationArea[];
  rooms?: RoomCategory[];
  shortDescription: string;
  architecturalNotes: string;
  inStock: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  style?: string;       // e.g., "Marble Look Tile", "Travertine Look Tile", "Modern"
  colour?: string;      // e.g., "Bianco", "Gold", "Bronze", "White", "Beige"
  shape?: string;       // e.g., "Large Slab", "Rectangle", "Square", "Hexagon"
  material?: string;    // e.g., "Italian Marble", "Sintered Stone", "Porcelain"
  brand?: string;       // e.g., "Kajaria Ceramics", "Hindware Italian Collection"
  mountType?: string;   // For bathware / faucets (e.g. "Wall Mount", "Deck Mount")
  flushType?: string;   // For sanitaryware
  waterFlow?: string;   // For showers
  pricePerSqftInr: number; // Actual customer price per sq.ft / unit
  dealerPricePerSqftInr?: number; // Dealer wholesale rate
  /** Available Stock in Sq.Ft */
  stockSqftAvailable?: number;    // Available stock in showroom/warehouse
  /** Available Stock in Units / Pcs / Boxes / Slabs */
  stockUnitsAvailable?: number;   // Available stock in distinct unit quantity
  lowStockThresholdSqft?: number;
  warehouseZone?: string;         // e.g., "Bhiwandi Slab Yard — Bay A2"
  dealerNotes?: string;
  lastRestockedAt?: string;
  media: ProductMediaConfig;
  specs: {
    // Surface & Material Specs
    waterAbsorption?: string;
    slipResistance?: string;
    stainResistance?: string;
    mohsHardness?: string;
    warrantyYears?: string;
    breakingStrength?: string;
    chemicalResistance?: string;
    edgeProfile?: string;

    // Kitchen Specifications
    heatResistance?: string;
    foodGradeSafety?: string;
    scratchResistance?: string;
    acidImmunity?: string;
    sinkBowlConfig?: string;
    spoutReach?: string;

    // Bathroom Specifications
    wetDryZoneRating?: string;
    antiBacterialGlaze?: string;
    flushTechnology?: string;
    trapDistance?: string;
    cabinetMaterial?: string;
    mirrorLighting?: string;

    // Faucets & Showers Specifics
    cartridgeType?: string;
    operatingPressureBar?: string;
    flowRateLpm?: string;
    bodyMaterial?: string;

    // Hardware & Wellness Specifics
    cycleTestRating?: string;
    fireRating?: string;
    jetCount?: string;

    // Dynamic Custom Specs Key-Value List
    customSpecs?: { label: string; value: string }[];
  };
}

export interface Product360Config {
  enabled: boolean;
  frames: { index: number; url: string }[];
  settings: {
    autoRotate: boolean;
    rotationSpeed: number;
    direction: "clockwise" | "counterclockwise";
  };
}

export interface ProductVisualizerConfig {
  enabled: boolean;
  texture: string;
  previewTexture?: string;
  normalMap?: string;
  roughnessMap?: string;
  resolution?: { width: number; height: number };
}

export interface ProductVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  summary: string;
  snapshot: Partial<AdminProduct>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export type AdminRole =
  | "super_admin"
  | "admin"
  | "catalogue_manager"
  | "inventory_manager"
  | "content_manager"
  | "enquiry_manager"
  | "vendor";

export type VendorCategoryScope =
  | "all"
  | "Tiles"
  | "Marbles"
  | "Kitchen"
  | "Bathroom"
  | "Sanitaryware"
  | "Faucets"
  | "Showers"
  | "Hardware"
  | "Wellness & Spa";

/**
 * Admin Product DTO
 */
export interface AdminProduct extends PublicProduct {
  version?: number;
  pricePerSqftInr: number;
  dealerPricePerSqftInr?: number;
  stockSqftAvailable?: number;
  stockUnitsAvailable?: number;
  lowStockThresholdSqft?: number;
  warehouseZone?: string;
  lastRestockedAt?: string;
  status?: "published" | "draft" | "review";
  viewer360?: Product360Config;
  visualizerAssets?: ProductVisualizerConfig;
  versions?: ProductVersion[];
  isImageUpdated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Homepage CMS Editable Data
 * Allows full control of all visible text, images, and section visibility toggles
 */
export interface HomePageCmsData {
  // Hero & Announcement
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  heroBgImage: string;
  heroCtaPrimaryText?: string;
  heroCtaPrimaryUrl?: string;
  heroCtaSecondaryText?: string;
  heroCtaSecondaryUrl?: string;
  announcementText: string;
  featuredLotId: string;

  // Contact Details
  phone?: string;
  email?: string;
  bhiwandiAddress?: string;
  naviMumbaiAddress?: string;
  openingHours?: string;

  // Section Visibility Toggles
  showHero?: boolean;
  showAnnouncement?: boolean;
  showCategories?: boolean;
  showCollections?: boolean;
  showSpaces?: boolean;
  showVisualizer?: boolean;
  showNewArrivals?: boolean;
  showInspiration?: boolean;
  showSpotlight?: boolean;
  showWhyCandela?: boolean;
  showEnquiry?: boolean;

  // Section Headers & Copy
  categoriesEyebrow?: string;
  categoriesTitle?: string;
  collectionsEyebrow?: string;
  collectionsTitle?: string;
  spacesEyebrow?: string;
  spacesTitle?: string;
  visualizerEyebrow?: string;
  visualizerTitle?: string;
  visualizerDescription?: string;
  visualizerImage?: string;
  visualizerBullets?: string[];
  newArrivalsEyebrow?: string;
  newArrivalsTitle?: string;
  inspirationEyebrow?: string;
  inspirationTitle?: string;
  spotlightEyebrow?: string;
  spotlightTitle?: string;
  spotlightDescription?: string;
  spotlightImage?: string;
  spotlightOrigin?: string;
  spotlightDimensions?: string;
  spotlightFinish?: string;
  spotlightPrice?: string;
  whyCandelaEyebrow?: string;
  whyCandelaTitle?: string;
  whyCandelaDescription?: string;
  whyCandelaPillars?: {
    id?: string;
    title: string;
    desc?: string;
    description?: string;
    icon?: string;
  }[];
  enquiryEyebrow?: string;
  enquiryTitle?: string;
  enquiryDescription?: string;
}



/**
 * Inspiration Design Project for Visual Design Ideas
 */
export interface InspirationProject {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  imageUrl: string;
  productsUsed: string[];
}

/**
 * Generic Category Card for CMS
 */
export interface CategoryShowcaseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount?: number;
  tag?: string;
  origin?: string;
  rating?: string;
}

/**
 * ItemCart Item for customers
 */
export interface CartItem {
  product: PublicProduct;
  quantity: number;
  requestedSqft: number;
  includeWastage10Percent: boolean;
  effectiveSqft: number;
  estimatedBoxes: number;
  applicationNote?: string;
  addedAt: string;
}

/**
 * Backwards compatibility alias for basket
 */
export type QuoteBasketItem = CartItem;

export type EnquiryStatus =
  | "RECEIVED"
  | "UNDER_REVIEW"
  | "QUOTATION_SHARED"
  | "SAMPLE_DISPATCHED"
  | "CONVERTED"
  | "ARCHIVED";

export interface EnquirySubmissionPayload {
  clientName: string;
  firmOrProjectName?: string;
  role: "Architect / Interior Designer" | "Homeowner" | "Builder / Developer" | "Contractor";
  phoneWhatsApp: string;
  email?: string;
  projectCity: string;
  projectTimeline: "Immediate (0-30 Days)" | "1-3 Months" | "3-6 Months" | "Specification Stage";
  notes?: string;
  website?: string; // Bot honeypot field (must remain empty)
  items: {
    productId: string;
    sku: string;
    productName: string;
    requestedSqft: number;
    effectiveSqft: number;
    estimatedBoxes: number;
    applicationNote: string;
  }[];
}

export interface EnquiryRecord extends EnquirySubmissionPayload {
  id: string;
  referenceCode: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  assignedAdvisor?: string;
}

export interface CategoryCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount?: number;
  tag?: string;
  origin?: string;
  rating?: string;
}

/**
 * Standardized REST API Response Contract
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  meta?: {
    totalItems?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

/**
 * Media Asset Entity for Central Digital Asset Registry
 */
export interface MediaAsset {
  id: string;
  fileName: string;
  originalName?: string;
  url: string;
  thumbnailUrl?: string;
  sourceType: "UPLOAD" | "EXTERNAL_URL" | "PBR_MAP";
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  altText?: string;
  categoryScope?: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}
