import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PostLessonRequest {
    @ApiProperty()
    @IsNotEmpty()
    readonly id!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly lessonNumber!: number

    @ApiProperty()
    @IsNotEmpty()
    readonly lessonTitle!: string
}
