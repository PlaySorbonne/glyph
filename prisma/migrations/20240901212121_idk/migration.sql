/*
  Warnings:

  - You are about to drop the column `hoursOpen` on the `Quest` table. All the data in the column will be lost.

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Quest" ("createdAt", "daysOpen", "description", "ends", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title") SELECT "createdAt", "daysOpen", "description", "ends", "id", "img", "indice", "lieu", "lore", "mission", "points", "secondary", "starts", "title" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
