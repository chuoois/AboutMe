// services/projects.service.ts
import { api } from "@/lib/axios";
import type { PaginationFilters } from "@/types";

export type ProjectFilters = PaginationFilters & {
  tag?: string;
};

export const projectsService = {
  getProjects: async (filters?: ProjectFilters) => {
    return api.get("/admin/projects", { params: filters });
  },

  getProjectsForUser: async (filters?: ProjectFilters) => {
    return api.get("/user/projects", { params: filters });
  },

  createProject: async (data: Record<string, unknown>) => {
    return api.post("/admin/projects", data);
  },

  getProjectById: async (id: number) => {
    return api.get(`/admin/projects/${id}`);
  },

  updateProject: async (id: number, data: Record<string, unknown>) => {
    return api.put(`/admin/projects/${id}`, data);
  },

  deleteProject: async (id: number) => {
    return api.delete(`/admin/projects/${id}`);
  },
};