/*
  Warnings:

  - You are about to drop the column `glyphSize` on the `Quest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "img" TEXT,
    "mission" TEXT,
    "description" TEXT,
    "indice" TEXT,
    "lore" TEXT,
    "lieu" TEXT,
    "daysOpen" TEXT,
    "hourOpen" TEXT,
    "hourClose" TEXT,
    "secondary" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER NOT NULL DEFAULT 1,
    "starts" DATETIME,
    "ends" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaires" TEXT,
    "glyph" TEXT,
    "glyphPositionX" INTEGER DEFAULT 0,
    "glyphPositionY" INTEGER DEFAULT 0
);
INSERT INTO "new_Quest" ("createdAt", "daysOpen", "description", "ends", "glyph", "glyphPositionX", "glyphPositionY", "horaires", "hourClose", "hourOpen", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title") SELECT "createdAt", "daysOpen", "description", "ends", "glyph", "glyphPositionX", "glyphPositionY", "horaires", "hourClose", "hourOpen", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
CREATE UNIQUE INDEX "Quest_title_key" ON "Quest"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
