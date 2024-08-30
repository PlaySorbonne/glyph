import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  let session = cookies().get("session")?.value;

  if (
    request.nextUrl.pathname.includes("/login") ||
    request.nextUrl.pathname.includes("/logout")
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!session) {
    return NextResponse.redirect(
      new URL(
        "/app/login?error=Vous devez vous connectez pour accéder à cette page",
        process.env.MAIN_URL
      )
    );
  }

  let infoUrl = new URL(
    `/api/access/${encodeURIComponent(session ?? "")}`,
    process.env.MAIN_URL
  );
  let infoResponse = await fetch(infoUrl);

  if (!infoResponse.ok) {
    return NextResponse.redirect(
      new URL(
        "/app/logout?error=Il y a eu un problème lors de la vérification de votre statut",
        process.env.MAIN_URL
      )
    );
  }

  let info;
  try {
    info = await infoResponse.json();
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        "/app/logout?error=Il y a eu un problème lors de la vérification de votre statut",
        process.env.MAIN_URL
      )
    );
  }

  if (request.nextUrl.pathname.includes("/admin") && !info.isAdmin) {
    return NextResponse.redirect(
      new URL(
        "/app?error=Vous n'avez pas les droits pour accéder à cette page",
        process.env.MAIN_URL
      )
    );
  }

  if (request.nextUrl.pathname.includes("/admin") && info.isAdmin) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!info.name || !info.welcomed) {
    return NextResponse.redirect(new URL("/app/welcome", process.env.MAIN_URL));
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
