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
  "/support/payment-support",
  "/articles",
  "/articles/number",
  "/payment-status",
  "/get-ranking",
  "/schedule",
  "/support/exam-support",
  "/email-service/add-email",
  "/email-service/delete-email",
];

// Các route chỉ dành cho khách (người chưa đăng nhập)
const onlyGuestPath = [
  "/auth/login",
  "/auth/register",
  "/email-service/forgot",
];

// Phân quyền theo role
const rolePaths: Record<string, string[]> = {
  STUDENT: [
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
    "/support/payment-support",
    "/support/send-support-request",
    "/articles",
    "/articles/number",
    "/exam",
    "/practice",
    "/mockexam",
    "/schedule",
    "/test",
    "/payment-status",
    "/get-ranking",
    "/support/exam-support",
    "/support/support-tracking"
  ],
  ADMIN: [
    "/management/account-management",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
  QUIZ_MANAGER: [
    "/management/quiz-management",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
    "/management/quiz-management/practice",
    "/management/quiz-management/exam",
    "/management/quiz-management/mock-exam",
    "/management/quiz-management/test",
  ],
  SUPPORT_MANAGER: [
    "/management/support-management",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
  CONTENT_MANAGER: [
    "/management/content-management",
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

const normalizePath = (pathname: string): string => {
  // Kiểm tra nếu pathname có dạng "/articles/{id}" với {id} là số tự nhiên
  if (pathname.startsWith("/articles/")) {
    return "/articles/number";
  }
  if (pathname.startsWith("/test")) {
    return "/test";
  }
  return pathname;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const currentPath = normalizePath(pathname);

  if (currentPath.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (
    currentPath.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|mp3|woff2?|ttf|otf|eot|json|avif)$/
    )
  ) {
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
