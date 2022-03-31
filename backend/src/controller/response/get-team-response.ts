import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from 'src/app/query-service-interface/team-qs'
import {
    PairDTO
} from 'src/app/query-service-interface/pair-qs'
export class GetTeamResponse {
    @ApiProperty({ type: () => [Team] })
    team: Team[]

    public constructor(params: { team: TeamDTO[] }) {
        const { team } = params
        this.team = team.map(({ id, teamName, pair }) => {
            return new Team({
                id,
                teamName,
                pair,
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
    pair: PairDTO

    public constructor(params: {
        id: string
        teamName: number
        pair: PairDTO
    }) {
        this.id = params.id
        this.teamName = params.teamName
        this.pair = params.pair
    }
}
