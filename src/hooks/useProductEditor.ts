"use client";

import { useState, useEffect } from "react";
import { AdminProduct } from "@/types";

export type EditorTab =
  | "general"
  | "attributes"
  | "media"
  | "sequence360"
  | "inventory"
  | "seo"
  | "history";

interface UseProductEditorOptions {
  initialProduct: AdminProduct;
  onSave: (product: AdminProduct) => void;
}

export function useProductEditor({ initialProduct, onSave }: UseProductEditorOptions) {
  const [product, setProduct] = useState<AdminProduct>({
    ...initialProduct,
    viewer360: initialProduct.viewer360 || {
      enabled: false,
      frames: initialProduct.media?.frames360Urls
        ? initialProduct.media.frames360Urls.map((url, idx) => ({ index: idx + 1, url }))
        : [
            { index: 1, url: initialProduct.media?.primaryImage || "" },
            { index: 2, url: initialProduct.media?.galleryImages?.[0] || initialProduct.media?.primaryImage || "" },
          ],
      settings: { autoRotate: true, rotationSpeed: 20, direction: "clockwise" },
    },
    visualizerAssets: initialProduct.visualizerAssets || {
      enabled: true,
      texture: initialProduct.media?.primaryImage || "",
      previewTexture: initialProduct.media?.primaryImage || "",
      normalMap: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
      roughnessMap: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
      resolution: { width: 4096, height: 4096 },
    },
  });

  const [activeTab, setActiveTab] = useState<EditorTab>("general");
  const [active360FrameIndex, setActive360FrameIndex] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [newFrameInput, setNewFrameInput] = useState("");
  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Auto-spin preview player
  useEffect(() => {
    if (!isAutoSpinning) return;
    const framesCount = product.viewer360?.frames?.length || 0;
    if (framesCount <= 1) return;
    const interval = setInterval(() => {
      setActive360FrameIndex((prev) => (prev + 1) % framesCount);
    }, 180);
    return () => clearInterval(interval);
  }, [isAutoSpinning, product.viewer360?.frames?.length]);

  const add360Frame = (url: string) => {
    if (!url.trim()) return;
    const currentFrames = product.viewer360?.frames || [];
    const newFrames = [
      ...currentFrames,
      { index: currentFrames.length + 1, url: url.trim() },
    ];
    setProduct((prev) => ({
      ...prev,
      viewer360: {
        ...(prev.viewer360 || {
          enabled: true,
          settings: { autoRotate: true, rotationSpeed: 20, direction: "clockwise" },
        }),
        frames: newFrames,
        enabled: true,
      },
      media: {
        ...prev.media,
        frames360Urls: newFrames.map((f) => f.url),
      },
    }));
    setNewFrameInput("");
  };

  const remove360Frame = (indexToRemove: number) => {
    const currentFrames = product.viewer360?.frames || [];
    const newFrames = currentFrames
      .filter((_, idx) => idx !== indexToRemove)
      .map((f, idx) => ({ ...f, index: idx + 1 }));

    setProduct((prev) => ({
      ...prev,
      viewer360: {
        ...(prev.viewer360 || {
          enabled: false,
          settings: { autoRotate: true, rotationSpeed: 20, direction: "clockwise" },
        }),
        frames: newFrames,
      },
      media: {
        ...prev.media,
        frames360Urls: newFrames.map((f) => f.url),
      },
    }));
    setActive360FrameIndex(0);
  };

  const update360FrameUrl = (indexToUpdate: number, newUrl: string) => {
    const currentFrames = product.viewer360?.frames || [];
    const updated = currentFrames.map((f, idx) =>
      idx === indexToUpdate ? { ...f, url: newUrl } : f
    );
    setProduct((prev) => ({
      ...prev,
      viewer360: {
        ...prev.viewer360!,
        frames: updated,
      },
      media: {
        ...prev.media,
        frames360Urls: updated.map((f) => f.url),
      },
    }));
  };

  const addCustomSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    const current = product.specs?.customSpecs || [];
    setProduct((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        customSpecs: [
          ...current,
          { label: newSpecLabel.trim(), value: newSpecValue.trim() },
        ],
      },
    }));
    setNewSpecLabel("");
    setNewSpecValue("");
  };

  const removeCustomSpec = (index: number) => {
    const current = product.specs?.customSpecs || [];
    setProduct((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        customSpecs: current.filter((_, i) => i !== index),
      },
    }));
  };

  const generateAiDescription = async () => {
    setAiLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const category = product.masterCategory || product.category || "Architectural Surface";
      const origin = product.origin || "Italy";
      const finish = product.finish || "Polished";

      setProduct((prev) => ({
        ...prev,
        shortDescription: `Curated exclusively for high-end residential and commercial architectural installations. Quarrried in ${origin} and calibrated with a signature ${finish} aesthetic, engineered for timeless luxury.`,
        architecturalNotes: `High structural integrity compliant with international architectural standards. Ideal for high-traffic environments, seamless bookmatch installations, and precision detailing.`,
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const saveProduct = () => {
    onSave(product);
  };

  return {
    product,
    setProduct,
    activeTab,
    setActiveTab,
    active360FrameIndex,
    setActive360FrameIndex,
    isAutoSpinning,
    setIsAutoSpinning,
    newFrameInput,
    setNewFrameInput,
    newSpecLabel,
    setNewSpecLabel,
    newSpecValue,
    setNewSpecValue,
    aiLoading,
    add360Frame,
    remove360Frame,
    update360FrameUrl,
    addCustomSpec,
    removeCustomSpec,
    generateAiDescription,
    saveProduct,
  };
}
