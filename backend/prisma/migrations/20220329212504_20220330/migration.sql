/*
  Warnings:

  - You are about to drop the column `teamId` on the `pair` table. All the data in the column will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "pair" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "team";

-- DropTable
DROP TABLE "teamMember";
