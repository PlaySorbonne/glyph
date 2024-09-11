"use server";

import { userScannedCodeFront } from "@/actions/code";
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export async function handleUserScanForm(formData: FormData) {
  let code = formData.get("code") as string;
  let out = await userScannedCodeFront(code);
  if (out.error) redirect(`?error=${out.msg}&code=${code}`);
  else if (out.data.questId)
    redirect(appUrl(`/quest/${out.data.questId}?finished=true`));
  else redirect(appUrl(`/`));
}
