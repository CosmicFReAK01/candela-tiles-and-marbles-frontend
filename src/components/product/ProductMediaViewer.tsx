"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PublicProduct } from "@/types";
import { RotateCw, Play, Pause, ChevronLeft, ChevronRight, Layers, Maximize2 } from "lucide-react";

interface ProductMediaViewerProps {
  product: PublicProduct;
}

interface GalleryPhotoView {
  id: string;
  title: string;
  badge: string;
  type: "360" | "slab" | "bookmatch" | "scene" | "macro" | "edge" | "photo";
  desc: string;
  imageUrl?: string;
}

export function ProductMediaViewer({ product }: ProductMediaViewerProps) {
  // Extract 360 frames if configured
  const frames360: string[] =
    (product as any).viewer360?.frames?.map((f: any) => f.url) ||
    product.media?.frames360Urls ||
    [];

  const hasPhoto360Frames = frames360.length > 0;

  // Multi-view gallery thumbnails (Flipkart style)
  const galleryViews: GalleryPhotoView[] = [
    {
      id: "360",
      title: "360° Spin",
      badge: "360°",
      type: "360",
      desc: hasPhoto360Frames
        ? `${frames360.length} Real Photographic Frames (Drag to Spin)`
        : "Interactive 360° Slab Turntable (Front, Edges & Reverse Mesh)",
    },
    {
      id: "slab",
      title: "Full Slab Face",
      badge: "1600×3200",
      type: "slab",
      desc: `${product.dimensionsMm} • First Selection Quarry Lot`,
      imageUrl: product.media.primaryImage,
    },
    {
      id: "bookmatch",
      title: "Bookmatch Quad",
      badge: "A+B Quad",
      type: "bookmatch",
      desc: "4-Piece Sequential Mirror-Matched Feature Wall Layout",
      imageUrl: product.media.bookmatchImage,
    },
    {
      id: "scene",
      title: "Kitchen Waterfall",
      badge: "Architectural",
      type: "scene",
      desc: "Monolithic Waterfall Countertop Installation",
      imageUrl: product.media.architecturalImage,
    },
    {
      id: "macro",
      title: "Macro Vein Detail",
      badge: "4X Zoom",
      type: "macro",
      desc: "Brecciated Mineral Crystallization & Surface Texture",
      imageUrl: product.media.macroImage,
    },
    {
      id: "edge",
      title: "20mm Mitred Edge",
      badge: `${product.thicknessMm}mm Edge`,
      type: "edge",
      desc: `${product.thicknessMm}mm Calibrated Monolithic Edge Profile`,
      imageUrl: product.media.edgeImage,
    },
    // Include admin configured custom angle views
    ...(product.media.customViews || []).map((cv) => ({
      id: cv.id,
      title: cv.title,
      badge: cv.badge || "View Angle",
      type: "photo" as const,
      desc: cv.desc || cv.title,
      imageUrl: cv.imageUrl,
    })),
    // Include user-uploaded gallery images
    ...(product.media.galleryImages || []).map((imgUrl, i) => ({
      id: `photo-${i}`,
      title: `Gallery Photo #${i + 1}`,
      badge: `Photo ${i + 1}`,
      type: "photo" as const,
      desc: `Quarry Lot & Architecture Detail #${i + 1}`,
      imageUrl: imgUrl,
    })),
  ];

  const [selectedViewId, setSelectedViewId] = useState<string>("360");
  const [currentAngleDeg, setCurrentAngleDeg] = useState<number>(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStartXRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);
  const momentumTimerRef = useRef<any>(null);
  const autoSpinTimerRef = useRef<any>(null);

  const is360Mode = selectedViewId === "360";

  // Compute orientation label from angle
  const getOrientationLabel = (deg: number): string => {
    const normalized = ((deg % 360) + 360) % 360;
    if (normalized >= 60 && normalized <= 120) {
      return "Right Edge (20mm Profile)";
    }
    if (normalized > 120 && normalized <= 240) {
      return "Reverse (Fiberglass Mesh & Quarry Stamp)";
    }
    if (normalized > 240 && normalized <= 300) {
      return "Left Edge (20mm Profile)";
    }
    return "Front View";
  };

  // Auto-spin interval
  useEffect(() => {
    if (isAutoSpinning && is360Mode) {
      autoSpinTimerRef.current = setInterval(() => {
        setCurrentAngleDeg((prev) => (prev + 2.5) % 360);
      }, 40);
    } else {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    }
    return () => {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    };
  }, [isAutoSpinning, is360Mode]);

  // Handle single-click step
  const handleStepAngle = (step: number) => {
    if (isAutoSpinning) setIsAutoSpinning(false);
    setHasInteracted(true);
    setCurrentAngleDeg((prev) => ((prev + step + 360) % 360));
  };

  // Set explicit snap angle
  const handleSetAngle = (targetDeg: number) => {
    if (isAutoSpinning) setIsAutoSpinning(false);
    setHasInteracted(true);
    setCurrentAngleDeg((targetDeg + 360) % 360);
  };

  // Pointer drag listeners for Flipkart 360° turntable
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!is360Mode) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    setHasInteracted(true);
    if (isAutoSpinning) setIsAutoSpinning(false);
    if (momentumTimerRef.current) clearInterval(momentumTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !is360Mode) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragVelocityRef.current = deltaX;
    dragStartXRef.current = e.clientX;
    // 1px drag = ~0.85 degrees rotation
    setCurrentAngleDeg((prev) => (prev + deltaX * 0.85 + 360) % 360);
  };

  const handlePointerUp = () => {
    if (!isDragging || !is360Mode) return;
    setIsDragging(false);

    // Flipkart-style momentum inertia
    let v = dragVelocityRef.current * 0.65;
    if (momentumTimerRef.current) clearInterval(momentumTimerRef.current);
    momentumTimerRef.current = setInterval(() => {
      if (Math.abs(v) < 0.25) {
        clearInterval(momentumTimerRef.current);
        return;
      }
      setCurrentAngleDeg((prev) => (prev + v + 360) % 360);
      v *= 0.88; // friction dampening
    }, 25);
  };

  // Render canvas (Realistic 360° slab geometry or architectural views)
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const baseHex = product.media.baseColorHex || "#F5F1EB";
    const veinHex = product.media.veinColorHex || "#5B323A";

    // Non-360 Photo Views
    if (selectedViewId === "bookmatch") {
      ctx.fillStyle = "#EAE6DE";
      ctx.fillRect(0, 0, w, h);
      const midX = w / 2;
      const midY = h / 2;
      const quadrants = [
        { sx: 1, sy: 1, ox: 0, oy: 0 },
        { sx: -1, sy: 1, ox: w, oy: 0 },
        { sx: 1, sy: -1, ox: 0, oy: h },
        { sx: -1, sy: -1, ox: w, oy: h },
      ];

      quadrants.forEach((q) => {
        ctx.save();
        ctx.translate(q.ox, q.oy);
        ctx.scale(q.sx, q.sy);
        ctx.beginPath();
        ctx.rect(0, 0, midX, midY);
        ctx.clip();
        ctx.fillStyle = baseHex;
        ctx.fillRect(0, 0, midX, midY);
        ctx.strokeStyle = veinHex;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(10, 20);
        ctx.bezierCurveTo(midX * 0.4, midY * 0.3, midX * 0.7, midY * 0.8, midX - 10, midY - 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(midX * 0.1, midY * 0.7);
        ctx.bezierCurveTo(midX * 0.5, midY * 0.5, midX * 0.8, midY * 0.2, midX, midY * 0.1);
        ctx.stroke();
        ctx.restore();
      });

      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, h);
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.strokeStyle = "rgba(42,40,37,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "rgba(42,40,37,0.9)";
      ctx.fillRect(16, h - 38, 320, 24);
      ctx.fillStyle = "#F8F5F0";
      ctx.font = "11px monospace";
      ctx.fillText("4-PIECE BOOKMATCHED MIRROR QUADRANT", 24, h - 22);
      return;
    }

    if (selectedViewId === "macro") {
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = veinHex;
      for (let i = 0; i < 22; i++) {
        ctx.globalAlpha = i % 2 === 0 ? 0.75 : 0.35;
        ctx.lineWidth = i % 4 === 0 ? 10 : i % 2 === 0 ? 4 : 1.8;
        ctx.beginPath();
        const sy = i * 22;
        ctx.moveTo(0, sy);
        ctx.bezierCurveTo(w * 0.3, sy + 32, w * 0.6, sy - 24, w, sy + 28);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(42,40,37,0.9)";
      ctx.fillRect(16, h - 38, 330, 24);
      ctx.fillStyle = "#F8F5F0";
      ctx.font = "11px monospace";
      ctx.fillText("MACRO 4X ZOOM: MINERAL VEIN DETAIL", 24, h - 22);
      return;
    }

    if (selectedViewId === "scene" || selectedViewId === "edge") {
      ctx.fillStyle = "#2D2A27";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = baseHex;
      ctx.fillRect(70, 75, w - 140, h - 140);
      ctx.strokeStyle = veinHex;
      ctx.lineWidth = 3.6;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(70, 110);
      ctx.lineTo(w - 70, h - 110);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(42,40,37,0.9)";
      ctx.fillRect(16, h - 38, 360, 24);
      ctx.fillStyle = "#F8F5F0";
      ctx.font = "11px monospace";
      ctx.fillText(
        selectedViewId === "scene"
          ? "ARCHITECTURAL KITCHEN ISLAND WATERFALL"
          : "20MM MITRED EDGE PROFILE INSPECTION",
        24,
        h - 22
      );
      return;
    }

    // 360° TURNTABLE MODE
    const deg = ((currentAngleDeg % 360) + 360) % 360;
    const rad = (deg * Math.PI) / 180;

    // Studio ambient lighting background
    const bg = ctx.createRadialGradient(w / 2, h / 2 - 20, 50, w / 2, h / 2, w * 0.68);
    bg.addColorStop(0, "#F7F5F2");
    bg.addColorStop(0.65, "#EAE6DF");
    bg.addColorStop(1, "#D4CFC6");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Studio turntable circular floor shadow (Flipkart 360 hallmark)
    ctx.save();
    ctx.translate(w / 2, h / 2 + 155);
    ctx.scale(1, 0.28);
    const floorGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 240);
    floorGrad.addColorStop(0, "rgba(26,26,26,0.38)");
    floorGrad.addColorStop(0.5, "rgba(26,26,26,0.18)");
    floorGrad.addColorStop(1, "rgba(26,26,26,0)");
    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 240, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const isFrontFacing = deg <= 90 || deg >= 270;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    const slabW = Math.max(16, Math.abs(cosA) * 290);
    const slabH = 340;
    const skewY = sinA * 36;
    const thickness20mm = Math.max(8, Math.abs(sinA) * 26);

    ctx.save();
    ctx.translate(w / 2, h / 2 - 10);

    // Cast shadow
    ctx.fillStyle = "rgba(26,26,26,0.20)";
    ctx.beginPath();
    ctx.moveTo(-slabW / 2 + 14, -slabH / 2 - skewY + 22);
    ctx.lineTo(slabW / 2 + 14, -slabH / 2 + skewY + 22);
    ctx.lineTo(slabW / 2 + 14, slabH / 2 + skewY + 22);
    ctx.lineTo(-slabW / 2 + 14, slabH / 2 - skewY + 22);
    ctx.closePath();
    ctx.fill();

    // 20mm Edge Thickness Profile
    ctx.fillStyle = "#6B6761";
    ctx.beginPath();
    if (sinA > 0) {
      ctx.moveTo(slabW / 2, -slabH / 2 + skewY);
      ctx.lineTo(slabW / 2 + thickness20mm, -slabH / 2 + skewY + 6);
      ctx.lineTo(slabW / 2 + thickness20mm, slabH / 2 + skewY + 6);
      ctx.lineTo(slabW / 2, slabH / 2 + skewY);
    } else {
      ctx.moveTo(-slabW / 2, -slabH / 2 - skewY);
      ctx.lineTo(-slabW / 2 - thickness20mm, -slabH / 2 - skewY + 6);
      ctx.lineTo(-slabW / 2 - thickness20mm, slabH / 2 - skewY + 6);
      ctx.lineTo(-slabW / 2, slabH / 2 - skewY);
    }
    ctx.closePath();
    ctx.fill();

    // Edge 3D texture highlight
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Main Face of the Slab
    ctx.beginPath();
    ctx.moveTo(-slabW / 2, -slabH / 2 - skewY);
    ctx.lineTo(slabW / 2, -slabH / 2 + skewY);
    ctx.lineTo(slabW / 2, slabH / 2 + skewY);
    ctx.lineTo(-slabW / 2, slabH / 2 - skewY);
    ctx.closePath();
    ctx.clip();

    if (isFrontFacing) {
      // FRONT FACE: Polished quarry marble with veins and specular sheen
      ctx.fillStyle = baseHex;
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Organic Veins
      ctx.strokeStyle = veinHex;
      for (let i = 0; i < 9; i++) {
        ctx.globalAlpha = i % 2 === 0 ? 0.4 : 0.2;
        ctx.lineWidth = i % 3 === 0 ? 3.6 : 1.4;
        ctx.beginPath();
        const sy = -slabH / 2 + i * 42;
        ctx.moveTo(-slabW / 2 - 20, sy);
        ctx.bezierCurveTo(
          -slabW * 0.18,
          sy + (i % 2 === 0 ? 36 : -26),
          slabW * 0.22,
          sy - 28,
          slabW / 2 + 20,
          sy + 38
        );
        ctx.stroke();
      }

      // Specular Lighting Reflection (Studio Highlight)
      const gloss = Math.max(0.12, 0.58 - (product.media.roughness || 0.1) * 0.7);
      const lx = cosA * 45;
      const spec = ctx.createLinearGradient(lx - 90, -slabH / 2, lx + 90, slabH / 2);
      spec.addColorStop(0, "rgba(255,255,255,0)");
      spec.addColorStop(0.5, `rgba(255,255,255,${gloss})`);
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = spec;
      ctx.fillRect(-w / 2, -h / 2, w, h);
    } else {
      // REVERSE BACK FACE: Raw Quarry Unpolished Back with Fiberglass Reinforcing Mesh & Stencil
      ctx.fillStyle = "#A8A297";
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Fiberglass Mesh Grid
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.7;
      for (let gx = -slabW / 2; gx <= slabW / 2; gx += 16) {
        ctx.beginPath();
        ctx.moveTo(gx, -slabH / 2);
        ctx.lineTo(gx, slabH / 2);
        ctx.stroke();
      }
      for (let gy = -slabH / 2; gy <= slabH / 2; gy += 16) {
        ctx.beginPath();
        ctx.moveTo(-slabW / 2, gy);
        ctx.lineTo(slabW / 2, gy);
        ctx.stroke();
      }

      // Quarry Lot Stencil
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = "rgba(42,40,37,0.75)";
      ctx.font = "bold 13px monospace";
      ctx.fillText("CANDELA QUARRY LOT • CERTIFIED IT", -80, -30);
      ctx.font = "11px monospace";
      ctx.fillText(`LOT #${product.sku} • ${product.thicknessMm}MM`, -80, -10);
      ctx.fillText("FIBERGLASS REINFORCED UV RESIN", -80, 10);
    }

    ctx.restore();
  }, [currentAngleDeg, selectedViewId, product]);

  // Redraw when angle or view changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Current photo frame if custom photographic 360 frames exist
  const currentPhotoFrameIndex =
    hasPhoto360Frames && frames360.length > 0
      ? Math.floor((((currentAngleDeg % 360) + 360) % 360) / 360 * frames360.length) %
        frames360.length
      : 0;

  const currentPhotoFrameUrl = hasPhoto360Frames ? frames360[currentPhotoFrameIndex] : null;

  const activeView = galleryViews.find((v) => v.id === selectedViewId) || galleryViews[0];

  return (
    <div className="flex flex-col gap-4 select-text">
      {/* MAIN STAGE (Flipkart Style Card with Hover Elevation) */}
      <div className="relative border border-candela-border bg-candela-surface shadow-md overflow-hidden rounded-xs">
        {/* FLIPKART-STYLE 360° CORNER FLOATING BADGE */}
        {is360Mode ? (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#1A1A1A]/90 text-white px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md select-none">
            <RotateCw className="h-4 w-4 text-[#E6C97A] animate-spin [animation-duration:8s]" />
            <span className="font-mono text-[11px] font-bold tracking-wider text-white">
              360° VIEW
            </span>
            <span className="font-mono text-[10px] text-[#E6C97A] border-l border-white/20 pl-2">
              {Math.round(currentAngleDeg)}° • {getOrientationLabel(currentAngleDeg)}
            </span>
          </div>
        ) : (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#1A1A1A]/90 text-white px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md font-mono text-[11px]">
            <span className="text-[#E6C97A]">●</span> {activeView.title.toUpperCase()}
          </div>
        )}

        {/* FLIPKART-STYLE INITIAL INTERACTION GUIDANCE CUE */}
        {is360Mode && !hasInteracted && (
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2.5 bg-black/85 text-white px-5 py-3 rounded-full shadow-2xl transition-opacity duration-300">
            <span className="text-lg">⟷</span>
            <span className="text-xs font-medium tracking-wide">
              Drag horizontally to rotate 360°
            </span>
          </div>
        )}

        {/* FLIPKART-STYLE SIDE ROTATION CHEVRONS (Single-Click Steppers) */}
        {is360Mode && (
          <>
            <button
              type="button"
              onClick={() => handleStepAngle(-20)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-candela-border bg-white/95 text-candela-text shadow-md hover:bg-[#8B6914] hover:text-white transition cursor-pointer"
              title="Rotate Left 20°"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleStepAngle(20)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-candela-border bg-white/95 text-candela-text shadow-md hover:bg-[#8B6914] hover:text-white transition cursor-pointer"
              title="Rotate Right 20°"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Interactive Viewport Stage (Canvas or Photographic 360 / High-Res Image) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`relative w-full h-[460px] flex items-center justify-center select-none overflow-hidden ${
            is360Mode ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          {is360Mode && hasPhoto360Frames && currentPhotoFrameUrl ? (
            /* Photographic 360 sequence from Admin Console */
            <div className="relative w-full h-full flex items-center justify-center bg-[#EDEBE6]">
              <img
                src={currentPhotoFrameUrl}
                alt={`${product.name} 360 angle`}
                className="w-full h-full object-contain pointer-events-none"
              />
              <div className="absolute bottom-3 left-4 bg-black/75 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                Frame {currentPhotoFrameIndex + 1} / {frames360.length} • {Math.round(currentAngleDeg)}°
              </div>
            </div>
          ) : is360Mode && (!hasPhoto360Frames || !currentPhotoFrameUrl) ? (
            /* Procedural realistic slab canvas for 360 turntable */
            <canvas
              ref={canvasRef}
              width={720}
              height={460}
              className="w-full h-full object-contain block"
            />
          ) : activeView.imageUrl ? (
            /* Direct high-res photo inspection (Full Slab, A+B Quad, Kitchen Waterfall, Macro Vein, 20mm Edge, Custom Angles) */
            <div className="relative w-full h-full flex items-center justify-center bg-[#F4F1EA]">
              <img
                src={activeView.imageUrl}
                alt={activeView.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-black/80 text-white font-mono text-[10px] px-2.5 py-1 rounded shadow-md flex items-center gap-2">
                <span className="text-[#E6C97A] font-semibold">{activeView.badge}</span>
                <span>•</span>
                <span>{activeView.title}</span>
              </div>
            </div>
          ) : (
            /* Procedural fallback canvas if no custom photo uploaded yet */
            <canvas
              ref={canvasRef}
              width={720}
              height={460}
              className="w-full h-full object-contain block"
            />
          )}
        </div>

        {/* FLIPKART-STYLE FLOATING BOTTOM 360 CONTROLS DOCK */}
        {is360Mode ? (
          <div className="border-t border-candela-border bg-candela-bg px-4 py-3 flex flex-col gap-2.5">
            {/* Angle Slider Track 0° to 359° */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-candela-secondary w-8">0°</span>
              <input
                type="range"
                min="0"
                max="359"
                value={Math.round(currentAngleDeg)}
                onChange={(e) => handleSetAngle(Number(e.target.value))}
                className="flex-1 accent-[#8B6914] cursor-pointer"
              />
              <span className="font-mono text-[10px] text-candela-secondary w-8 text-right">360°</span>
            </div>

            {/* Quick Action Buttons: Auto-Spin, Angle Snaps */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-sm font-mono text-xs uppercase tracking-wider transition ${
                    isAutoSpinning
                      ? "bg-[#2A2825] text-white hover:bg-black"
                      : "bg-[#8B6914] text-white hover:bg-[#2A2825]"
                  }`}
                >
                  {isAutoSpinning ? (
                    <>
                      <Pause className="h-3 w-3" /> Pause Auto-Spin
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" /> Auto-Spin 360°
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSetAngle(0)}
                  className="px-2.5 py-1.5 border border-candela-border bg-candela-surface hover:border-[#8B6914] text-[11px] font-mono rounded-sm transition cursor-pointer"
                  title="Snap to Front Face"
                >
                  Front (0°)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAngle(90)}
                  className="px-2.5 py-1.5 border border-candela-border bg-candela-surface hover:border-[#8B6914] text-[11px] font-mono rounded-sm transition cursor-pointer"
                  title="Snap to 20mm Profile"
                >
                  Side (90°)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAngle(180)}
                  className="px-2.5 py-1.5 border border-candela-border bg-candela-surface hover:border-[#8B6914] text-[11px] font-mono rounded-sm transition cursor-pointer"
                  title="Snap to Fiberglass Mesh Back"
                >
                  Back (180°)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAngle(270)}
                  className="px-2.5 py-1.5 border border-candela-border bg-candela-surface hover:border-[#8B6914] text-[11px] font-mono rounded-sm transition cursor-pointer"
                  title="Snap to Left Edge"
                >
                  Side (270°)
                </button>
              </div>

              <span className="font-mono text-[11px] text-candela-secondary hidden sm:inline">
                Drag horizontally to rotate 360°
              </span>
            </div>
          </div>
        ) : (
          <div className="border-t border-candela-border bg-candela-bg px-4 py-3 flex items-center justify-between">
            <div className="font-serif text-sm font-semibold text-candela-text">
              {activeView.title}
            </div>
            <span className="font-mono text-xs text-[#8B6914]">{activeView.desc}</span>
          </div>
        )}
      </div>

      {/* FLIPKART-STYLE MULTI-VIEW THUMBNAIL STRIP (Interactive Gallery Rail) */}
      <div className="border border-candela-border bg-candela-surface p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B6914] font-semibold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>PRODUCT VIEWS &amp; 360° ROTATION (FLIPKART STYLE)</span>
          </span>
          <span className="font-mono text-[10px] text-candela-secondary">
            Select angle to inspect
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {galleryViews.map((item) => {
            const isSelected = selectedViewId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedViewId(item.id);
                  if (item.id !== "360" && isAutoSpinning) setIsAutoSpinning(false);
                }}
                className={`flex-none w-28 p-2 rounded-xs border-2 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-[#8B6914] bg-candela-bg shadow-sm"
                    : "border-candela-border bg-candela-surface hover:border-gray-400"
                }`}
              >
                {/* Thumbnail Header Area */}
                {item.type === "360" ? (
                  <div className="h-14 bg-[#2A2825] text-[#E6C97A] rounded-xs flex flex-col items-center justify-center">
                    <RotateCw className="h-5 w-5 text-[#E6C97A]" />
                    <span className="font-mono text-[9px] font-bold text-white mt-0.5">360° SPIN</span>
                  </div>
                ) : item.imageUrl ? (
                  <div className="h-14 rounded-xs overflow-hidden border border-candela-border bg-white flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${product.media.baseColorHex || "#F5F1EB"} 0%, ${product.media.veinColorHex || "#5B323A"} 100%)`,
                    }}
                    className="h-14 rounded-xs border border-candela-border flex items-end p-1"
                  >
                    <span className="bg-black/80 text-white font-mono text-[8px] px-1 rounded-xs">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Thumbnail Caption */}
                <p
                  className={`font-serif text-xs font-semibold mt-1.5 truncate ${
                    isSelected ? "text-[#8B6914]" : "text-candela-text"
                  }`}
                >
                  {item.title}
                </p>
                <p className="font-mono text-[9px] text-candela-secondary truncate">
                  {item.badge}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
