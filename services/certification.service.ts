// services/certification.service.ts
import { api } from "@/lib/axios";

type GetCertificatesFilters = {
  page?: number;
  limit?: number;
  search?: string;
  issuer?: string;
  startDate?: string;
  endDate?: string;
};

export const certificationService = {
  getCertificates: async (filters: GetCertificatesFilters) => {
    const response = await api.get("/admin/certification", { params: filters });
    return response;
  },

  getCertificatesforUser: async (filters?: GetCertificatesFilters) => {
    const response = await api.get("/user/certification", { params: filters });
    return response;
  },

  // Tạo certificate mới
  createCertificate: async (data: any) => {
    const response = await api.post("/admin/certification", data);
    return response;
  },

  // Lấy certificate theo id
  getCertificateById: async (id: number) => {
    const response = await api.get(`/admin/certification/${id}`);
    return response;
  },

  // Cập nhật certificate
  updateCertificate: async (id: number, data: any) => {
    const response = await api.put(`/admin/certification/${id}`, data);
    return response;
  },

  // Xóa certificate
  deleteCertificate: async (id: number) => {
    return api.delete(`/admin/certification/${id}`);
  },

};
