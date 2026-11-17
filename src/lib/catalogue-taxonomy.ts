import { CategoryCardData, HomePageCmsData, MasterCategory, FilterOption } from "@/types";

export const DEFAULT_HOMEPAGE_CMS: HomePageCmsData = {
  heroTagline: "Tiles • Marble • Bathware • Hardware",
  heroTitle: "Premium Surfaces. Thoughtfully Selected.",
  heroDescription:
    "Curated imported Italian marble slabs, sintered stone, architectural porcelain, luxury sanitaryware, faucets, and hardware. Explore interactive 3D/360° surfaces and request a bespoke project quote.",
  heroBgImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
  heroCtaPrimaryText: "Explore Collection",
  heroCtaPrimaryUrl: "/shop",
  heroCtaSecondaryText: "Visit Showroom",
  heroCtaSecondaryUrl: "/contact",
  featuredLotId: "prod-01",
  announcementText: "Bhiwandi Slab Gallery & Navi Mumbai Experience Centre • Dry-Lay Inspection Available",
  phone: "+91 70630 99602",
  email: "candelafuture10@gmail.com",
  bhiwandiAddress: "Plot 14, Architectural Stone Hub, Mumbai-Nashik Highway, Bhiwandi.",
  naviMumbaiAddress: "Plot 22, MIDC Industrial Area, Turbhe, Navi Mumbai.",
  openingHours: "Mon – Sat: 10:00 AM – 7:30 PM (Sun by Appointment)",

  // Visibility Toggles
  showHero: true,
  showAnnouncement: true,
  showCategories: true,
  showCollections: true,
  showSpaces: true,
  showVisualizer: true,
  showNewArrivals: true,
  showInspiration: true,
  showSpotlight: true,
  showWhyCandela: true,
  showEnquiry: true,

  // Section Headers & Copy
  categoriesEyebrow: "Core Catalogue",
  categoriesTitle: "Shop by Category",
  collectionsEyebrow: "Curated Architecture",
  collectionsTitle: "Featured Collections",
  spacesEyebrow: "Spatial Application",
  spacesTitle: "Shop by Space",
  visualizerEyebrow: "Interactive 360° Studio & Inspiration",
  visualizerTitle: "Inspect Quarry Slabs with Full 360° Drag & Rotate",
  visualizerDescription:
    "Examine natural stone in continuous 360° turntable spin: inspect the polished front face, calibrated 20mm edge profile, and authentic quarry fiberglass reinforcing mesh before requesting your project quote.",
  visualizerImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  visualizerBullets: [
    "Interactive 360° drag rotation with angle readout & auto-spin",
    "Multi-view gallery: 4-piece bookmatch quad, macro veins & edge detailing",
    "Browse curated architectural inspiration spaces and requested BOQ specs",
  ],
  newArrivalsEyebrow: "2026 Quarry Shipments",
  newArrivalsTitle: "New Arrivals",
  inspirationEyebrow: "Realized Works",
  inspirationTitle: "Inspiration & Projects",
  spotlightEyebrow: "Exclusive Quarry Lot",
  spotlightTitle: "Calacatta Viola Riserva",
  spotlightDescription:
    "Dramatic brecciated cabernet-violet veining across a warm ivory crystalline ground, quarry-selected for mirror-matched wall installations.",
  spotlightImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  spotlightOrigin: "Carrara, Italy",
  spotlightDimensions: "1600 x 3200 mm",
  spotlightFinish: "Bookmatched Polished",
  spotlightPrice: "₹1,450",
  whyCandelaEyebrow: "Architectural Standard",
  whyCandelaTitle: "Why Candela Tiles & Marbles",
  whyCandelaDescription:
    "We bridge European stone quarries and premier Indian manufacturing with hands-on architectural advisory.",
  whyCandelaPillars: [
    {
      id: "pillar-1",
      title: "Direct Quarry Inspection",
      desc: "Every lot of marble and travertine is hand-inspected in Carrara, Tivoli, and Verona for consistent veining density before container loading.",
      icon: "Compass",
    },
    {
      id: "pillar-2",
      title: "Dry-Lay Verification",
      desc: "We mock-up sequential bookmatched slabs in our Bhiwandi slab yard, allowing architects to approve exact vein intersections prior to site cutting.",
      icon: "Building2",
    },
    {
      id: "pillar-3",
      title: "Technical Surface Precision",
      desc: "Full physical test data (water absorption, slip rating R9–R11, Mohs hardness) provided transparently with every architectural quotation.",
      icon: "Shield",
    },
    {
      id: "pillar-4",
      title: "Dedicated Trade Desk",
      desc: "Rapid BOQ estimation, sample delivery to your studio within 48 hours in Mumbai/Pune, and continuous WhatsApp project tracking.",
      icon: "MessageCircle",
    },
  ],
};

/**
 * Master Shop Categories Taxonomy
 */
export interface ShopCategoryItem {
  id: string;
  name: MasterCategory;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
  subcategories: { name: string; slug: string; description?: string }[];
}

export const MASTER_SHOP_CATEGORIES: ShopCategoryItem[] = [
  {
    id: "cat-tiles",
    name: "Tiles",
    slug: "tiles",
    tagline: "High-Performance Architectural Flooring & Wall Surfaces",
    description: "Full-body porcelain, glazed vitrified tiles, large-format slabs, and anti-skid surfaces engineered for residential and commercial resilience.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Floor Tiles", slug: "floor-tiles" },
      { name: "Wall Tiles", slug: "wall-tiles" },
      { name: "Bathroom Tiles", slug: "bathroom-tiles" },
      { name: "Kitchen Tiles", slug: "kitchen-tiles" },
      { name: "Outdoor Tiles", slug: "outdoor-tiles" },
      { name: "Large Format Tiles", slug: "large-format-tiles" },
      { name: "Designer Tiles", slug: "designer-tiles" },
      { name: "Anti-Skid Tiles", slug: "anti-skid-tiles" },
    ],
  },
  {
    id: "cat-marbles",
    name: "Marbles",
    slug: "marbles",
    tagline: "Direct Italian & European Quarry Monolithic Slabs",
    description: "Quarry-selected natural marble bundles, bookmatched Italian Statuario, Calacatta Viola, Travertino, and exotic onyx slabs.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Natural Marble", slug: "natural-marble" },
      { name: "Imported Marble", slug: "imported-marble" },
      { name: "White Marble", slug: "white-marble" },
      { name: "Beige Marble", slug: "beige-marble" },
      { name: "Black Marble", slug: "black-marble" },
      { name: "Premium Marble", slug: "premium-marble" },
    ],
  },
  {
    id: "cat-sanitaryware",
    name: "Sanitaryware",
    slug: "sanitaryware",
    tagline: "Architectural Ceramic Sanctuaries & Minimalist Basins",
    description: "Rimless wall-hung WCs, monolithic freestanding stone basins, countertop vessel sinks, and water-efficient sanitaryware.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Toilets / WCs", slug: "toilets-wcs" },
      { name: "Wash Basins", slug: "wash-basins" },
      { name: "Urinals", slug: "urinals" },
      { name: "Other Sanitaryware", slug: "other-sanitaryware" },
    ],
  },
  {
    id: "cat-faucets",
    name: "Faucets",
    slug: "faucets",
    tagline: "Precision Lead-Free Brass Mixers & Concealed Spouts",
    description: "Tall basin mixers, wall-mounted concealed spouts, and thermostatic controls in brushed bronze, matte black, and warm gold.",
    imageUrl: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Tall Basin Mixers", slug: "tall-basin-mixers" },
      { name: "Wall-Mount Spouts", slug: "wall-mount-spouts" },
      { name: "Bath Mixers", slug: "bath-mixers" },
      { name: "Kitchen Faucets", slug: "kitchen-faucets" },
    ],
  },
  {
    id: "cat-showers",
    name: "Showers",
    slug: "showers",
    tagline: "Immersive Hydrotherapy Rainfall Systems",
    description: "Ceiling-recessed rain and waterfall heads, thermostatic multi-way concealed diverters, and body mist jets.",
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Rain Showers", slug: "rain-showers" },
      { name: "Thermostatic Systems", slug: "thermostatic-systems" },
      { name: "Hand Showers", slug: "hand-showers" },
      { name: "Shower Panels", slug: "shower-panels" },
    ],
  },
  {
    id: "cat-hardware",
    name: "Hardware",
    slug: "hardware",
    tagline: "Solid Brass Architectural Handles & Precision Fittings",
    description: "Diamond-knurled solid brass door levers, linear kitchen pull bars, concealed architectural hinges, and sliding hardware.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Door Hardware", slug: "door-hardware" },
      { name: "Bathroom Hardware", slug: "bathroom-hardware" },
      { name: "Kitchen Hardware", slug: "kitchen-hardware" },
      { name: "Fittings", slug: "fittings" },
      { name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: "cat-accessories",
    name: "Bathroom Accessories",
    slug: "bathroom-accessories",
    tagline: "Curated Metalwork & Sculptural Accents",
    description: "Solid brass towel rails, minimalist robe hooks, backlit architectural vanity mirrors, and luxury soap dispensers.",
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    subcategories: [
      { name: "Towel Rails", slug: "towel-rails" },
      { name: "Robe Hooks", slug: "robe-hooks" },
      { name: "Paper Holders", slug: "paper-holders" },
      { name: "Vanity Mirrors", slug: "vanity-mirrors" },
    ],
  },
];

/**
 * Curated Collections
 */

export const SHOP_SPACES = [
  {
    id: "space-living",
    slug: "living-room",
    name: "Living Room",
    tagline: "Bookmatched focal marble & large format vitrified slabs",
    description: "Create expansive, seamless flooring and double-height TV / fire feature walls.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "space-bathroom",
    slug: "bathroom",
    name: "Bathroom",
    tagline: "High-slip resistance floors, bookmatched shower slabs & sanitaryware",
    description: "Transform private master suites into spa sanctuaries with non-porous stones and concealed brassware.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "space-kitchen",
    slug: "kitchen",
    name: "Kitchen",
    tagline: "Thermal-shock proof sintered islands & architectural backsplashes",
    description: "High-density surfaces resistant to lemon juice, hot pans, knives, and turmeric staining.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "space-bedroom",
    slug: "bedroom",
    name: "Bedroom",
    tagline: "Acoustic wood planks & warm silk-honed architectural stones",
    description: "Calming tactile textures and warm earth tones for peaceful restful retreats.",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "space-outdoor",
    slug: "outdoor",
    name: "Outdoor",
    tagline: "20mm thick frost-proof, UV-stable exterior porcelain pavers",
    description: "Anti-slip R11 driveways, pool decks, balconies, and ventilated facade systems.",
    imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "space-commercial",
    slug: "commercial",
    name: "Commercial",
    tagline: "High-traffic vitrified bodies for grand lobbies and luxury retail",
    description: "Extreme Mohs hardness, scratch-free resistance, and effortless maintenance for heavy footfall.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80",
  },
];

/**
 * Category Specific Dynamic Filter Configurations
 */
export const CATEGORY_FILTERS_CONFIG: Record<string, FilterOption[]> = {
  tiles: [
    {
      key: "subcategory",
      label: "Category",
      type: "multi_select",
      values: [
        "Floor Tiles",
        "Wall Tiles",
        "Bathroom Tiles",
        "Kitchen Tiles",
        "Outdoor Tiles",
        "Large Format Tiles",
        "Designer Tiles",
        "Anti-Skid Tiles",
      ],
    },
    {
      key: "material",
      label: "Material",
      type: "multi_select",
      values: ["Porcelain", "Ceramic", "Full Body Vitrified", "Glazed Vitrified", "Sintered Stone"],
    },
    {
      key: "colour",
      label: "Colour",
      type: "multi_select",
      values: ["White", "Beige", "Grey", "Black", "Brown", "Blue", "Green"],
    },
    {
      key: "finish",
      label: "Finish",
      type: "multi_select",
      values: ["Matte", "Glossy", "Polished", "Textured", "Silk Honed"],
    },
    {
      key: "size",
      label: "Size",
      type: "multi_select",
      values: [
        "300 x 300 mm",
        "600 x 600 mm",
        "600 x 1200 mm",
        "800 x 1600 mm",
        "1200 x 2400 mm",
        "1600 x 3200 mm",
      ],
    },
    {
      key: "thickness",
      label: "Thickness",
      type: "multi_select",
      values: ["8mm", "10mm", "12mm", "18mm", "20mm"],
    },
    {
      key: "application",
      label: "Application",
      type: "multi_select",
      values: ["Floor", "Wall", "Bathroom", "Kitchen", "Outdoor", "Commercial"],
    },
    {
      key: "room",
      label: "Room",
      type: "multi_select",
      values: ["Living Room", "Bedroom", "Bathroom", "Kitchen", "Balcony", "Outdoor"],
    },
    {
      key: "style",
      label: "Style",
      type: "multi_select",
      values: ["Modern", "Minimal", "Luxury", "Classic", "Industrial", "Natural"],
    },
    {
      key: "brand",
      label: "Brand",
      type: "multi_select",
      values: ["Kajaria Ceramics", "Somany Ceramics", "Nitco Tiles", "Simpolo Ceramics", "Johnson Tiles (H&R Johnson)"],
    },
  ],
  marbles: [
    {
      key: "subcategory",
      label: "Type",
      type: "multi_select",
      values: ["Natural Marble", "Imported Marble", "White Marble", "Beige Marble", "Black Marble", "Premium Marble"],
    },
    {
      key: "origin",
      label: "Origin",
      type: "multi_select",
      values: ["Carrara, Italy", "Tivoli, Italy", "Thassos, Greece", "Spain", "India"],
    },
    {
      key: "colour",
      label: "Colour",
      type: "multi_select",
      values: ["White", "Beige", "Black", "Grey", "Brown", "Green"],
    },
    {
      key: "finish",
      label: "Finish",
      type: "multi_select",
      values: ["Bookmatched Polished", "Silk Honed", "Leathered", "Natural Matte"],
    },
    {
      key: "thickness",
      label: "Thickness",
      type: "multi_select",
      values: ["18mm", "20mm", "30mm"],
    },
    {
      key: "application",
      label: "Application",
      type: "multi_select",
      values: ["Feature Wall", "Flooring", "Countertop", "Bathroom Sanctuary"],
    },
    {
      key: "room",
      label: "Room",
      type: "multi_select",
      values: ["Living Room", "Bathroom", "Kitchen", "Commercial"],
    },
  ],
  sanitaryware: [
    {
      key: "subcategory",
      label: "Product Type",
      type: "multi_select",
      values: ["Toilets / WCs", "Wash Basins", "Urinals", "Other Sanitaryware"],
    },
    {
      key: "mountType",
      label: "Mount Type",
      type: "multi_select",
      values: ["Wall-Hung", "Floor-Standing", "Countertop Vessel", "Freestanding"],
    },
    {
      key: "colour",
      label: "Colour",
      type: "multi_select",
      values: ["Alpine White", "Matte Black", "Matte Grey", "Ivory"],
    },
    {
      key: "material",
      label: "Material",
      type: "multi_select",
      values: ["Vitreous China", "Cast Stone", "Fine Fireclay"],
    },
    {
      key: "flushType",
      label: "Flush Type",
      type: "multi_select",
      values: ["Rimless Dual Flush", "Tornado Flush", "Washdown"],
    },
    {
      key: "brand",
      label: "Brand",
      type: "multi_select",
      values: ["Hindware Italian Collection", "Simpolo Ceramics", "Candela Atelier"],
    },
  ],
  faucets: [
    {
      key: "subcategory",
      label: "Type",
      type: "multi_select",
      values: ["Tall Basin Mixers", "Wall-Mount Spouts", "Bath Mixers", "Kitchen Faucets"],
    },
    {
      key: "mountType",
      label: "Mount Type",
      type: "multi_select",
      values: ["Deck Mount", "Wall Mount", "Floor Mount"],
    },
    {
      key: "finish",
      label: "Finish",
      type: "multi_select",
      values: ["Brushed Bronze", "Matte Black", "Polished Chrome", "Brushed Gold"],
    },
    {
      key: "material",
      label: "Material",
      type: "multi_select",
      values: ["Solid Brass", "Stainless Steel"],
    },
    {
      key: "style",
      label: "Style",
      type: "multi_select",
      values: ["Modern", "Minimal", "Luxury", "Classic"],
    },
    {
      key: "brand",
      label: "Brand",
      type: "multi_select",
      values: ["Hindware Italian Collection", "Candela Atelier"],
    },
  ],
  showers: [
    {
      key: "subcategory",
      label: "Type",
      type: "multi_select",
      values: ["Rain Showers", "Thermostatic Systems", "Hand Showers", "Shower Panels"],
    },
    {
      key: "finish",
      label: "Finish",
      type: "multi_select",
      values: ["Brushed Bronze", "Matte Black", "Polished Chrome", "Brushed Gold"],
    },
    {
      key: "waterFlow",
      label: "Water Flow",
      type: "multi_select",
      values: ["Rainfall & Waterfall", "High Pressure Rain", "Mist & Jet"],
    },
    {
      key: "brand",
      label: "Brand",
      type: "multi_select",
      values: ["Hindware Italian Collection", "Candela Atelier"],
    },
  ],
  hardware: [
    {
      key: "subcategory",
      label: "Type",
      type: "multi_select",
      values: ["Door Hardware", "Bathroom Hardware", "Kitchen Hardware", "Fittings", "Accessories"],
    },
    {
      key: "material",
      label: "Material",
      type: "multi_select",
      values: ["Solid Brass", "Grade 316 Stainless Steel", "Zinc Alloy"],
    },
    {
      key: "finish",
      label: "Finish",
      type: "multi_select",
      values: ["Knurled Brass", "Brushed Bronze", "Matte Black", "Brushed Nickel"],
    },
    {
      key: "style",
      label: "Style",
      type: "multi_select",
      values: ["Minimal", "Modern", "Industrial", "Luxury"],
    },
  ],
  "bathroom-accessories": [
    {
      key: "subcategory",
      label: "Type",
      type: "multi_select",
      values: ["Towel Rails", "Robe Hooks", "Paper Holders", "Vanity Mirrors"],
    },
    {
      key: "finish",
      label: "Finish",
      type: "multi_select",
      values: ["Brushed Bronze", "Matte Black", "Polished Chrome", "Brushed Gold"],
    },
    {
      key: "material",
      label: "Material",
      type: "multi_select",
      values: ["Solid Brass", "Stainless Steel"],
    },
  ],
};

/**
 * Inspiration Projects & Room Concepts
 */
export const INSPIRATION_PROJECTS = [
  {
    id: "proj-01",
    title: "Worli Seaface Penthouse",
    category: "Living Room & Foyer",
    location: "Worli, Mumbai",
    description: "Double-height living pavilion featuring bookmatched Calacatta Viola Riserva marble and custom dry-laid travertine floors.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    productsUsed: ["Calacatta Viola Riserva", "Travertino Navona Vein-Cut"],
  },
  {
    id: "proj-02",
    title: "Alibaug Coastal Sanctuary",
    category: "Master Bathroom & Pool Suite",
    location: "Alibaug, Maharashtra",
    description: "Biophilic stone bathroom sanctuary blending Ceppo di Gré porcelain slabs with brushed warm bronze thermostatic shower systems.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    productsUsed: ["Ceppo di Gré Milano", "Thermostatic Rainfall Shower System"],
  },
  {
    id: "proj-03",
    title: "Juhu Monolithic Island Kitchen",
    category: "Kitchen & Dining",
    location: "Juhu, Mumbai",
    description: "Seamless 3.2-meter sintered stone island with waterfall edges paired with Rovere Nordico timber-grain porcelain flooring.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    productsUsed: ["Noir Saint Laurent Gold", "Rovere Nordico Plank"],
  },
  {
    id: "proj-04",
    title: "Bandra Heritage Villa Restoration",
    category: "Exterior Facade & Verandah",
    location: "Bandra West, Mumbai",
    description: "20mm thick exterior porcelain pavers meeting fluted Carrara architectural accents along garden pathways.",
    imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
    productsUsed: ["20mm Grigio Basalt Exterior Paver", "Statuario Venato Extra"],
  },
];

/**
 * Core Production Sample Catalogue
 * All items marked as mandated by Rule 4.
 */

// Visual category showcase data with real photography for Style, Colour, Shape, Material, Brand
export const STYLE_SHOWCASE: CategoryCardData[] = [
  {
    id: "style-marble",
    title: "Marble Look Tile",
    slug: "marble-look-tile",
    description: "Iconic Carrara, Statuario, and Calacatta veins engineered on durable vitrified porcelain.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    itemCount: 48,
    tag: "Architectural Favorite",
  },
  {
    id: "style-wood",
    title: "Wood Look Tile",
    slug: "wood-look-tile",
    description: "Natural Nordic oak, French walnut, and smoked teak grain textures with zero water absorption.",
    imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80",
    itemCount: 32,
    tag: "High Durability",
  },
  {
    id: "style-travertine",
    title: "Travertine Look Tile",
    slug: "travertine-look-tile",
    description: "Sedimentary stratified stone strata in raw almond, bone, and titanium vein-cut hues.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    itemCount: 26,
    tag: "Warm Minimalist",
  },
  {
    id: "style-terrazzo",
    title: "Terrazzo Look",
    slug: "terrazzo-look",
    description: "Venetian micro-aggregates and Milanese brutalist marble chips set in architectural cement matrix.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 19,
    tag: "Contemporary",
  },
  {
    id: "style-subway",
    title: "Subway Tile",
    slug: "subway-tile",
    description: "Classic beveled, handmade zellige, and crackle-glazed bricks for kitchens & luxury sanctuaries.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    itemCount: 24,
    tag: "Timeless",
  },
  {
    id: "style-mosaic",
    title: "Mosaic Tile",
    slug: "mosaic-tile",
    description: "Intricate water-jet, herringbone, and glass-stone blends for bespoke feature details.",
    imageUrl: "https://images.unsplash.com/photo-1527359443443-84a48aec73d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 38,
    tag: "Artisanal",
  },
];

export const MATERIAL_SHOWCASE: CategoryCardData[] = [
  {
    id: "mat-marble",
    title: "Italian Marble",
    slug: "marble",
    description: "Quarry-block natural imported slabs from Carrara, Verona, and Siena with bookmatched veining.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    itemCount: 52,
    tag: "Pure Natural Stone",
  },
  {
    id: "mat-sintered",
    title: "Sintered Stone",
    slug: "sintered-stone",
    description: "Non-porous, thermal shock-resistant 12mm & 20mm compact surfaces for modern countertops.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    itemCount: 34,
    tag: "Ultra-Compact",
  },
  {
    id: "mat-travertine",
    title: "Travertine",
    slug: "travertine",
    description: "Authentic porous Italian travertine from Tivoli, resin-sealed for luxury floors & facades.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    itemCount: 22,
    tag: "Tivoli Origin",
  },
  {
    id: "mat-porcelain",
    title: "Porcelain Slab",
    slug: "porcelain",
    description: "Full-body rectified large format slabs up to 1600x3200mm with zero maintenance.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 65,
    tag: "Large Format",
  },
  {
    id: "mat-quartz",
    title: "Quartz & Onyx",
    slug: "quartz",
    description: "Translucent exotic crystals engineered for dramatic LED backlighting and statement feature walls.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    itemCount: 18,
    tag: "Translucent",
  },
];

export const SHAPE_SHOWCASE: CategoryCardData[] = [
  {
    id: "shape-slab",
    title: "Large Format Slab",
    slug: "large-slab",
    description: "Seamless 1600x3200mm monolithic surfaces that minimize grout joints for gallery-style spaces.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    itemCount: 42,
  },
  {
    id: "shape-rect",
    title: "Rectangle",
    slug: "rectangle",
    description: "Standard architectural formats: 600x1200mm, 800x1600mm, and 1200x2400mm floor/wall tiles.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    itemCount: 78,
  },
  {
    id: "shape-hex",
    title: "Hexagon",
    slug: "hexagon",
    description: "Geometric six-sided tiles offering dynamic honeycomb and three-dimensional visual rhythms.",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    itemCount: 20,
  },
  {
    id: "shape-square",
    title: "Square",
    slug: "square",
    description: "Balanced symmetry: 600x600mm, 800x800mm, and 1200x1200mm classical modular tile grids.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 36,
  },
  {
    id: "shape-chevron",
    title: "Chevron & Herringbone",
    slug: "chevron",
    description: "Angled parquetry layouts that add movement and classical European grandeur to luxury floors.",
    imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80",
    itemCount: 15,
  },
];

export const COLOUR_SHOWCASE: CategoryCardData[] = [
  {
    id: "col-bianco",
    title: "Bianco & Warm White",
    slug: "bianco",
    description: "Pristine milk whites, crystalline Apuan ivory, and delicate silver veining.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    itemCount: 54,
  },
  {
    id: "col-black",
    title: "Nero & Obsidian",
    slug: "black",
    description: "Deep noir, Sahara noir gold, and midnight black stones with dramatic contrast fissures.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    itemCount: 29,
  },
  {
    id: "col-beige",
    title: "Beige & Warm Almond",
    slug: "beige",
    description: "Warm desert sands, travertine crema, and honey almond strata for tranquil spaces.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    itemCount: 38,
  },
  {
    id: "col-gold",
    title: "Gold & Amber Honey",
    slug: "gold",
    description: "Opulent brass minerals, amber translucence, and Imperial gold veining.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    itemCount: 19,
  },
  {
    id: "col-grey",
    title: "Argento & Architectural Grey",
    slug: "grey",
    description: "Sophisticated graphite, concrete ash, and Ceppo di Gré aggregate stone tones.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 44,
  },
];

export const BRAND_SHOWCASE = [
  {
    id: "brand-kajaria",
    name: "Kajaria Ceramics",
    slug: "kajaria-ceramics",
    desc: "India's No. 1 Tile Manufacturer with world-class vitrified floor & wall collections.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    origin: "India",
    rating: "Market Leader",
  },
  {
    id: "brand-somany",
    name: "Somany Ceramics",
    slug: "somany-ceramics",
    desc: "Global Surface innovator featuring patented Slip-Shield and Duragres technologies.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    origin: "India",
    rating: "Innovation Pioneer",
  },
  {
    id: "brand-nitco",
    name: "Nitco Tiles",
    slug: "nitco-tiles",
    desc: "Decades of mastery in natural marble processing and high-end vitrified porcelain.",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    origin: "India",
    rating: "Luxury Heritage",
  },
  {
    id: "brand-hindware",
    name: "Hindware Italian Collection",
    slug: "hindware-italian-collection",
    desc: "Architectural surface couture offering premium Italian styling and large porcelain formats.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    origin: "India / Italy",
    rating: "Surface Couture",
  },
  {
    id: "brand-simpolo",
    name: "Simpolo Ceramics",
    slug: "simpolo-ceramics",
    desc: "Pioneering ultra-slim large format porcelain slabs and outdoor paving solutions.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    origin: "India",
    rating: "Slab Specialists",
  },
  {
    id: "brand-johnson",
    name: "Johnson Tiles (H&R Johnson)",
    slug: "johnson-tiles",
    desc: "Pioneers of Indian ceramic manufacturing with iconic antimicrobial and engineered tiles.",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    origin: "India",
    rating: "Established 1958",
  },
];

