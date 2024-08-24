import { getSession, getUserFromSession } from "@/actions/auth";
import { getCode, userScannedCode } from "@/actions/code";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const codeStr = params.id;


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
    return notFound();
  }

  await userScannedCode(userId, code);
  return NextResponse.redirect(
    new URL(`/${code.questId}`, process.env.MAIN_URL)
  );
}
