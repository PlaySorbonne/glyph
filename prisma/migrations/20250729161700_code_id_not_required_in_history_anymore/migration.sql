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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
