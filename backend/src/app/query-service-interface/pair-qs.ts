import { UserDTO } from "./user-qs"

export class PairDTO {
    public readonly id: string
    public readonly pairName: string
    public readonly users: UserDTO[]
    public constructor(props: { id: string; pairName: string; users: UserDTO[] }) {
        const { id, pairName, users } = props
        this.id = id
        this.pairName = pairName
        this.users = users
    }
}

export interface IPairQS {
    getAllPairs(): Promise<PairDTO[]>
}