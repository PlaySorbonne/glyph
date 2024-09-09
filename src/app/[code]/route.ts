import { getSession, getUserFromSession } from "@/actions/auth";
import { getCode, userScannedCode } from "@/actions/code";
import { appUrl } from "@/utils";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const codeStr = params.code;

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

  let redirectUrl = code?.isQuest
    ? `/quest/${code.questId}?`
    : `/?error=vous avez reçu ${code.points} points`;

  try {
    await userScannedCode(user!, code);
  } catch (e: any) {
    return NextResponse.redirect(
      appUrl(`${redirectUrl}&error=${e.message ?? "Une erreur est survenue"}`)
    );
  }
  return NextResponse.redirect(appUrl(`${redirectUrl}&finished=true`));
}
