export class Pair {
    private id: string
    private pairName: PairNameVO
    private users: string[]
    public constructor(props: { id: string; pairName: PairNameVO; users: string[] }) {
        const { id, pairName, users } = props
        this.id = id
        this.pairName = pairName
        this.users = users
    }

    public getAllProperties() {
        return {
            id: this.id,
            pairName: this.pairName,
            users: this.users
        }
    }

    public getPairName() {
        return {
            pairName: this.pairName,
        }
    }
    public getPairId() {
        return { id: this.id }
    }
}


export class PairNameVO {
    private readonly pairName: string;

    constructor(pairName: string) {
        const pairNameRegex = /^[a-z]$/
        if (!pairNameRegex.test(pairName)) { throw new Error("英小文字１字で入力してください") }
        this.pairName = pairName;
    }

    public getPairNameVO() {
        return this.pairName
    }


}


