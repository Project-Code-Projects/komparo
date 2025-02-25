/*
  Warnings:

  - You are about to drop the column `comparatorQuery` on the `ScrapeData` table. All the data in the column will be lost.
  - Added the required column `comparatorQueryId` to the `ScrapeData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrapeData" DROP COLUMN "comparatorQuery",
ADD COLUMN     "comparatorQueryId" INTEGER NOT NULL;
