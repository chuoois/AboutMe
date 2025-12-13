import { NextRequest, NextResponse } from "next/server";
import { ProjectsController } from "@/server/controllers/projects.controller";
import { withAuth } from "@/server/middleware/auth.middleware";

// Helper để validate ID
function validateProjectId(rawId: string) {
  const id = Number(rawId);
  if (!rawId || isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return { valid: false, id: null };
  }
  return { valid: true, id };
}

// =========================================
// GET /api/projects/[id]
// Lấy chi tiết 1 project
// =========================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateProjectId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid project ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const project = await ProjectsController.getProject(validation.id!);
      return NextResponse.json(project);
    } catch (error: any) {
      if (error.message === "Project not found") {
        return NextResponse.json(
          { error: "Project not found" },
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
// PUT /api/projects/[id]
// Cập nhật project
// =========================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateProjectId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid project ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const body = await request.json();
      const updated = await ProjectsController.updateProject(validation.id!, body);
      return NextResponse.json(updated);
    } catch (error: any) {
      if (error.message === "Project not found") {
        return NextResponse.json(
          { error: "Project not found" },
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
// DELETE /api/projects/[id]
// Xóa project
// =========================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateProjectId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid project ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const result = await ProjectsController.deleteProject(validation.id!);
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      if (error.message === "Project not found") {
        return NextResponse.json(
          { error: "Project not found" },
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