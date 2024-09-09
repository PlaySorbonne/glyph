"use server";

import prisma from "@/lib/db";
import { appUrl, convertDDMMToDate, generateCode } from "@/utils";
import { redirect } from "next/navigation";
import { parse } from "csv-parse/sync";
import { Code, Quest } from "@prisma/client";
import { queryObjects } from "v8";
import { revalidatePath } from "next/cache";

export async function importDatabase(formData: FormData) {
  "use server";

  const file = formData.get("databaseFile") as File;
  if (!file) {
    return redirect(
      appUrl("/admin?error=" + encodeURIComponent("No file selected"))
    );
  }

  const fileContent = await file.text();
  let data;
  try {
    data = JSON.parse(fileContent);
  } catch (error) {
    return redirect(
      appUrl("/admin?error=" + encodeURIComponent("Invalid JSON file"))
    );
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

export async function importDatabaseFromCSV(formData: FormData) {
  "use server";

  const file = formData.get("databaseFile") as File;
  if (!file) {
    return redirect(
      appUrl("/admin?error=" + encodeURIComponent("No file selected"))
    );
  }

  let fileContent = await file.text();
  let position = fileContent.indexOf("\n");
  fileContent = fileContent.substring(position + 1, fileContent.length);
  console.log(fileContent);

  let records;
  let quests: (Quest & { code?: string })[];
  try {
    records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    quests = records.map((record: any) => {
      console.log(record);
      if (!record["Nom"]) {
        return null;
      }
      return {
        title: record["Nom"],
        lieu: record["Lieu"],
        starts: convertDDMMToDate(record["Date Début"]),
        ends: convertDDMMToDate(record["Date Fin"]),
        daysOpen: record["Jours"],
        hourOpen: record["Horaire Début"],
        hourClose: record["Horaire Fin"],
        code: record["Qrcode"],
        mission: record["Mission"],
        description: record["Description immersive"],
        lore: record["Lore"],
        points: record["Pts"] ? parseInt(record["Pts"].toString()) : 1,
        indice: record["Indice"],
        secondary: !["Principale", "Début"].includes(record["Style"]),
        horaires: record["Horaires"],
        img: record["Glyph"],
      } as Quest & { code?: string };
    });
    quests = quests.filter((quest) => quest !== null);
  } catch (error) {
    console.error("Error importing database from CSV:", error);
    return redirect(
      appUrl("/admin?error=" + encodeURIComponent("Invalid CSV file"))
    );
  }

  console.log(records);
  console.log(quests);

  let error = "";

  try {
    for (const quest of quests) {
      let { code, ...questWithoutCode } = quest;
      console.log("adding quest", questWithoutCode.title);
      let dbQuest = await prisma.quest.upsert({
        where: { title: questWithoutCode.title },
        update: questWithoutCode,
        create: questWithoutCode,
      });
      console.log("quest added", dbQuest.id);
      if (code) {
        console.log("adding code", code);
        let dbCode = await prisma.code.upsert({
          where: { code: code },
          update: {
            questId: dbQuest.id,
            isQuest: true,
            points: quest.points,
          },
          create: {
            code: code,
            questId: dbQuest.id,
            isQuest: true,
            points: quest.points,
          },
        });
        console.log("code added", dbCode.id);
      } else {
        code = generateCode();
        console.log("generating code", code);
        let dbCode = await prisma.code.create({
          data: {
            code: code,
            questId: dbQuest.id,
            isQuest: true,
            points: quest.points,
          },
        });
        console.log("code added", dbCode.id);
      }
    }
  } catch (error) {
    console.error("Error importing database from CSV:", error);
    error = "Failed to import database from CSV";
  } finally {
    revalidatePath("/");
    if (error) {
      return redirect(appUrl("/admin?error=" + encodeURIComponent(error)));
    }
    return redirect(
      appUrl("/admin?message=Database imported successfully from CSV")
    );
  }
}
