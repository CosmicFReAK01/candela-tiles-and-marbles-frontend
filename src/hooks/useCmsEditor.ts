"use client";

import { useState } from "react";
import { useCandelaStore } from "@/context/CandelaStoreContext";

export type HomeBlockId =
  | "hero"
  | "categories"
  | "collections"
  | "visualizer"
  | "why"
  | "enquiry";

export interface CmsBlockConfig {
  id: HomeBlockId;
  name: string;
  tagline: string;
  visible: boolean;
}

export function useCmsEditor() {
  const { homePageCms, updateHomePageCms } = useCandelaStore();

  const [selectedHomeBlock, setSelectedHomeBlock] = useState<HomeBlockId>("hero");
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [homeBlocks, setHomeBlocks] = useState<CmsBlockConfig[]>([
    { id: "hero", name: "Hero Banner", tagline: "Master Architectural Surfaces", visible: true },
    { id: "categories", name: "Shop By Category", tagline: "Tiles, Marbles, Sanitaryware", visible: true },
    { id: "collections", name: "Featured Collections", tagline: "Curated Designer Editions", visible: true },
    { id: "visualizer", name: "3D Room Visualizer", tagline: "Interactive Slab Real-time Mapping", visible: true },
    { id: "why", name: "Why Candela Atelier", tagline: "Italian Direct Sourcing & Calibration", visible: true },
    { id: "enquiry", name: "Showroom Enquiry CTA", tagline: "Bhiwandi & Turbhe Direct Assistance", visible: true },
  ]);

  const [heroTitle, setHeroTitle] = useState(homePageCms.heroTitle);
  const [heroTagline, setHeroTagline] = useState(homePageCms.heroTagline);
  const [heroDescription, setHeroDescription] = useState(homePageCms.heroDescription);
  const [heroBgImage, setHeroBgImage] = useState(homePageCms.heroBgImage);
  const [announcementText, setAnnouncementText] = useState(homePageCms.announcementText);
  const [homePhone, setHomePhone] = useState(homePageCms.phone || "+91 70630 99602");

  const toggleHomeVisibility = (id: HomeBlockId) => {
    setHomeBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b))
    );
  };

  const saveHomeProperties = () => {
    try {
      updateHomePageCms({
        heroTitle,
        heroTagline,
        heroDescription,
        heroBgImage,
        announcementText,
        phone: homePhone,
      });
      setToastMessage("Homepage CMS published successfully! Changes are live on customer storefront.");
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      console.error("[useCmsEditor] Failed to publish CMS:", err);
      setToastMessage("Failed to publish changes. Please check console.");
      setSaveToast(true);
    }
  };

  return {
    selectedHomeBlock,
    setSelectedHomeBlock,
    deviceViewport,
    setDeviceViewport,
    homeBlocks,
    toggleHomeVisibility,
    heroTitle,
    setHeroTitle,
    heroTagline,
    setHeroTagline,
    heroDescription,
    setHeroDescription,
    heroBgImage,
    setHeroBgImage,
    announcementText,
    setAnnouncementText,
    homePhone,
    setHomePhone,
    saveHomeProperties,
    saveToast,
    toastMessage,
  };
}
