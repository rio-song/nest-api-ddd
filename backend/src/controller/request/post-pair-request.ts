// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PostPairRequest {
    @ApiProperty()
    @IsNotEmpty()
    readonly pairName!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly memberEmails!: string
}
