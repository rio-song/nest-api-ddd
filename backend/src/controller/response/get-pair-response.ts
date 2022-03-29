import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from 'src/app/query-service-interface/pair-qs'

export class GetPairResponse {
    @ApiProperty({ type: () => [Pair] })
    Pair: Pair[]

    public constructor(params: { Pairs: PairDTO[] }) {
        const { Pairs } = params
        console.log("return")
        this.Pair = Pairs.map(({ id, pairName, teamId }) => {
            return new Pair({
                id,
                pairName,
                teamId,
            })
        })
    }
}

class Pair {
    @ApiProperty()
    id: string

    @ApiProperty()
    pairName: string

    @ApiProperty()
    teamId: string

    public constructor(params: {
        id: string
        pairName: string
        teamId: string
    }) {
        this.id = params.id
        this.pairName = params.pairName
        this.teamId = params.teamId
    }
}
