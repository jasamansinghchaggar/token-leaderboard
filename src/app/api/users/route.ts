import { NextResponse } from "next/server";
import { createUser } from "@/lib/server/repository";
import type { ApiResponse, UserPayload } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { publicKey, walletName } = (await request.json()) as UserPayload;

    if (!publicKey || !walletName) {
      const response: ApiResponse<null> = {
        success: false,
        error: "publicKey and walletName are required",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!publicKey.startsWith("G") || publicKey.length !== 56) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid public key format",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const user = await createUser(publicKey, walletName);

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
