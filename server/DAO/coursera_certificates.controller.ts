import { selectQuery } from "@/server/db/data";

export const getCourseraCertificates = async (page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const dataSql = `
    SELECT issue_date, icon, iconColor, coursera_name, description, credential_url
    FROM coursera_certificates
    ORDER BY issue_date DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `SELECT COUNT(*) AS total FROM coursera_certificates`;

  const data = await selectQuery(dataSql, [limit, offset]);
  const total = (await selectQuery(countSql))[0]?.total ?? 0;


  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit
  };
};
