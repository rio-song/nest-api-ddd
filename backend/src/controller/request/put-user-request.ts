import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PutUserRequest {
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
