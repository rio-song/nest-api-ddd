export class UserLessonVO {
    private lessonId: string
    private userId: string
    private lessonStatus: string
    public constructor(props: { lessonId: string; userId: string; lessonStatus: string }) {
        const { lessonId, userId, lessonStatus } = props
        this.lessonId = lessonId
        this.userId = userId
        this.lessonStatus = lessonStatus

        if (lessonStatus === "todo" || lessonStatus === "review" || lessonStatus === "complete") {
            this.lessonStatus = lessonStatus
        } else {
            throw new Error("使用できない名称です")
        }
    }

    public getAllProperties() {
        return {
            lessonId: this.lessonId,
            userId: this.userId,
            lessonStatus: this.lessonStatus
        }
    }

    public getLessonId() {
        return this.lessonId
    }
    public getUserId() {
        return this.userId
    }
    public getLessonStatus() {
        return this.lessonStatus
    }
}