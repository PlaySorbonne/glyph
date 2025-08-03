/*
  Warnings:

  - You are about to drop the column `daysOpen` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the column `hourClose` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the column `hourOpen` on the `Quest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "codeId" INTEGER,
    "questId" INTEGER,
    "points" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "History_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_History" ("codeId", "date", "description", "id", "points", "questId", "userId") SELECT "codeId", "date", "description", "id", "points", "questId", "userId" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
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
    "secondary" BOOLEAN NOT NULL DEFAULT true,
    "glyphPositionX" INTEGER DEFAULT 0,
    "glyphPositionY" INTEGER DEFAULT 0,
    "glyph" TEXT,
    "img" TEXT,
    "parentId" INTEGER,
    CONSTRAINT "Quest_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Quest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Quest" ("createdAt", "description", "ends", "horaires", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title") SELECT "createdAt", "description", "ends", "horaires", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
CREATE UNIQUE INDEX "Quest_title_key" ON "Quest"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
