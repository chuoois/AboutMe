import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/server/middleware/auth.middleware";

export async function POST(request: NextRequest) {
  // Middleware đã tự động refresh rồi
  return withAuth(request, async (req, adminId) => {
    return NextResponse.json({ status: "OK", adminId });
  });
}