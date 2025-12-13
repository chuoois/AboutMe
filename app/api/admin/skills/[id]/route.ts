import { NextRequest, NextResponse } from "next/server";
import { SkillsController } from "@/server/controllers/skills.controller";
import { withAuth } from "@/server/middleware/auth.middleware";

// Helper để validate ID
function validateSkillId(rawId: string) {
  const id = Number(rawId);
  if (!rawId || isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return { valid: false, id: null };
  }
  return { valid: true, id };
}

// =========================================
// GET /api/skills/[id]
// Lấy chi tiết 1 skill
// =========================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateSkillId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid skill ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const skill = await SkillsController.getSkill(validation.id!);
      return NextResponse.json(skill);
    } catch (error: any) {
      if (error.message === "Skill not found") {
        return NextResponse.json(
          { error: "Skill not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

// =========================================
// PUT /api/skills/[id]
// Cập nhật skill
// =========================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateSkillId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid skill ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const body = await request.json();
      const updated = await SkillsController.updateSkill(validation.id!, body);
      return NextResponse.json(updated);
    } catch (error: any) {
      if (error.message === "Skill not found") {
        return NextResponse.json(
          { error: "Skill not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

// =========================================
// DELETE /api/skills/[id]
// Xóa skill
// =========================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateSkillId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid skill ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const result = await SkillsController.deleteSkill(validation.id!);
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      if (error.message === "Skill not found") {
        return NextResponse.json(
          { error: "Skill not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}