import { MediaAsset, ApiResponse } from "@/types";

/**
 * Service to handle media upload, URL ingestion, and retrieval.
 * Adheres strictly to Mandate 2: Business logic decoupled from UI components.
 */
class MediaService {
  /**
   * Upload an image file via multipart/form-data
   */
  async uploadFile(file: File, categoryScope = "ALL"): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryScope", categoryScope);

    const response = await fetch("/api/v1/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Failed to upload image";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    const json: ApiResponse<MediaAsset> = await response.json();
    return json.data;
  }

  /**
   * Ingest an external image URL link into the database registry
   */
  async ingestUrl(url: string, altText?: string, categoryScope = "ALL"): Promise<MediaAsset> {
    const response = await fetch("/api/v1/media/ingest-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, altText, categoryScope }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to ingest image URL";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    const json: ApiResponse<MediaAsset> = await response.json();
    return json.data;
  }

  /**
   * List all media assets
   */
  async listMedia(params?: { category?: string; page?: number; limit?: number }): Promise<{
    items: MediaAsset[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await fetch(`/api/v1/media?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch media assets");
    }

    const json: ApiResponse<MediaAsset[]> = await response.json();
    return {
      items: json.data || [],
      total: json.meta?.totalItems || json.data?.length || 0,
    };
  }
}

export const mediaService = new MediaService();
