import { logout } from "@/actions/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function GET(
  request: NextRequest,
) {
  let error = request.nextUrl.searchParams.get("error") ?? "Vous avez été déconnecté";

  await logout();
  return NextResponse.redirect(
    new URL(`/login?error=${error}`, process.env.MAIN_URL).toString()
  );
}
