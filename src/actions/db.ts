"use server";

import prisma from "@/lib/db";
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export async function importDatabase(formData: FormData) {
  "use server";
  
  const file = formData.get("databaseFile") as File;
  if (!file) {
    return redirect(appUrl("/admin?error=" + encodeURIComponent("No file selected")));
  }

  const fileContent = await file.text();
  let data;
  try {
    data = JSON.parse(fileContent);
  } catch (error) {
    return redirect(appUrl("/admin?error=" + encodeURIComponent("Invalid JSON file")));
  }
  
  let error = "";

  try {
    if (data.fraternities) {
      for (const fraternity of data.fraternities) {
        await prisma.fraternity.upsert({
          where: { id: fraternity.id },
          update: fraternity,
          create: fraternity,
        });
      }
    }

    if (data.users) {
      for (const user of data.users) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
      }
    }
    
    if (data.quests) {
        await prisma.quest.deleteMany();
        await prisma.code.deleteMany();
        await prisma.quest.createMany({
            data: data.quests,
        });
    }

    if (data.codes) {
      for (const code of data.codes) {
        await prisma.code.upsert({
          where: { id: code.id },
          update: code,
          create: code,
        });
      }
    }

    if (data.history) {
      for (const historyItem of data.history) {
        await prisma.history.upsert({
          where: { id: historyItem.id },
          update: historyItem,
          create: historyItem,
        });
      }
    }

  } catch (error) {
    console.error("Error importing database:", error);
    error = "Failed to import database";
  } finally {   
    if (error) {
      return redirect(appUrl("/admin?error=" + encodeURIComponent(error)));
    }
    return redirect(appUrl("/admin?message=Database imported successfully"));
  }
}
