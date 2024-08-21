import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    let session = cookies().get("session");

    if (!session) return NextResponse.redirect(new URL("/", request.url));

    let isAdmin;
    try {
      const isAdminUrl = new URL(`/api/isAdmin/${encodeURIComponent(session?.value)}`, request.nextUrl.origin);
      const response = await fetch(isAdminUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      isAdmin = await response.json();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isAdmin.isAdmin)
      return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};