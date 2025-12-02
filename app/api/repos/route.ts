import { getRepos } from '@/server/DAO/repos.controller';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");

    const result = await getRepos(page, limit);

    return Response.json(result);
}
