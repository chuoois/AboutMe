import { NextRequest, NextResponse } from "next/server";
import { ProjectsController } from "@/server/controllers/projects.controller";
import { withAuth } from "@/server/middleware/auth.middleware";

//
// =========================================
// GET /api/projects
// Lấy danh sách projects + search + filter bằng tag + pagination
// =========================================
//
export async function GET(req: NextRequest) {
  return withAuth(req, async (request, adminId) => {
    const params = request.nextUrl.searchParams;

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
  });
}

//
// =========================================
// POST /api/projects
// Tạo project mới
// =========================================
//
export async function POST(req: NextRequest) {
  return withAuth(req, async (request, adminId) => {
    const body = await request.json();
    const created = await ProjectsController.createProject(body);
    return NextResponse.json(created, { status: 201 });
  });
}