-- DropForeignKey
ALTER TABLE "pairBelongMember" DROP CONSTRAINT "pairBelongMember_pairId_fkey";

-- DropForeignKey
ALTER TABLE "pairBelongMember" DROP CONSTRAINT "pairBelongMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "pairBelongTeam" DROP CONSTRAINT "pairBelongTeam_pairId_fkey";

-- DropForeignKey
ALTER TABLE "pairBelongTeam" DROP CONSTRAINT "pairBelongTeam_teamId_fkey";

-- AddForeignKey
ALTER TABLE "pairBelongTeam" ADD CONSTRAINT "pairBelongTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairBelongTeam" ADD CONSTRAINT "pairBelongTeam_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairBelongMember" ADD CONSTRAINT "pairBelongMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairBelongMember" ADD CONSTRAINT "pairBelongMember_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
