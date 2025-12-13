import { getDataSource } from "@/server/db/connection";
import { Certificate } from "@/server/entities/certificates.entity";

export const CertificatesController = {
  // ================================
  // GET LIST + SEARCH + FILTER + PAGINATION
  // ================================
  async getCertificates(
    page: number,
    limit: number,
    search?: string,
    issuer?: string,
    startDate?: string,
    endDate?: string
  ) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Certificate);
    const qb = repo.createQueryBuilder("cert");
    // Search
    if (search) {
      qb.andWhere(
        "(cert.coursera_name LIKE :s OR cert.specialization LIKE :s OR cert.issuer LIKE :s)",
        { s: `%${search}%` }
      );
    }
    // Filter issuer
    if (issuer) {
      qb.andWhere("cert.issuer = :issuer", { issuer });
    }
    // Filter date range
    if (startDate && endDate) {
      qb.andWhere("cert.issue_date BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      });
    }
    // Pagination + order
    qb.orderBy("cert.issue_date", "DESC")
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  },
  // ================================
  // GET 1 CERTIFICATE
  // ================================
  async getCertificate(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Certificate);
    const cert = await repo.findOne({ where: { id } });
    if (!cert) throw new Error("Certificate not found");
    return cert;
  },
  // ================================
  // CREATE NEW CERTIFICATE
  // ================================
  async createCertificate(payload: Partial<Certificate>) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Certificate);
    const newCert = repo.create(payload);
    return await repo.save(newCert);
  },
  // ================================
  // UPDATE CERTIFICATE
  // ================================
  async updateCertificate(id: number, payload: Partial<Certificate>) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Certificate);
    const cert = await repo.findOne({ where: { id } });
    if (!cert) throw new Error("Certificate not found");
    Object.assign(cert, payload);
    return await repo.save(cert);
  },
  // ================================
  // DELETE CERTIFICATE
  // ================================
  async deleteCertificate(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Certificate);
    const cert = await repo.findOne({ where: { id } });
    if (!cert) throw new Error("Certificate not found");
    await repo.remove(cert);
    return { message: "Deleted successfully" };
  },
};
