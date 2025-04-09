-- CreateTable
CREATE TABLE "QrCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "size" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_code_key" ON "QrCode"("code");
