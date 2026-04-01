import { NextRequest, NextResponse } from "next/server";

const isProtectedPath = (pathname: string) => {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/db") ||
    pathname === "/api/seed"
  );
};

const isPublicHiddenBoxRequest = (pathname: string, method: string) => {
  if (method !== "GET") return false;
  return pathname === "/api/db/labs" || pathname === "/api/db/labQuestions";
};

const unauthorizedResponse = (isApi: boolean) => {
  const response = isApi
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : new NextResponse("Authentication required", { status: 401 });

  response.headers.set("WWW-Authenticate", 'Basic realm="Admin Area"');
  return response;
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // HiddenBox on the public home page reads these two endpoints.
  if (isPublicHiddenBoxRequest(pathname, request.method)) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorizedResponse(pathname.startsWith("/api/"));
  }

  const verifyUrl = new URL("/api/admin/verify", request.url);
  const verifyRes = await fetch(verifyUrl, {
    method: "GET",
    headers: {
      authorization,
    },
  });

  if (!verifyRes.ok) {
    return unauthorizedResponse(pathname.startsWith("/api/"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/db/:path*", "/api/seed"],
};
