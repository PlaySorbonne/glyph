import { getSession, getUserFromSession } from "@/actions/auth";
import { getCode, userScannedCode } from "@/actions/code";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const codeStr = req.nextUrl.searchParams.get("code");

  if (!codeStr) {
    return NextResponse.next();
  }

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${"Connectez vous d'abord pour ça"}`,
        process.env.MAIN_URL
      )
    );
  }
  
  let userId = (await getUserFromSession(session))?.id;
  
  if (!userId) {
    cookies().delete("session");
    return NextResponse.redirect(
      new URL(
        `/login?error=${"Connectez vous d'abord pour ça"}`,
        process.env.MAIN_URL
      )
    );
  }
  
  let code = await getCode(codeStr);

  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${"Code invalide"}`,
        process.env.MAIN_URL
      )
    );
  }

  await userScannedCode(userId, code);
  return NextResponse.redirect(
    new URL(
      `/${code.questId}`,
      process.env.MAIN_URL
    )
  );
}
