import { signIn } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  let code = req.nextUrl.searchParams.get("code");
  console.log("code", code);
  await signIn({ type: "discord", code });

  return NextResponse.redirect(new URL("/", req.nextUrl));
}
