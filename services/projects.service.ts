// services/projects.service.ts
import { api } from "@/lib/axios";

// Định nghĩa type cho filters (tùy chọn, giúp code rõ ràng hơn)
type GetProjectsFilters = {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
};

export const projectsService = {
  // Lấy danh sách projects + pagination + search + filter by tag
  getProjects: async (filters?: GetProjectsFilters) => {
    const response = await api.get("/admin/projects", { params: filters });
    return response;
  },

  getProjectsforUser: async (filters?: GetProjectsFilters) => {
    const response = await api.get("/user/projects", { params: filters });
    return response;
  },

  // Tạo project mới
  createProject: async (data: any) => {
    const response = await api.post("/admin/projects", data);
    return response;
  },

  // Lấy chi tiết 1 project theo id
  getProjectById: async (id: number) => {
    const response = await api.get(`/admin/projects/${id}`);
    return response;
  },

  // Cập nhật project
  updateProject: async (id: number, data: any) => {
    const response = await api.put(`/admin/projects/${id}`, data);
    return response;
  },

  // Xóa project
  deleteProject: async (id: number) => {
    const response = await api.delete(`/admin/projects/${id}`);
    return response;
  },
};