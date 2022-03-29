
import { User } from "./user"

export class Pair {
    private id: string
    private pairName: PairNameVO
    private users: User
    public constructor(props: { id: string; pairName: string; users: User }) {
        const { id, pairName, users } = props
        this.id = id
        this.pairName = new PairNameVO(pairName)
        this.users = users
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

    public getUsers() {
        return {
            users: this.users,

        }
    }

}

export class PairNameVO {
    private readonly pairName: string;

    constructor(pairName: string) {
        const pairNameRegex = /^[a-z]$/
        if (!pairNameRegex.test(pairName)) { throw new Error("英小文字１字で入力してください") }
        if ("重複チェックのロジック") {
            throw new Error("既に存在するペア名です");
        }
        this.pairName = pairName;
    }

    public getPairNameVO() {
        return this.pairName
    }


}


