import { NextRequest, NextResponse } from "next/server";
import { CertificatesController } from "@/server/controllers/certification.controller";
import { withAuth } from "@/server/middleware/auth.middleware";

// Helper để validate ID
function validateCertificateId(rawId: string) {
  const id = Number(rawId);
  if (!rawId || isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return { valid: false, id: null };
  }
  return { valid: true, id };
}

// =========================================
// GET /api/certification/[id]
// Lấy chi tiết 1 certificate
// =========================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateCertificateId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid certificate ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const certificate = await CertificatesController.getCertificate(validation.id!);
      return NextResponse.json(certificate);
    } catch (error: any) {
      if (error.message === "Certificate not found") {
        return NextResponse.json(
          { error: "Certificate not found" },
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
// PUT /api/certification/[id]
// Cập nhật certificate
// =========================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateCertificateId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid certificate ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const body = await request.json();
      const updated = await CertificatesController.updateCertificate(validation.id!, body);
      return NextResponse.json(updated);
    } catch (error: any) {
      if (error.message === "Certificate not found") {
        return NextResponse.json(
          { error: "Certificate not found" },
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
// DELETE /api/certification/[id]
// Xóa certificate
// =========================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const validation = validateCertificateId(rawId);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid certificate ID. Must be a positive integer." },
      { status: 400 }
    );
  }

  return withAuth(req, async (request, adminId) => {
    try {
      const result = await CertificatesController.deleteCertificate(validation.id!);
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      if (error.message === "Certificate not found") {
        return NextResponse.json(
          { error: "Certificate not found" },
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