/*
  Warnings:

  - You are about to drop the column `global` on the `Quest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "codeId" INTEGER NOT NULL,
    "questId" INTEGER,
    "points" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "History_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_History" ("codeId", "date", "description", "id", "points", "userId") SELECT "codeId", "date", "description", "id", "points", "userId" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
CREATE TABLE "new_Quest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "img" TEXT,
    "description" TEXT,
    "lore" TEXT,
    "secondary" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER NOT NULL DEFAULT 1,
    "starts" DATETIME,
    "ends" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Quest" ("createdAt", "description", "ends", "id", "img", "lore", "points", "starts", "title") SELECT "createdAt", "description", "ends", "id", "img", "lore", "points", "starts", "title" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
