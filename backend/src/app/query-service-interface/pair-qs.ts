export class PairDTO {
    public readonly id: string
    public readonly pairName: string

    public constructor(props: { id: string; pairName: string; }) {
        const { id, pairName } = props
        this.id = id
        this.pairName = pairName
    }
}

export interface IPairQS {
    getAllPairs(): Promise<PairDTO[]>
    getPair(pairName: string): Promise<PairDTO>
}