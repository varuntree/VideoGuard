/*
  Warnings:

  - You are about to drop the column `s3Url` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[s3Key]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `s3Key` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_s3Url_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "s3Url",
ADD COLUMN     "s3Key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_s3Key_key" ON "Video"("s3Key");
