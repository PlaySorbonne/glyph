-- AlterTable
ALTER TABLE "Quest" ADD COLUMN "glyphCheck" TEXT;


-- Copying the glyph to glyphCheck if glyph exists
UPDATE "Quest" SET "glyphCheck" = "glyph" WHERE "glyph" IS NOT NULL;