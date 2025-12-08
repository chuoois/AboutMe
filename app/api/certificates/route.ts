import { CourseraController } from "@/server/controllers/coursera.controller";

//
// =========================================
// GET /api/coursera
// Lấy danh sách certificates + search + filter + pagination
// =========================================
//
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);
  const search = params.get("search") || undefined;
  const issuer = params.get("issuer") || undefined;
  const startDate = params.get("startDate") || undefined;
  const endDate = params.get("endDate") || undefined;

  const result = await CourseraController.getCertificates(
    page,
    limit,
    search,
    issuer,
    startDate,
    endDate
  );

  return Response.json(result);
}

//
// =========================================
// POST /api/coursera
// Tạo certificate mới
// =========================================
//
export async function POST(req: Request) {
  const body = await req.json();
  const created = await CourseraController.createCertificate(body);
  return Response.json(created);
}
