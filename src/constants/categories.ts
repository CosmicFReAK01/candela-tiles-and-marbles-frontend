import { MasterCategory } from "@/types";

export const MASTER_CATEGORIES: MasterCategory[] = [
  "Tiles",
  "Marbles",
  "Kitchen",
  "Bathroom",
  "Sanitaryware",
  "Faucets",
  "Showers",
  "Hardware",
  "Wellness & Spa",
  "Bathroom Accessories",
];

export const APPLICATION_AREAS = [
  "Flooring",
  "Wall Cladding",
  "Kitchen Countertops",
  "Bathroom Sanctuary",
  "Facade",
  "Commercial",
] as const;

export const ROOM_CATEGORIES = [
  "Living Room",
  "Bedroom",
  "Bathroom",
  "Kitchen",
  "Balcony",
  "Outdoor",
  "Commercial",
] as const;

export const STYLE_CATEGORIES = [
  "Modern",
  "Minimal",
  "Luxury",
  "Classic",
  "Industrial",
  "Natural",
] as const;
