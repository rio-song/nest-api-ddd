export class PairDTO {
    public readonly id: string
    public readonly pairName: string
    public readonly teamId: string

    public constructor(props: { id: string; pairName: string; teamId: string }) {
        const { id, pairName, teamId } = props
        this.id = id
        this.pairName = pairName
        this.teamId = teamId
    }
}

export interface IPairQS {
    getAllPairs(): Promise<PairDTO[]>
}