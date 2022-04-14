import { Lesson } from 'src/domain/entity/lesson'
import { createRandomIdString } from 'src/util/random'
import { ILessonRepository } from 'src/domain/repository-interface/lesson-repository'

export class PostLessonUseCase {
    private readonly lessonRepo: ILessonRepository

    public constructor(lessonRepo: ILessonRepository) {
        this.lessonRepo = lessonRepo
    }
    public async do(params: {
        lessonNumber: number;
        lessonTitle: string;
    }) {

        const {
            lessonNumber,
            lessonTitle,
        } = params

        const lessonEntity = new Lesson({
            id: createRandomIdString(),
            lessonNumber,
            lessonTitle,
            userLesson: []
        })
        await this.lessonRepo.save(lessonEntity);
    }
}
