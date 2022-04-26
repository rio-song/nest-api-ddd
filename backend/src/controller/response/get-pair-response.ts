import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from 'src/app/query-service-interface/pair-qs'
import { UserDTO } from 'src/app/query-service-interface/user-qs'

export class GetPairResponse {
    @ApiProperty({ type: () => [Pair] })
    Pair: Pair[]

    public constructor(params: { Pairs: PairDTO[] }) {
        const { Pairs } = params
        this.Pair = Pairs.map(({ id, pairName, users }) => {
            return new Pair({
                id: id,
                pairName: pairName,
                users: users.map((u) => new UserDTO({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, userStatus: u.userStatus }))
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
    users: UserDTO[]

    public constructor(params: {
        id: string
        pairName: string
        users: UserDTO[]
    }) {
        this.id = params.id
        this.pairName = params.pairName
        this.users = params.users
    }
}
