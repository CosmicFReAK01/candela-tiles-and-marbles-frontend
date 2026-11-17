"use client";

import { useState, useCallback } from "react";
import { mediaService } from "@/services/media.service";

interface UseMediaUploadOptions {
  currentImageUrl?: string;
  onImageChange: (newUrl: string) => void;
  categoryScope?: string;
}

export function useMediaUpload({
  currentImageUrl = "",
  onImageChange,
  categoryScope = "ALL",
}: UseMediaUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handle File Upload (Drag & Drop or File Picker)
   */
  const handleUploadFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Image exceeds 10MB limit. Please choose an optimized image.");
        return;
      }

      setIsUploading(true);
      try {
        const asset = await mediaService.uploadFile(file, categoryScope);
        onImageChange(asset.url);
        setErrorMessage(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to upload image file";
        setErrorMessage(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [categoryScope, onImageChange]
  );

  /**
   * Handle URL Link Ingestion
   */
  const handleIngestUrl = useCallback(async () => {
    if (!urlInput.trim()) return;

    setErrorMessage(null);
    setIsUploading(true);
    try {
      const asset = await mediaService.ingestUrl(urlInput.trim(), undefined, categoryScope);
      onImageChange(asset.url);
      setUrlInput("");
      setShowUrlInput(false);
      setErrorMessage(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to ingest image URL";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  }, [urlInput, categoryScope, onImageChange]);

  /**
   * Handle Clear / Remove
   */
  const handleRemove = useCallback(() => {
    onImageChange("");
    setUrlInput("");
    setErrorMessage(null);
  }, [onImageChange]);

  /**
   * Drag & Drop event handlers
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (currentImageUrl) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleUploadFile(files[0]);
      }
    },
    [currentImageUrl, handleUploadFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!currentImageUrl) {
        setIsDragging(true);
      }
    },
    [currentImageUrl]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return {
    isUploading,
    isDragging,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    errorMessage,
    setErrorMessage,
    handleUploadFile,
    handleIngestUrl,
    handleRemove,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
}
