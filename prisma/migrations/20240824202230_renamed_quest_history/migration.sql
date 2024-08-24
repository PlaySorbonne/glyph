/*
  Warnings:

  - You are about to drop the `QuestHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuestHistory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "hasFinished" (
    "userId" TEXT NOT NULL,
    "questId" INTEGER NOT NULL,
    "date" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "expires" DATETIME,

    PRIMARY KEY ("userId", "questId"),
    CONSTRAINT "hasFinished_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hasFinished_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
