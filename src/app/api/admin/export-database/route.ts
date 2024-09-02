import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromSession } from "@/actions/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromSession();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany();
    const quests = await prisma.quest.findMany();
    const codes = await prisma.code.findMany();
    const history = await prisma.history.findMany();
    const fraternities = await prisma.fraternity.findMany();

    const databaseExport = {
      users,
      quests,
      codes,
      history,
      fraternities,
    };

    // Remove null fields
    const removeNullFields = (obj: any) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null)
      );
    };

    const filteredDatabaseExport = Object.fromEntries(
      Object.entries(databaseExport).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.map(removeNullFields) : value,
      ])
    );

    const jsonString = JSON.stringify(filteredDatabaseExport, null, 2);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `glyphDB_${timestamp}.json`;

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Type", "application/json");

    return new NextResponse(jsonString, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error exporting database:", error);
    return NextResponse.json(
      { error: "Failed to export database" },
      { status: 500 }
    );
  }
}
