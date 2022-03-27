// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PostUserRequest {
    @ApiProperty()
    @IsNotEmpty()
    readonly lastName!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly firstName!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly email!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly userStatus!: string
}
