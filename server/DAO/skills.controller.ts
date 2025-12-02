import { selectQuery } from "@/server/db/data";

export const getSkills = async (page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const dataSql = `
    SELECT category, skill_name, icon
    FROM skills
    LIMIT ? OFFSET ?
  `;

  const countSql = `SELECT COUNT(*) AS total FROM skills`;

  const data = await selectQuery(dataSql, [limit, offset]);
  const total = (await selectQuery(countSql))[0]?.total ?? 0;

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit
  }
};