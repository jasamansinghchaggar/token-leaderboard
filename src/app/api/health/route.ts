import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mongoStatus: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
