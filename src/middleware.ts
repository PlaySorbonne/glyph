import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  
  const session = await auth();
  
  if (!session || !session.user) return NextResponse.redirect(new URL("/", request.url));
  
  const isAdmin = await fetch(`/api/isAdmin/${session.user.id}`).then((res) => res.json());
  
  console.log(isAdmin);

  // if (!user || !user.isAdmin)
  //   return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin"],
};
