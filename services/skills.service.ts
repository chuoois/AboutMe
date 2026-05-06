// services/skills.service.ts
import { api } from "@/lib/axios";
import type { PaginationFilters } from "@/types";

export type SkillFilters = PaginationFilters & {
  category?: string;
};

export const skillsService = {
  getSkills: async (filters: SkillFilters) => {
    return api.get("/admin/skills", { params: filters });
  },

  getSkillsForUser: async (filters?: SkillFilters) => {
    return api.get("/user/skills", { params: filters });
  },

  createSkill: async (data: Record<string, unknown>) => {
    return api.post("/admin/skills", data);
  },

  getSkillById: async (id: number) => {
    return api.get(`/admin/skills/${id}`);
  },

  updateSkill: async (id: number, data: Record<string, unknown>) => {
    return api.put(`/admin/skills/${id}`, data);
  },

  deleteSkill: async (id: number) => {
    return api.delete(`/admin/skills/${id}`);
  },
};