
//import { User } from "./user"
import { Pair } from "./pair"

export class Team {
    private id: string
    private teamName: TeamNameVO
    private pairs: Pair | null
    public constructor(props: { id: string; teamName: TeamNameVO; pairs: Pair | null }) {
        const { id, teamName, pairs } = props
        this.id = id
        this.teamName = teamName
        this.pairs = pairs
    }

    public getAllProperties() {
        return {
            id: this.id,
            teamName: this.teamName,
            pairs: this.pairs,
        }
    }

    // public getPairName() {
    //     return {
    //         teamName: this.teamName,
    //     }
    // }

    // public getUsers() {
    //     return {
    //         users: this.users,
    //     }
    // }
}

export class TeamNameVO {
    private readonly teamName: number;

    constructor(teamName: number) {
        const teamNameRegex = /^[1-999]$/
        if (!teamNameRegex.test(String(teamName))) {
            throw new Error("数字3桁以下で入力してください")
        }
        this.teamName = teamName;
    }

    public getTeamNameVO() {
        return this.teamName
    }


}


