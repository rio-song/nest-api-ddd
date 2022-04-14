import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PostLessonRequest } from './request/post-lesson-request'
import { PostLessonUseCase } from '../app/lesson-usecase/post-lesson-usecase'
import { LessonRepository } from 'src/infra/db/repository/lesson-repository'

@Controller({
    path: '/lesson',
})
export class LessonController {

    @Post()
    async postLesson(
        @Body() postLessonDto: PostLessonRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const lessonRepo = new LessonRepository(prisma)
        const usecase = new PostLessonUseCase(lessonRepo)
        await usecase.do({
            lessonNumber: postLessonDto.lessonNumber,
            lessonTitle: postLessonDto.lessonTitle
        })
    }


}
