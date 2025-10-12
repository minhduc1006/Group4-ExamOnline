import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const privatePaths = ["/private"];

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refresh_token")?.value;
  const accessToken = (await cookieStore).get("access_token")?.value;

  if (
    privatePaths.some((path) => request.nextUrl.pathname.includes(path)) &&
    !refreshToken
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      //@ts-expect-error
      if (decoded.scope !== "ADMIN") {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/login") && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

