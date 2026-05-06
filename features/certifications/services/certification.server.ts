// features/certifications/services/certification.server.ts
import { CertificatesController } from "@/server/controllers/certification.controller";
import type { PaginatedResponse, Cert } from "@/types";

type CertFilters = {
  page?: number;
  limit?: number;
  search?: string;
  issuer?: string;
};

export async function getCertificatesForUser(
  filters: CertFilters = {}
): Promise<PaginatedResponse<Cert>> {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const search = filters.search;
  const issuer = filters.issuer;

  try {
    // Gọi trực tiếp controller
    const result = await CertificatesController.getCertificates(page, limit, search, issuer);
    return result as unknown as PaginatedResponse<Cert>;
  } catch (error) {
    console.error("[getCertificatesForUser] Database Error:", error);
    return {
      pagination: { page, limit, total: 0, totalPages: 0 },
      data: [],
    };
  }
}


