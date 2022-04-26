-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL,
    "teamName" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pairBelongTeam" (
    "id" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pair" (
    "id" TEXT NOT NULL,
    "pairName" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pairBelongMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pairBelongTeam" ADD FOREIGN KEY ("pairId") REFERENCES "pair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairBelongTeam" ADD FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairBelongMember" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pairBelongMember" ADD FOREIGN KEY ("pairId") REFERENCES "pair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
