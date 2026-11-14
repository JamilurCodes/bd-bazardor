import type { Product } from "@/lib/type";

const API_BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

interface ApiResponse<T> {
  data?: T;
}

/**
 * Fetches JSON from the BazarDor API with five-minute revalidation,
 * so page renders stay fast without showing stale prices for long.
 */
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `BazarDor API request failed (${response.status}): ${endpoint}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Extracts the product list from the API's response shapes:
 * a direct array, `{ data: [...] }`, or `{ data: { products: [...] } }`.
 */
function extractProducts(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload as Product[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = (payload as ApiResponse<unknown>).data;

  if (Array.isArray(data)) {
    return data as Product[];
  }

  if (data && typeof data === "object") {
    const products = (data as { products?: unknown }).products;

    if (Array.isArray(products)) {
      return products as Product[];
    }
  }

  return [];
}

/** Retrieves the complete product list. */
export async function getProducts(): Promise<Product[]> {
  const payload = await fetchApi<unknown>("/products");

  return extractProducts(payload);
}

/** Retrieves products belonging to a category. */
export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const category = categorySlug.trim();

  if (!category) {
    return [];
  }

  const query = new URLSearchParams({
    category,
  });

  const payload = await fetchApi<unknown>(
    `/products?${query.toString()}`,
  );

  return extractProducts(payload);
}

/** Retrieves one product using the API's numeric ID. */
export async function getProductById(
  id: number | string,
): Promise<Product | null> {
  const normalizedId = String(id).trim();

  if (!normalizedId) {
    return null;
  }

  const payload = await fetchApi<unknown>(
    `/products/${encodeURIComponent(normalizedId)}`,
  );

  const products = extractProducts(payload);

  if (products.length > 0) {
    return products[0];
  }

  // Some API responses wrap the product directly inside `data`.
  if (payload && typeof payload === "object") {
    const data = (payload as ApiResponse<unknown>).data;

    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      "slug" in data
    ) {
      return data as Product;
    }

    // Also support a direct single-product response.
    if ("slug" in payload) {
      return payload as Product;
    }
  }

  return null;
}