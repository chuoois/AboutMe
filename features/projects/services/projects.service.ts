// features/projects/services/projects.service.ts
import { api } from "@/services/api/client";
import type { PaginationFilters } from "@/types";

type ProjectFilters = PaginationFilters & {
  tag?: string;
};

export const projectsService = {
  getProjects: async (filters?: ProjectFilters) => {
    const response = await api.get("/admin/projects", { params: filters });
    return response;
  },

  getProjectsForUser: async (filters?: ProjectFilters) => {
    const response = await api.get("/user/projects", { params: filters });
    return response;
  },

  createProject: async (data: Record<string, unknown>) => {
    const response = await api.post("/admin/projects", data);
    return response;
  },

  getProjectById: async (id: number) => {
    const response = await api.get(`/admin/projects/${id}`);
    return response;
  },

  updateProject: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put(`/admin/projects/${id}`, data);
    return response;
  },

  deleteProject: async (id: number) => {
    const response = await api.delete(`/admin/projects/${id}`);
    return response;
  },
};
