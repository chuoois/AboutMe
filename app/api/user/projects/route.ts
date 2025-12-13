import { NextRequest, NextResponse } from "next/server";
import { ProjectsController } from "@/server/controllers/projects.controller";

//
// =========================================
// GET /api/projects
// Lấy danh sách projects + search + filter bằng tag + pagination
// =========================================
//
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const search = params.get("search") || undefined;
  const tag = params.get("tag") || undefined;

  const result = await ProjectsController.getProjects(
    page,
    limit,
    search,
    tag
  );

  return NextResponse.json(result);
}