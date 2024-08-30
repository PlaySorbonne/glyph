import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  
  if (request.nextUrl.pathname.includes("/app")) {
    
  }

  if (request.nextUrl.pathname.includes("/admin")) {
    let session = cookies().get("session");

    if (!session)
      return NextResponse.redirect(
        new URL(
          "/app/login?error=Vous devez vous connectez pour accéder à cette page",
          process.env.MAIN_URL
        )
      );

    let isAdmin;
    try {
      const isAdminUrl = new URL(
        `/api/isAdmin/${encodeURIComponent(session?.value)}`,
        process.env.MAIN_URL
      );
      const response = await fetch(isAdminUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      isAdmin = await response.json();
    } catch (error) {
      console.error("Error checking admin status:", error);
      return NextResponse.redirect(
        new URL(
          `/app?error=Error lors de la vérification de votre statut d'administrateur`,
          process.env.MAIN_URL
        )
      );
    }

    if (!isAdmin.isAdmin)
      return NextResponse.redirect(
        new URL("/app?error=user is not admin", process.env.MAIN_URL)
      );
  }

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/app/:path*",
};
