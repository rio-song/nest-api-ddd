
import { Pair } from "./pair"

export class Team {
    private id: string
    private teamName: TeamNameVO
    private pairs: Pair[]
    public constructor(props: { id: string; teamName: TeamNameVO; pairs: Pair[] }) {
        const { id, teamName, pairs } = props
        this.id = id
        this.teamName = teamName
        this.pairs = pairs
        // if (this.pairs.map((u) => u.getAllProperties().users).length > 3) {
        //     const prisma = new PrismaClient()
        //     new TeamRepository(prisma).updatePairTeam(new Team(props));
        // }
        // if (pairs.length > 2) {
        //     if (this.pairs.map((u) => u.getAllProperties().users).length < 1) {
        //         const prisma = new PrismaClient()
        //         new TeamRepository(prisma).updatePairTeamWhenSmall(new Team(props));
        //     }
        // }
    }

    public getAllProperties() {
        return {
            id: this.id,
            teamName: this.teamName,
            pairs: this.pairs,
        }
    }

    public getTeamId() {
        return this.id
    }

    public getTeamName() {
        return this.teamName
    }

    public getPairs(): Pair[] {
        return this.pairs
    }

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
