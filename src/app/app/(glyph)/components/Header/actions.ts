"use server";

import { userScannedCodeFront } from "@/actions/code";
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export async function handleUserScanForm(formData: FormData) {
  let code = formData.get("code") as string;
  let out = await userScannedCodeFront(code);
  
  if (out.error) {
    redirect(`${appUrl("/")}?error=${encodeURIComponent(out.msg)}&code=${encodeURIComponent(code)}`);
  } else if (out.data.questId) {
    redirect(`${appUrl(`/quest/${out.data.questId}`)}?success=${encodeURIComponent("Quête terminée !")}`);
  } else {
    redirect(`${appUrl("/")}?success=${encodeURIComponent(`Vous avez reçu ${out.data.points} points`)}`);
  }
}