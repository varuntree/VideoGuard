/*
  Warnings:

  - A unique constraint covering the columns `[editorcode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_editorcode_key" ON "User"("editorcode");
