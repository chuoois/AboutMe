// features/skills/services/skills.server.ts
import { serverFetch } from "@/services/api/server";
import type { PaginatedResponse, Skill } from "@/types";

type SkillFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getSkillsForUser(
  filters: SkillFilters = {}
): Promise<PaginatedResponse<Skill>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const endpoint = `/user/skills${query ? `?${query}` : ""}`;

  return serverFetch<PaginatedResponse<Skill>>(endpoint, {
    revalidate: 60,
    tags: ["skills"],
  });
}
