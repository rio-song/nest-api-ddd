import { UserLessonVO } from "./user-lessonVO"

export class Lesson {
    private id: string
    private lessonNumber: number
    private lessonTitle: string
    private userLesson: UserLessonVO[]

    public constructor(props: { id: string; lessonNumber: number; lessonTitle: string; userLesson: UserLessonVO[] }) {
        const { id, lessonNumber, lessonTitle, userLesson } = props
        this.id = id
        this.lessonNumber = lessonNumber
        this.lessonTitle = lessonTitle
        this.userLesson = userLesson

    }

    public getAllProperties() {
        return {
            id: this.id,
            lessonNumber: this.lessonNumber,
            lessonTitle: this.lessonTitle,
            userLesson: this.userLesson
        }
    }

    public getLessonId() {
        return this.id
    }
    public getLessonNumber() {
        return this.lessonNumber
    }
    public getLessonTitle() {
        return this.lessonTitle
    }
    public getUserLesson() {
        return this.userLesson
    }
}