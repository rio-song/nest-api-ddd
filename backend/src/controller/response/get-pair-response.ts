import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from 'src/app/query-service-interface/pair-qs'

export class GetPairResponse {
    @ApiProperty({ type: () => [Pair] })
    Pair: Pair[]

    public constructor(params: { Pairs: PairDTO[] }) {
        const { Pairs } = params
        console.log("return")
        this.Pair = Pairs.map(({ id, pairName }) => {
            return new Pair({
                id,
                pairName,
            })
        })
    }
}

class Pair {
    @ApiProperty()
    id: string

    @ApiProperty()
    pairName: string

    public constructor(params: {
        id: string
        pairName: string
    }) {
        this.id = params.id
        this.pairName = params.pairName
    }
}
