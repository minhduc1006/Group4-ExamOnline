import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Các route không yêu cầu đăng nhập
const guestPath = [
  "/auth/login",
  "/auth/register",
  "/about-us",
  "/access-denied",
  "/email-service/forgot",
  "/",
  "/not-found",
  "/api/auth/refresh",
  "/api/auth/token",
  "/support",
  "/support/account-support",
  "/articles",
  "/articles/number",
];

// Các route chỉ dành cho khách (người chưa đăng nhập)
const onlyGuestPath = [
  "/auth/login",
  "/auth/register",
  "/email-service/forgot",
];

// Phân quyền theo role
const rolePaths: Record<string, string[]> = {
  USER: [
    "/profile",
    "/update-profile",
    "/about-us",
    "/access-denied",
    "/",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
    "/email-service/add-email",
    "/email-service/delete-email",
    "/support",
    "/support/account-support",
    "/support/send-support-request",
    "/articles",
    "/articles/number",
    "/exam",
    "/practice",
    "/mockexam",
    "/practice-test",
  ],
  ADMIN: [
    "/manager/account-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
  QUIZ_MANAGER: [
    "/manager/quiz-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
    "/manager/quiz-manager/practice",
    "/manager/quiz-manager/exam",
    "/manager/quiz-manager/mock-exam"
  ],
  SUPPORT_MANAGER: [
    "/manager/support-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
  CONTENT_MANAGER: [
    "/manager/content-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
};

const allPath = [
  ...new Set([
    ...guestPath,
    ...onlyGuestPath,
    ...Object.values(rolePaths).flat(),
  ]),
];

const normalizeArticlePath = (pathname: string): string => {
  // Kiểm tra nếu pathname có dạng "/articles/{id}" với {id} là số tự nhiên
  if (/^\/articles\/\d+$/.test(pathname)) {
    return "/articles/number";
  }
  return pathname; // Giữ nguyên nếu không phải "/articles/{id}"
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const currentPath = normalizeArticlePath(pathname);

  if (currentPath.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (
    currentPath.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|mp3|woff2?|ttf|otf|eot|json)$/
    )
  ) {
    return NextResponse.next();
  }

  if (currentPath.match(/^\/(login|home)\/.+/)) {
    return NextResponse.next();
  }

  if (!allPath.includes(currentPath)) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refresh_token")?.value;
  const accessToken = (await cookieStore).get("access_token")?.value;
  console.log(currentPath);
  console.log(refreshToken);

  if (!refreshToken) {
    if (!guestPath.includes(currentPath)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  if (refreshToken && onlyGuestPath.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (accessToken) {
    try {
      const decoded = jwtDecode<{ scope?: string }>(accessToken);
      const scope = decoded?.scope;

      console.log("scope:", scope);

      if (!scope || !rolePaths[scope]?.includes(currentPath)) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("error decode:", error);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}
