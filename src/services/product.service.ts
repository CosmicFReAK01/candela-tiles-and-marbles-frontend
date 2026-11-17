import { AdminProduct, ApiResponse } from "@/types";

/**
 * Product Service for fetching and persisting product data to the API Gateway / Database.
 * Fulfills Mandate 2 (Separation of business logic from UI components).
 */
class ProductService {
  /**
   * Fetch products from API Gateway / Database with optional filters
   */
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    material?: string;
    finish?: string;
    colour?: string;
    q?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: AdminProduct[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.subcategory) searchParams.set("subcategory", params.subcategory);
    if (params?.material) searchParams.set("material", params.material);
    if (params?.finish) searchParams.set("finish", params.finish);
    if (params?.colour) searchParams.set("colour", params.colour);
    if (params?.q) searchParams.set("q", params.q);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const response = await fetch(`/api/v1/products?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      products: data.products || [],
      total: data.pagination?.total || data.products?.length || 0,
    };
  }

  /**
   * Create or update a product in the database
   */
  async saveProduct(product: AdminProduct, isNew = false): Promise<AdminProduct> {
    const method = isNew ? "POST" : "PUT";
    const response = await fetch("/api/v1/products", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      let errorMsg = "Failed to save product in database";
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.error?.message || errorJson.message || errorMsg;
      } catch {
        // fallback
      }
      throw new Error(errorMsg);
    }

    const json: ApiResponse<AdminProduct> = await response.json();
    return json.data;
  }

  /**
   * Delete a product lot from database
   */
  async deleteProduct(id: string): Promise<boolean> {
    const response = await fetch(`/api/v1/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product from database");
    }

    const json: ApiResponse<{ id: string }> = await response.json();
    return json.success;
  }

  /**
   * Bulk purge un-updated image products
   */
  async purgeUnupdatedProducts(): Promise<{ purgedCount: number; remainingCount: number }> {
    const response = await fetch("/api/v1/admin/products/purge-unupdated", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to purge un-updated products");
    }

    const json: ApiResponse<{ purgedCount: number; remainingCount: number }> =
      await response.json();
    return json.data;
  }
}

export const productService = new ProductService();
