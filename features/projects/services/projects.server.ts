// features/projects/services/projects.server.ts
// Server-side data fetching for RSC (React Server Components)

import { serverFetch } from "@/services/api/server";
import type { PaginatedResponse, Project } from "@/types";

type ProjectFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getProjectsForUser(
  filters: ProjectFilters = {}
): Promise<PaginatedResponse<Project>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const endpoint = `/user/projects${query ? `?${query}` : ""}`;

  return serverFetch<PaginatedResponse<Project>>(endpoint, {
    revalidate: 60,
    tags: ["projects"],
  });
}
