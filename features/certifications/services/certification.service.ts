// features/certifications/services/certification.service.ts
import { api } from "@/services/api/client";
import type { PaginationFilters } from "@/types";

type CertFilters = PaginationFilters & {
  issuer?: string;
  startDate?: string;
  endDate?: string;
};

export const certificationService = {
  getCertificates: async (filters: CertFilters) => {
    const response = await api.get("/admin/certification", { params: filters });
    return response;
  },

  getCertificatesForUser: async (filters?: CertFilters) => {
    const response = await api.get("/user/certification", { params: filters });
    return response;
  },

  createCertificate: async (data: Record<string, unknown>) => {
    const response = await api.post("/admin/certification", data);
    return response;
  },

  getCertificateById: async (id: number) => {
    const response = await api.get(`/admin/certification/${id}`);
    return response;
  },

  updateCertificate: async (id: number, data: Record<string, unknown>) => {
    const response = await api.put(`/admin/certification/${id}`, data);
    return response;
  },

  deleteCertificate: async (id: number) => {
    return api.delete(`/admin/certification/${id}`);
  },
};
