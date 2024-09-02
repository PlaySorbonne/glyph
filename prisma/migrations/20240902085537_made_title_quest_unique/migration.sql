/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Quest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quest_title_key" ON "Quest"("title");
