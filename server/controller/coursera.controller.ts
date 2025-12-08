import { getDataSource } from "@/server/db/data";
import { CourseraCertificate } from "@/server/entities/coursera_certificates.entity";

export const CourseraController = {
  async getCertificates(page: number, limit: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(CourseraCertificate);
    const [data, total] = await repo.findAndCount({
      order: { issue_date: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
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
};
