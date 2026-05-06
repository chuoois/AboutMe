// services/certification.service.ts
import { api } from "@/lib/axios";
import type { PaginationFilters } from "@/types";

export type CertFilters = PaginationFilters & {
  issuer?: string;
  startDate?: string;
  endDate?: string;
};

export const certificationService = {
  getCertificates: async (filters: CertFilters) => {
    return api.get("/admin/certification", { params: filters });
  },

  getCertificatesForUser: async (filters?: CertFilters) => {
    return api.get("/user/certification", { params: filters });
  },

  createCertificate: async (data: Record<string, unknown>) => {
    return api.post("/admin/certification", data);
  },

  getCertificateById: async (id: number) => {
    return api.get(`/admin/certification/${id}`);
  },

  updateCertificate: async (id: number, data: Record<string, unknown>) => {
    return api.put(`/admin/certification/${id}`, data);
  },

  deleteCertificate: async (id: number) => {
    return api.delete(`/admin/certification/${id}`);
  },
};
