import { PrismaClient } from '@prisma/client'
import { ILessonRepository } from 'src/domain/repository-interface/lesson-repository'
import { Lesson } from 'src/domain/entity/lesson'
import { UserLessonVO } from 'src/domain/entity/user-lessonVO'
import { createRandomIdString } from 'src/util/random'

export class LessonRepository implements ILessonRepository {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async save(lessonEntity: Lesson): Promise<Lesson> {
        const { id, lessonNumber, lessonTitle } = lessonEntity.getAllProperties()

        await this.prismaClient.lesson.create({
            data: {
                id,
                lessonNumber,
                lessonTitle,
            },
        })

        const lessonSavedEntity = new Lesson({
            id: id, lessonNumber: lessonNumber, lessonTitle: lessonTitle, userLesson: []
        })
        return lessonSavedEntity
    }

    public async getLessonbylessonIdUserId(userId: string, lessonId: string): Promise<Lesson> {

        const userLessonDatamodel = await this.prismaClient.lesson.findFirst({
            include: {
                lessonBelongMember: {
                    where: {
                        userId: userId,
                        lessonId: lessonId
                    },
                }
            }
        })
        if (userLessonDatamodel) {
            const updatedUserEntity = new Lesson({
                id: userLessonDatamodel?.id,
                lessonNumber: userLessonDatamodel?.lessonNumber,
                lessonTitle: userLessonDatamodel?.lessonTitle,
                userLesson: userLessonDatamodel.lessonBelongMember.map((l) =>
                    new UserLessonVO({
                        lessonId: l.lessonId,
                        userId: l.userId,
                        lessonStatus: l.status
                    }))
            })
            return updatedUserEntity
        } else {
            throw new Error("存在しないです。")
        }
    }
    public async updateUserLesson(lessonEntity: Lesson): Promise<Lesson> {

        await this.prismaClient.$transaction(async (prismaClient) => {
            const deleteUserLessonDatamodel = await this.prismaClient.lessonBelongMember.deleteMany({
                where: {
                    userId: lessonEntity.getUserLesson()[0]?.getUserId(),
                    lessonId: lessonEntity.getUserLesson()[0]?.getLessonId()
                },
            })

            const savedUserLessonDatamodel = await this.prismaClient.lessonBelongMember.create({
                data: {
                    id: createRandomIdString(),
                    userId: lessonEntity.getUserLesson()[0]?.getUserId() || "",
                    lessonId: lessonEntity.getUserLesson()[0]?.getLessonId() || "",
                    status: lessonEntity.getUserLesson()[0]?.getLessonStatus() || ""
                }
            })
        })
        return lessonEntity
    }
}
