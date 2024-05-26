/*
  Warnings:

  - You are about to drop the column `requests` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "requests",
ADD COLUMN     "editorcode" TEXT;
