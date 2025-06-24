/*
  Warnings:

  - You are about to drop the `QrCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Quest" ADD COLUMN "glyph" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QrCode";
PRAGMA foreign_keys=on;
