import { NextRequest, NextResponse } from "next/server";
import { CertificatesController } from "@/server/controllers/certification.controller";

//
// =========================================
// GET /api/certification
// Lấy danh sách certificates + search + filter + pagination
// =========================================
//
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const search = params.get("search") || undefined;
  const issuer = params.get("issuer") || undefined;
  const startDate = params.get("startDate") || undefined;
  const endDate = params.get("endDate") || undefined;

  const result = await CertificatesController.getCertificates(
    page,
    limit,
    search,
    issuer,
    startDate,
    endDate
  );

  return NextResponse.json(result);
}
