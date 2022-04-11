import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from 'src/app/query-service-interface/team-qs'
import { PairDTO } from 'src/app/query-service-interface/pair-qs'
import { UserDTO } from 'src/app/query-service-interface/user-qs'

export class GetTeamResponse {
    @ApiProperty({ type: () => [Team] })
    team: Team[]

    public constructor(params: { team: TeamDTO[] }) {
        const { team } = params
        this.team = team.map(({ id, teamName, pair }) => {
            return new Team({
                id: id,
                teamName: teamName,
                pair: pair.map((p) => new PairDTO({
                    id: p.id,
                    pairName: p.pairName,
                    users: p.users.map((u) => new UserDTO({
                        id: u.id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        email: u.email,
                        userStatus: u.userStatus
                    }))
                }))
            })
        })
    }
}

class Team {
    @ApiProperty()
    id: string

    @ApiProperty()
    teamName: number

    @ApiProperty()
    pair: PairDTO[]

    public constructor(params: {
        id: string
        teamName: number
        pair: PairDTO[]
    }) {
        this.id = params.id
        this.teamName = params.teamName
        this.pair = params.pair
    }
}
