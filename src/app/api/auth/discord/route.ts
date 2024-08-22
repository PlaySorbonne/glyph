import { cookies } from "next/headers";
import { signIn } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_TTL } from "@/utils/constants";

export async function GET(req: NextRequest, res: NextResponse) {
  let code = req.nextUrl.searchParams.get("code");
  let data = await signIn({ type: "discord", code });

  if (data.error) {
    console.error(data.msg);
    return NextResponse.error();
  }

  cookies().set("session", data.session, {
    expires:
      SESSION_TTL === -1
        ? new Date(2147483647000)
        : new Date(Date.now() + SESSION_TTL),
  });

  return NextResponse.redirect(new URL("/", process.env.MAIN_URL));
}
