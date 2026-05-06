// features/skills/services/skills.service.ts
import { api } from "@/services/api/client";
import type { PaginationFilters } from "@/types";

type SkillFilters = PaginationFilters & {
  category?: string;
};

export const skillsService = {
  getSkills: async (filters: SkillFilters) => {
    const response = await api.get("/admin/skills", { params: filters });
    return response;
  },

  getSkillsForUser: async (filters?: SkillFilters) => {
    const response = await api.get("/user/skills", { params: filters });
    return response;
  },

  createSkill: async (data: Record<string, unknown>) => {
    const response = await api.post("/admin/skills", data);
    return response;
  },

  getSkillById: async (id: number) => {
    const response = await api.get(`/admin/skills/${id}`);
    return response;
  },

  updateSkill: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put(`/admin/skills/${id}`, data);
    return response;
  },

  deleteSkill: async (id: number) => {
    return api.delete(`/admin/skills/${id}`);
  },
};
