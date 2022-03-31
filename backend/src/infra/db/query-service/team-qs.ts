import { PrismaClient } from '@prisma/client'
import {
    TeamDTO,
    ITeamQS,
} from 'src/app/query-service-interface/team-qs'
import { PairDTO } from 'src/app/query-service-interface/pair-qs'

export class TeamQS implements ITeamQS {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async getAllTeams(): Promise<TeamDTO[]> {
        const allTeams = await this.prismaClient.team.findMany({
            include: {
                pair: true,
            }
        })

        return allTeams.map(
            (teamDM) =>
                new TeamDTO({
                    id: teamDM.id,
                    teamName: teamDM.teamName,
                    pair: { teamDM.pair.map() => new PairDTO({ id: teamDM.pair.id, pairName: teamDM.pair.pairName, teamId: teamDM.pair.teamId }) },
                }))

    }

    public async getTeam(teamName: number): Promise<boolean> {
        const team = await this.prismaClient.team.findFirst({
            where: {
                teamName: teamName
            },
        })
        if (team === null) {
            return false
        } else
            return true
    }
}
