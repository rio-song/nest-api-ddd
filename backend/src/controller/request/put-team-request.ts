
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PutTeamRequest {
    @ApiProperty()
    @IsNotEmpty()
    readonly teamName!: number

    @ApiProperty()
    readonly pairName!: string[]
}
