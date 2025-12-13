// services/skills.service.ts
import { api } from "@/lib/axios";

type GetSkillsFilters = {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
};

export const skillsService = {
  getSkills: async (filters: GetSkillsFilters) => {
    const response = await api.get("/admin/skills", { params: filters });
    return response;
  },

  getSkillsforUser: async (filters?: GetSkillsFilters) => {
    const response = await api.get("/user/skills", { params: filters });
    return response;
  },

  // Tạo skill mới
  createSkill: async (data: any) => {
    const response = await api.post("/admin/skills", data);
    return response;
  },

  // Lấy skill theo id
  getSkillById: async (id: number) => {
    const response = await api.get(`/admin/skills/${id}`);
    return response;
  },

  // Cập nhật skill
  updateSkill: async (id: number, data: any) => {
    const response = await api.put(`/admin/skills/${id}`, data);
    return response;
  },

  // Xóa skill
  deleteSkill: async (id: number) => {
    return api.delete(`/admin/skills/${id}`);
  },
};