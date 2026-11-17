"use client";

import React, { useRef } from "react";
import {
  Trash2,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (newUrl: string) => void;
  label?: string;
  helperText?: string;
  aspectRatioHint?: string;
  categoryScope?: string;
}

export function ImageUploader({
  currentImageUrl = "",
  onImageChange,
  label = "Surface / Item Image",
  helperText,
  aspectRatioHint = "16:9 or 4:3 recommended",
  categoryScope = "ALL",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    isDragging,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    errorMessage,
    handleUploadFile,
    handleIngestUrl,
    handleRemove,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useMediaUpload({
    currentImageUrl,
    onImageChange,
    categoryScope,
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
          {label}
        </label>
        <span className="text-[10px] text-gray-400 font-mono">
          {aspectRatioHint}
        </span>
      </div>

      {currentImageUrl ? (
        /* State 1: Active Image. Shows active preview with remove/replace action */
        <div className="border border-gray-200 bg-white p-3 space-y-3 shadow-xs rounded-sm">
          <div className="relative h-44 w-full overflow-hidden border border-gray-200 bg-gray-100 group rounded">
            <img
              src={currentImageUrl}
              alt={label}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="text-xs text-white font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Image is saved in database
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 bg-red-600 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-red-700 transition cursor-pointer shadow-md rounded"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove &amp; Replace Image
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-500 font-mono truncate max-w-[70%]">
              {currentImageUrl.startsWith("/uploads/")
                ? `Saved on Server: ${currentImageUrl}`
                : currentImageUrl}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove Image
            </button>
          </div>
          <p className="text-[11px] text-gray-500 italic">
            * To replace this image, click &ldquo;Remove Image&rdquo; above, then drag &amp; drop a new file or paste a web link.
          </p>
        </div>
      ) : (
        /* State 2: No image. User can drag & drop, browse from device, or paste URL */
        <div className="space-y-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2.5 rounded-sm ${
              isDragging
                ? "border-[#9E7B47] bg-[#9E7B47]/10"
                : isUploading
                ? "border-[#9E7B47] bg-[#FAF5EE]/50 cursor-wait"
                : "border-gray-300 bg-gray-50/70 hover:border-[#9E7B47] hover:bg-white"
            }`}
            onClick={() => {
              if (!isUploading) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              disabled={isUploading}
            />

            <div className="p-3 bg-white rounded-full border border-gray-200 shadow-xs">
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-[#9E7B47] animate-spin" />
              ) : (
                <Upload className="h-5 w-5 text-[#9E7B47]" />
              )}
            </div>

            <div>
              {isUploading ? (
                <p className="text-xs font-medium text-[#9E7B47] animate-pulse">
                  Uploading image to database &amp; server storage...
                </p>
              ) : (
                <>
                  <p className="text-xs font-medium text-gray-800">
                    <span className="text-[#9E7B47] underline font-semibold">Click to upload</span> or drag and drop image here
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Supports PNG, JPG, WebP up to 10MB (Persisted to Database)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Alternative: Enter URL */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-600 hover:text-[#9E7B47] cursor-pointer"
            >
              <LinkIcon className="h-3 w-3" />
              {showUrlInput ? "Hide Direct URL" : "Or paste image web link (URL)"}
            </button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or supplier CDN link"
                disabled={isUploading}
                className="flex-1 border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-[#9E7B47] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleIngestUrl}
                disabled={isUploading || !urlInput.trim()}
                className="inline-flex items-center gap-1 bg-[#9E7B47] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#856535] disabled:opacity-50 transition cursor-pointer rounded-sm"
              >
                {isUploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Save to Database
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
