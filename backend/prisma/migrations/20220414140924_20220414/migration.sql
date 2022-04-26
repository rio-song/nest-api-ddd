-- CreateTable
CREATE TABLE "lesson" (
    "id" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "lessonTitle" TEXT NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessonBelongMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "lessonBelongMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lessonBelongMember" ADD CONSTRAINT "lessonBelongMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonBelongMember" ADD CONSTRAINT "lessonBelongMember_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
