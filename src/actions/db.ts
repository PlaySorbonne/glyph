"use server";

import prisma from "@/lib/db";
import { appUrl, convertDDMMToDate, generateCode } from "@/utils";
import { redirect } from "next/navigation";
import { parse } from "csv-parse/sync";
import { Quest } from "@prisma/client";
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

  let records;
  let quests: Quest[];
  try {
    records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    quests = records.map((record: any) => {
      if (!record["Nom"]) {
        return null;
      }
      return {
        title: record["Nom"],
        lieu: record["Lieu"],
        starts: convertDDMMToDate(record["Date Début"]),
        ends: convertDDMMToDate(record["Date Fin"]),
        mission: record["Mission"],
        description: record["Description immersive"],
        lore: record["Lore"],
        points: record["Pts"] ? parseInt(record["Pts"].toString()) : 1,
        indice: record["Indice"],
        secondary: !["Principale", "Début"].includes(record["Style"]),
        horaires: record["Horaires"],
        glyph: record["glyph"],
        glyphPositionX: parseInt(record["X"]),
        glyphPositionY: parseInt(record["Y"]),
      } as Quest;
    });
    quests = quests.filter((quest) => quest !== null);
  } catch (error) {
    console.error("Error importing database from CSV:", error);
    return redirect(
      appUrl("/admin?error=" + encodeURIComponent("Invalid CSV file"))
    );
  }

  let error = "";

  try {
    await Promise.all(
      quests.map(async (quest) => {
        console.log("adding quest", quest.title);
        let dbQuest = await prisma.quest.upsert({
          where: { title: quest.title },
          update: quest,
          create: quest,
        });
        console.log("quest added", dbQuest.id);
      })
    );
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

export async function recalculateScore() {
  "use server";

  let codes = await prisma.code.findMany({
    include: {
      quest: true,
    },
  });

  await Promise.all(
    codes.map(async (code) => {
      if (code.quest) {
        await prisma.code.update({
          where: {
            id: code.id,
          },
          data: {
            points: code.quest.points,
          },
        });
      }
    })
  );

  let users = await prisma.user.findMany({
    include: {
      History: true,
    },
  });

  // delete duplicate quest histories
  await prisma.$executeRaw`
    DELETE FROM history
    WHERE id IN (
        SELECT id FROM (
            SELECT 
                id,
                ROW_NUMBER() OVER (PARTITION BY "userId", "questId" ORDER BY "createdAt" ASC) AS rn
            FROM history
            WHERE "questId" IS NOT NULL
        ) t
        WHERE t.rn > 1
    );
  `;

  await Promise.all(
    users.map(async (user) => {
      let score =
        user?.History.reduce((acc, history) => acc + history.points, 0) || 0;
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          score,
        },
      });
    })
  );

  let fraternities = await prisma.fraternity.findMany({
    include: {
      users: true,
    },
  });

  await Promise.all(
    fraternities.map(async (fraternity) => {
      let score = fraternity.users.reduce((acc, user) => acc + user.score, 0);
      await prisma.fraternity.update({
        where: {
          id: fraternity.id,
        },
        data: {
          score,
        },
      });
    })
  );

  return redirect(appUrl("/admin?message=Scores recalculated"));
}
