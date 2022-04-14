import { Body, Controller, Get, Put } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PutUserLessonRequest } from './request/put-user-lesson-request'
import { PutUserLessonUseCase } from 'src/app/lesson-user-usecase/put-user-lesson-usecate'
import { LessonRepository } from 'src/infra/db/repository/lesson-repository'
import { UserLessonQS } from 'src/infra/db/query-service/user-qs'

@Controller({
    path: '/userLesson',
})
export class UserLessonController {
    // @Get()
    // async getAllUserLessons(): Promise<GetUserLessonResponse> {
    //     const prisma = new PrismaClient()
    //     const qs = new UserLessonQS(prisma)
    //     const usecase = new GetAllUserLessonsUseCase(qs)
    //     const result = await usecase.do()
    //     const response = new GetUserLessonResponse({ UserLessons: result })
    //     return response
    // }

    @Put()
    async putUserLesson(
        @Body() putUserLessonDto: PutUserLessonRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repoUserLesson = new LessonRepository(prisma)
        const userlessonQS = new UserLessonQS(prisma)
        const usecase = new PutUserLessonUseCase(userlessonQS, repoUserLesson)
        await usecase.do({
            lessonId: putUserLessonDto.lessonId,
            userId: putUserLessonDto.userId,
            lessonStatus: putUserLessonDto.lessonStatus,
        })
    }

}
