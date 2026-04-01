import { NextResponse } from "next/server";
import { verifyBasicAuthorization } from "@/lib/adminAuthServer";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const ok = await verifyBasicAuthorization(authorization);
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
