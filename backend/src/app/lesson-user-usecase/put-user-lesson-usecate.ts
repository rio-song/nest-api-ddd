import { Lesson } from 'src/domain/entity/lesson'
import { ILessonRepository } from 'src/domain/repository-interface/lesson-repository'
//import { ILessonQS } from 'src/app/query-service-interface/lesson-qs'
import { UserLessonVO } from 'src/domain/entity/user-lessonVO'


export class PutUserLessonUseCase {
    private readonly lessonRepo: ILessonRepository
    private readonly lessonQS: ILessonQS

    public constructor(lessonQS: ILessonQS, lessonRepo: ILessonRepository) {
        this.lessonRepo = lessonRepo,
            this.lessonQS = lessonQS
    }

    public async do(params: {
        lessonId: string;
        userId: string;
        lessonStatus: string;
    }) {

        const {
            lessonId,
            userId,
            lessonStatus,
        } = params


        const currentLesson = await this.lessonRepo.getLessonbylessonIdUserId(lessonId, userId)
        if (currentLesson.getUserLesson()[0]?.getLessonStatus() === "complete") {
            throw new Error("1度完了したステータスは変更できません")
        }

        if (lessonStatus === currentLesson.getUserLesson()[0]?.getLessonStatus()) {
            throw new Error("登録済のステータスと同じです")
        }

        const lessonEntity = new Lesson({
            id: currentLesson.getLessonId(),
            lessonNumber: currentLesson.getLessonNumber(),
            lessonTitle: currentLesson.getLessonTitle(),
            userLesson: [new UserLessonVO({
                userId: currentLesson.getUserLesson()[0]?.getUserId() || "",
                lessonId: currentLesson.getUserLesson()[0]?.getLessonId() || "",
                lessonStatus: currentLesson.getUserLesson()[0]?.getLessonStatus() || "",
            })]
        })
        await this.lessonRepo.updateUserLesson(lessonEntity)
    }
}

