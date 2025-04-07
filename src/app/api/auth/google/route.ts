import { cookies } from "next/headers";
import { signIn } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_TTL } from "@/utils/constants";
import { appUrl } from "@/utils";

export async function GET(req: NextRequest) {
  let code = req.nextUrl.searchParams.get("code");
  let data = await signIn({ type: "google", code });

  if (data.error) {
    console.error(data.msg);
    return NextResponse.redirect(appUrl(`/login?error=${data.msg}`));
  }

  (await cookies()).set("session", data.session, {
    expires:
      SESSION_TTL === -1
        ? new Date(2147483647000)
        : new Date(Date.now() + SESSION_TTL),
  });
  if (data.user.fraternityId) {
    (await cookies()).set("fraternityId", data.user.fraternityId.toString(), {
      expires:
        SESSION_TTL === -1
          ? new Date(2147483647000)
          : new Date(Date.now() + SESSION_TTL),
    });
  }
  if (data.user.name) {
    (await cookies()).set("name", data.user.name, {
      expires:
        SESSION_TTL === -1
          ? new Date(2147483647000)
          : new Date(Date.now() + SESSION_TTL),
    });
  }

  return NextResponse.redirect(appUrl("/"));
}
