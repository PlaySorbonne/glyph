import { getSession, getUserFromSession } from "@/actions/auth";
import { getCode, userScannedCode } from "@/actions/code";
import { appUrl } from "@/utils";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const codeStr = params.id;

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(
      appUrl(`/login?error=${"Connectez vous d'abord pour ça"}`)
    );
  }

  let user = await getUserFromSession(session);
  let code = await getCode(codeStr);

  if (!code) {
    return notFound();
  }

  await userScannedCode(user!, code);
  return NextResponse.redirect(appUrl(`/${code.questId}?finished=true`));
}
