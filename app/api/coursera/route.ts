import { NextRequest, NextResponse } from "next/server";
import { CourseraController } from "@/server/controller/coursera.controller";

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;

  const result = await CourseraController.getCertificates(page, limit);
  return NextResponse.json({ status: true, ...result });
}
