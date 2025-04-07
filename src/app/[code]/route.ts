import { getSession, getUserFromSession } from "@/actions/auth";
import { getCode, userScannedCode } from "@/actions/code";
import { appUrl } from "@/utils";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const codeStr = (await params).code;

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(
      appUrl(`/login?error=${"Connectez vous d'abord pour ça"}`)
    );
  }
  let [user, code] = await Promise.all([
    getUserFromSession(session),
    getCode(codeStr),
  ]);

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
      appUrl(`?error=${e.message ?? "Une erreur est survenue"}`)
    );
  }
  return NextResponse.redirect(appUrl(`${redirectUrl}&finished=true`));
}
