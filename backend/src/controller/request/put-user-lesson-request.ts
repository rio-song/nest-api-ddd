import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PutUserLessonRequest {
    @ApiProperty()
    @IsNotEmpty()
    readonly lessonId!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly userId!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly lessonStatus!: string
}
