import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const softCache = new Map<
  string,
  {
    id: string;
    name: string | null;
    isAdmin: boolean;
    fraternityId: number | null;
    session: string;
  }
>();

export async function middleware(request: NextRequest) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  let continueResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  let session = (await cookies()).get("session")?.value;

  if (process.env.NO_AUTH) return continueResponse;

  if (
    request.nextUrl.pathname.includes("/login") ||
    request.nextUrl.pathname.includes("/logout")
  )
    return continueResponse;

  if (!session) {
    return NextResponse.redirect(
      new URL(
        "/app/login?error=Vous devez vous connectez pour accéder à cette page",
        process.env.NEXT_PUBLIC_MAIN_URL
      )
    );
  }

  let info;

  if (softCache.has(session)) {
    info = softCache.get(session);
  } else {
    let infoUrl = new URL(
      `/api/access/${encodeURIComponent(session ?? "")}`,
      process.env.NEXT_PUBLIC_MAIN_URL
    );
    let infoResponse = await fetch(infoUrl, { cache: "force-cache" });

    if (!infoResponse.ok) {
      return NextResponse.redirect(
        new URL(
          "/app/logout?error=Il y a eu un problème lors de la vérification de votre statut",
          process.env.NEXT_PUBLIC_MAIN_URL
        )
      );
    }

    try {
      info = await infoResponse.json();
    } catch (error) {
      return NextResponse.redirect(
        new URL(
          "/app/logout?error=Il y a eu un problème lors de la vérification de votre statut",
          process.env.NEXT_PUBLIC_MAIN_URL
        )
      );
    }
    if (info && info.fraternityId && info.name) {
      softCache.set(session, info);
    }
  }

  if (request.nextUrl.pathname.includes("/admin") && !info.isAdmin) {
    return NextResponse.redirect(
      new URL(
        "/app?error=Vous n'avez pas les droits pour accéder à cette page",
        process.env.NEXT_PUBLIC_MAIN_URL
      )
    );
  }

  if (request.nextUrl.pathname.includes("/welcome")) return continueResponse;

  if (request.nextUrl.pathname.includes("/admin") && info.isAdmin)
    return continueResponse;

  if (!info.name || !info.fraternityId) {
    return NextResponse.redirect(
      new URL("/welcome", process.env.NEXT_PUBLIC_MAIN_URL)
    );
  }

  return continueResponse;
}

export const config = {
  matcher: "/app/:path*",
};
