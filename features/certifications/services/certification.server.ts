// features/certifications/services/certification.server.ts
import { serverFetch } from "@/services/api/server";
import type { PaginatedResponse, Cert } from "@/types";

type CertFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getCertificatesForUser(
  filters: CertFilters = {}
): Promise<PaginatedResponse<Cert>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const endpoint = `/user/certification${query ? `?${query}` : ""}`;

  return serverFetch<PaginatedResponse<Cert>>(endpoint, {
    revalidate: 60,
    tags: ["certifications"],
  });
}
