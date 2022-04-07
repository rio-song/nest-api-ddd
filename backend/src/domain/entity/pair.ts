export class Pair {
    private id: string
    private pairName: PairNameVO
    public constructor(props: { id: string; pairName: PairNameVO; }) {
        const { id, pairName, } = props
        this.id = id
        this.pairName = pairName
    }

    public getAllProperties() {
        return {
            id: this.id,
            pairName: this.pairName,
        }
    }

    public getPairName() {
        return {
            pairName: this.pairName,
        }
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


