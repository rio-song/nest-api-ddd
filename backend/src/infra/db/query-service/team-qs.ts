import { PrismaClient } from '@prisma/client'
import {
    TeamDTO,
    ITeamQS,
} from 'src/app/query-service-interface/team-qs'
import { PairDTO } from 'src/app/query-service-interface/pair-qs'
import { UserDTO } from 'src/app/query-service-interface/user-qs'

export class TeamQS implements ITeamQS {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async getAllTeams(): Promise<TeamDTO[]> {
        const allTeams = await this.prismaClient.team.findMany({
            include: {
                pairBelongTeam: {
                    include: {
                        pair: {
                            include: {
                                pairBelongMember: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
        })

        return allTeams.map(
            (teamDM) =>
                new TeamDTO({
                    id: teamDM.id,
                    teamName: teamDM.teamName,
                    pair: teamDM.pairBelongTeam.map((p) =>
                        new PairDTO({
                            id: p.pair.id,
                            pairName: p.pair.pairName,
                            users: p.pair.pairBelongMember.map((u) =>
                                new UserDTO({
                                    id: u.user.id,
                                    firstName: u.user.firstName,
                                    lastName: u.user.lastName,
                                    email: u.user.email,
                                    userStatus: u.user.userStatus
                                }))
                        }),
                    )
                })
        )
    }
}