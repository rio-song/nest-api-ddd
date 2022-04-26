import { PairDTO } from "./pair-qs"

export class TeamDTO {
    public readonly id: string
    public readonly teamName: number
    public readonly pair: PairDTO[]

    public constructor(props: { id: string; teamName: number; pair: PairDTO[] }) {
        const { id, teamName, pair } = props
        this.id = id
        this.teamName = teamName
        this.pair = pair
    }
}

export interface ITeamQS {
    getAllTeams(): Promise<TeamDTO[]>
}