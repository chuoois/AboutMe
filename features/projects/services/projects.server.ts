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
  const limit = filters.limit || 6;
  const search = filters.search;
  const tag = filters.tag;

  try {
    // Gọi trực tiếp controller để lấy dữ liệu từ DB (Server Component context)
    const result = await ProjectsController.getProjects(page, limit, search, tag);
    return result as unknown as PaginatedResponse<Project>;
  } catch (error) {
    // Log lỗi phía server (Vercel/hosting logs)
    console.error("[getProjectsForUser] Database Error:", error);
    
    // Trả về dữ liệu trống thay vì làm crash cả Server Component render
    return {
      pagination: { page, limit, total: 0, totalPages: 0 },
      data: [],
    };
  }
}


