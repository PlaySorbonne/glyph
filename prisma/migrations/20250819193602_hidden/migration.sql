-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "mission" TEXT,
    "description" TEXT,
    "indice" TEXT,
    "lore" TEXT,
    "lieu" TEXT,
    "starts" DATETIME,
    "ends" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaires" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "clickable" BOOLEAN NOT NULL DEFAULT true,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "secondary" BOOLEAN NOT NULL DEFAULT true,
    "glyphPositionX" INTEGER DEFAULT 0,
    "glyphPositionY" INTEGER DEFAULT 0,
    "glyph" TEXT,
    "img" TEXT,
    "parentId" INTEGER,
    CONSTRAINT "Quest_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Quest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Quest" ("createdAt", "description", "ends", "glyph", "glyphPositionX", "glyphPositionY", "horaires", "id", "img", "indice", "lieu", "lore", "mission", "parentId", "points", "secondary", "starts", "title") SELECT "createdAt", "description", "ends", "glyph", "glyphPositionX", "glyphPositionY", "horaires", "id", "img", "indice", "lieu", "lore", "mission", "parentId", "points", "secondary", "starts", "title" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
CREATE UNIQUE INDEX "Quest_title_key" ON "Quest"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
