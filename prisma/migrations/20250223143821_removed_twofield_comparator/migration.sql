/*
  Warnings:

  - You are about to drop the column `alibaba` on the `Comparator` table. All the data in the column will be lost.
  - You are about to drop the column `amazon` on the `Comparator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comparator" DROP COLUMN "alibaba",
DROP COLUMN "amazon";
