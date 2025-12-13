import { NextRequest, NextResponse } from "next/server";
import { SkillsController } from "@/server/controllers/skills.controller";

//
// =========================================
// GET /api/skills
// Lấy danh sách skills + search + filter bằng category + pagination
// =========================================
//
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

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
}