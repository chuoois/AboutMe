import { getSkills } from '@/server/DAO/skills.controller';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "5");

  const result = await getSkills(page, limit);

  return Response.json(result);
}
