import { Lesson } from "../entity/lesson";

export interface ILessonRepository {
    save(lesson: Lesson): Promise<Lesson>
    getLessonbylessonIdUserId(userId: string, lessonId: string): Promise<Lesson>
    updateUserLesson(lessonEntity: Lesson): Promise<Lesson>
}
