/*
  Warnings:

  - You are about to drop the column `teamId` on the `pair` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pair" DROP CONSTRAINT "pair_teamId_fkey";

-- AlterTable
ALTER TABLE "pair" DROP COLUMN "teamId";
