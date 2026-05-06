// features/skills/services/skills.server.ts
import { SkillsController } from "@/server/controllers/skills.controller";
import type { PaginatedResponse, Skill } from "@/types";

type SkillFilters = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export async function getSkillsForUser(
  filters: SkillFilters = {}
): Promise<PaginatedResponse<Skill>> {
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const search = filters.search;
  const category = filters.category;

  // Gọi trực tiếp controller
  const result = await SkillsController.getSkills(page, limit, search, category);
  
  return result as unknown as PaginatedResponse<Skill>;
}

