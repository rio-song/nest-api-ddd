
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PutPairRequest {
    @ApiProperty()
    @IsNotEmpty()
    readonly pairName!: string

    @ApiProperty()
    @IsNotEmpty()
    readonly memberEmails!: string[]
}
