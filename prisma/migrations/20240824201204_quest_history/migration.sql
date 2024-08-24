/*
  Warnings:

  - You are about to drop the `hasFinished` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "hasFinished";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "QuestHistory" (
    "userId" TEXT NOT NULL,
    "questId" INTEGER NOT NULL,
    "date" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "expires" DATETIME,

    PRIMARY KEY ("userId", "questId"),
    CONSTRAINT "QuestHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestHistory_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isQuest" BOOLEAN NOT NULL DEFAULT false,
    "questId" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 1,
    "expires" DATETIME,
    CONSTRAINT "Code_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Code" ("code", "description", "expires", "id", "isQuest", "points", "questId") SELECT "code", "description", "expires", "id", "isQuest", coalesce("points", 1) AS "points", "questId" FROM "Code";
DROP TABLE "Code";
ALTER TABLE "new_Code" RENAME TO "Code";
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
