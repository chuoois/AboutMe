import { NextRequest, NextResponse } from "next/server";
import { SkillsController } from "@/server/controllers/skills.controller";
import { withAuth } from "@/server/middleware/auth.middleware";

//
// =========================================
// GET /api/skills
// Lấy danh sách skills + search + filter bằng category + pagination
// =========================================
//
export async function GET(req: NextRequest) {
  return withAuth(req, async (request, adminId) => {
    const params = request.nextUrl.searchParams;

    const page = Number(params.get("page") || 1);
    const limit = Number(params.get("limit") || 10);
    const search = params.get("search") || undefined;
    const category = params.get("category") || undefined;

    const result = await SkillsController.getSkills(
      page,
      limit,
      search,
      category
    );

    return NextResponse.json(result);
  });
}

//
// =========================================
// POST /api/skills
// Tạo skill mới
// =========================================
//
export async function POST(req: NextRequest) {
  return withAuth(req, async (request, adminId) => {
    const body = await request.json();
    const created = await SkillsController.createSkill(body);
    return NextResponse.json(created, { status: 201 });
  });
}