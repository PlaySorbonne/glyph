/*
  Warnings:

  - You are about to drop the column `daysOpen` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the column `hourClose` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the column `hourOpen` on the `Quest` table. All the data in the column will be lost.

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
    "points" INTEGER NOT NULL DEFAULT 1,
    "starts" DATETIME,
    "ends" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaires" TEXT,
    "secondary" BOOLEAN NOT NULL DEFAULT true,
    "glyphPositionX" INTEGER DEFAULT 0,
    "glyphPositionY" INTEGER DEFAULT 0,
    "glyph" TEXT
);
INSERT INTO "new_Quest" ("createdAt", "description", "ends", "glyph", "glyphPositionX", "glyphPositionY", "horaires", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title") SELECT "createdAt", "description", "ends", "glyph", "glyphPositionX", "glyphPositionY", "horaires", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
CREATE UNIQUE INDEX "Quest_title_key" ON "Quest"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
