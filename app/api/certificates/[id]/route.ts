import { CourseraController } from "@/server/controllers/coursera.controller";

//
// =========================================
// GET /api/coursera/:id
// =========================================
//
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const cert = await CourseraController.getCertificate(id);
    return Response.json(cert);
  } catch (err: any) {
    return new Response(err.message, { status: 404 });
  }
}

//
// =========================================
// PUT /api/coursera/:id
// Update certificate
// =========================================
//
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const updated = await CourseraController.updateCertificate(id, body);
    return Response.json(updated);
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}

//
// =========================================
// DELETE /api/coursera/:id
// Xóa certificate
// =========================================
//
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const result = await CourseraController.deleteCertificate(id);
    return Response.json(result);
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
