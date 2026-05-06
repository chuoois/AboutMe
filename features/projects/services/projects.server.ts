// features/projects/services/projects.server.ts
// Server-side data fetching for RSC (React Server Components)

import { ProjectsController } from "@/server/controllers/projects.controller";
import type { PaginatedResponse, Project } from "@/types";

type ProjectFilters = {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
};

export async function getProjectsForUser(
  filters: ProjectFilters = {}
): Promise<PaginatedResponse<Project>> {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const search = filters.search;
  const tag = filters.tag;

  // Gọi trực tiếp controller để lấy dữ liệu từ DB (Server Component context)
  // Việc này tránh được lỗi fetch đến localhost trong môi trường production
  const result = await ProjectsController.getProjects(page, limit, search, tag);
  
  // Cast to expected type if necessary (Project entity vs Project type)
  return result as unknown as PaginatedResponse<Project>;
}

