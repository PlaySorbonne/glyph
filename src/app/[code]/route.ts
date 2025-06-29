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
      `${appUrl("/login")}?error=${encodeURIComponent(
        "Connectez vous d'abord pour ça"
      )}`
    );
  }

  let [user, code] = await Promise.all([
    getUserFromSession(session),
    getCode(codeStr),
  ]);

  if (!code) {
    return notFound();
  }

  let redirectUrl = code?.isQuest ? `/quest/${code.questId}` : `/`;

  try {
    await userScannedCode(user!, code);

    if (code.isQuest) {
      return NextResponse.redirect(
        `${appUrl(redirectUrl)}?success=${encodeURIComponent(
          "Quête terminée !"
        )}`
      );
    } else {
      return NextResponse.redirect(
        `${appUrl(redirectUrl)}?success=${encodeURIComponent(
          `Vous avez reçu ${code.points} points`
        )}`
      );
    }
  } catch (e: any) {
    return NextResponse.redirect(
      `${appUrl("/")}?error=${encodeURIComponent(
        e.message ?? "Une erreur est survenue"
      )}`
    );
  }
}
