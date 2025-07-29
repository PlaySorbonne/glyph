import { getUserFromSession } from "@/actions/auth";
import { getQuest } from "@/actions/quests";
import { GLYPH_SIZE, glyphStringToArray } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = req.cookies.get("session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserFromSession(session);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  if (!body || body.length === 0) {
    return NextResponse.json(
      { error: "Glyph data is required" },
      { status: 400 }
    );
  }

  const glyph = body.trim();
  if (!glyph || glyph.length > GLYPH_SIZE ** 2 || glyph.match(/^[01]+$/)) {
    return NextResponse.json(
      { error: "Invalid glyph format" },
      { status: 400 }
    );
  }

  const questId = (await params).id;
  if (!questId) {
    return NextResponse.json(
      { error: "Quest ID is required" },
      { status: 400 }
    );
  }

  const quest = await getQuest(questId);
  if (!quest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  const correctGlyph = quest.glyph;
  if (!correctGlyph) {
    return NextResponse.json(
      { error: "Quest does not have a glyph" },
      { status: 400 }
    );
  }

  const out = isGlyphRotateEqual(glyph, correctGlyph)
    ? { success: true, message: "Glyph matches the quest glyph" }
    : { success: false, message: "Glyph does not match the quest glyph" };

  return NextResponse.json(out);
}

function rotateGlyph45Degrees(glyph: boolean[][]): boolean[][] {
  const rows = glyph.length;
  const cols = glyph[0].length;
  const rotated: boolean[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(false)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = glyph[r][c];
    }
  }

  return rotated;
}

function isGlyphEqual(glyph1: boolean[][], glyph2: boolean[][]): boolean {
  if (
    glyph1.length !== glyph2.length ||
    glyph1[0].length !== glyph2[0].length
  ) {
    return false;
  }

  for (let r = 0; r < glyph1.length; r++) {
    for (let c = 0; c < glyph1[0].length; c++) {
      if (glyph1[r][c] !== glyph2[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function isGlyphRotateEqual(glyph1: string, glyph2: string): boolean {
  if (!glyph1 || !glyph2) return false;

  let glyphArray1 = glyphStringToArray(glyph1);
  let glyphArray2 = glyphStringToArray(glyph2);

  if (!glyphArray1 || !glyphArray2) return false;

  if (glyphArray1.length !== glyphArray2.length) return false;
  if (glyphArray1[0].length !== glyphArray2[0].length) return false;

  for (let i = 0; i < 4; i++) {
    if (isGlyphEqual(glyphArray1, glyphArray2)) {
      return true;
    }
    glyphArray2 = rotateGlyph45Degrees(glyphArray2);
  }

  return false;
}
