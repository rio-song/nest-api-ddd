
import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { Team, TeamNameVO } from 'src/domain/entity/team'
import { createRandomIdString } from 'src/util/random'
import { Pair, PairNameVO } from 'src/domain/entity/pair'

export class TeamRepository implements ITeamRepository {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    //チームとペアの生成//初回のみ呼ばれる前提。
    //prismaのアクセスをcreateのネストにしたかったが、TeamEntityからpair以下取り出すと型不一致になってしまうため個別でDBアクセス。

    public async createTeamPair(teamEntity: Team): Promise<Team[]> {
        const { id, teamName, pairs } = teamEntity.getAllProperties()

        await this.prismaClient.$transaction(async (prismaClient) => {

            const savedTeamDatamodel = await this.prismaClient.team.create({
                data: {
                    id: id,
                    teamName: teamName.getTeamNameVO(),
                }
            })

            const savedPairDatamodel = await this.prismaClient.pair.create({
                data: {
                    id: pairs.shift()?.getPairId() || "",
                    pairName: pairs.shift()?.getPairName().getPairNameVO() || "",
                },
            })
            const savedPairBelongTeam = await this.prismaClient.pairBelongTeam.create({
                data: {
                    id: createRandomIdString(),
                    teamId: savedTeamDatamodel.id,
                    pairId: savedPairDatamodel.id,
                },
            })
        })
        return this.getTeamEntity();
    }

    //3人以下のペアを探す。
    public async getPairUnder3members(): Promise<Team | null> {
        const teamUnder26pairs = await this.prismaClient.pair.findFirst({
            include: {
                pairBelongMember: {
                    orderBy: {
                        userId: "asc"
                    }
                }
            }
        })
        if (teamUnder26pairs != null) {
            const getTeambyPairId = await this.prismaClient.pairBelongTeam.findFirst({
                where: {
                    pairId: teamUnder26pairs?.id
                }, include: {
                    team: true
                }
            })
            if (getTeambyPairId != null) {
                const getTeamEntity =
                    new Team({
                        id: getTeambyPairId?.teamId,
                        teamName: new TeamNameVO(getTeambyPairId?.team.teamName),
                        pairs: [new Pair({
                            id: teamUnder26pairs.id,
                            pairName: new PairNameVO(teamUnder26pairs.pairName),
                            users: teamUnder26pairs.pairBelongMember.map((u) => u.userId)
                        }),]
                    })
                return getTeamEntity
            }
        } else {
            return null
        }
        return null
    }

    public async joinPair(teamEntity: Team): Promise<Team[]> {
        const { pairs } = teamEntity.getAllProperties()
        const savedTeamDatamodel1 = await this.prismaClient.pairBelongMember.create({
            data: {
                id: createRandomIdString(),
                userId: pairs[0]?.getUsers()[0] || "",
                pairId: pairs[0]?.getPairId() || ""
            }
        })

        //不要かと。
        return this.getTeamEntity()
    }


    public async createPair(teamId: string, pairName: string): Promise<{ id: string, pairName: string }> {

        const savedPairDatamodel = await this.prismaClient.pair.create({
            data: {
                id: createRandomIdString(),
                pairName: pairName,
                pairBelongTeam: {
                    create: {
                        id: createRandomIdString(),
                        teamId: teamId
                    }
                }
            },
        })
        return { id: savedPairDatamodel.id, pairName: savedPairDatamodel.pairName }
    }


    public async getTeamId(): Promise<{ id: string, teamName: number } | null> {

        const savedPairDatamodel = await this.prismaClient.team.findFirst()
        if (savedPairDatamodel != null) {
            return { id: savedPairDatamodel.id, teamName: savedPairDatamodel.teamName }
        } else {
            return null
        }
    }

    public async deletePairteam(userId: string): Promise<Team[]> {
        const deletedUserDatamodel = await this.prismaClient.pairBelongMember.deleteMany({
            where: {
                userId: userId
            },
        })
        return this.getTeamEntity()
    }

    //合流先は同じチームの中から最も参加人数が少ないペアから自動的に選ばれる
    public async updatePairTeamWhenSmall(teamEntity: Team): Promise<Team[]> {
        const { id, teamName, pairs } = teamEntity.getAllProperties()
        if (pairs.map((u) => u.getAllProperties().users).length < 1) {
            const index = pairs.findIndex((element) => element.getAllProperties().users.length < 1)

            await this.prismaClient.$transaction(async (prismaClient) => {
                const deletedUserDatamodel = await this.prismaClient.pairBelongMember.deleteMany({
                    where: {
                        userId: pairs[index]?.getAllProperties().users[0]
                    },
                })

                const foundSmallPairId = await this.prismaClient.pairBelongMember.groupBy({
                    by: ['pairId'],
                    // include: {
                    //     pair: {
                    //         include: {
                    //             pairBelongTeam: {
                    //                 where: {
                    //                     teamId: "123"
                    //                 }
                    //             }
                    //         }
                    //     }
                    // },
                    orderBy: {
                        pairId: 'asc',
                    },
                })

                //既に持ってるチームIDの中で、最も人数が少ないペアを探す。

                if (foundSmallPairId[0] != null) {
                    const savedTeamDatamodel1 = await this.prismaClient.pairBelongMember.create({
                        data: {
                            id: createRandomIdString(),
                            //↓undefinedを直すのはこの書き方でいいのか？？？
                            userId: pairs[index]?.getAllProperties().users[0] || "",
                            pairId: foundSmallPairId[0].pairId,
                        }
                    })

                }

            })
        }
        return this.getTeamEntity()
    }

    public async getTeamPairbyTeamName(teamName: number, pairName: string[]): Promise<Team[]> {
        const beforreallTeamsDatamodel = await this.prismaClient.team.findFirst({
            where: {
                teamName: teamName
            },
            include: {
                pairBelongTeam: {
                    include: {
                        pair: {
                            include: {
                                pairBelongMember: true
                            }
                        }
                    }
                },
            },
        })

        if (beforreallTeamsDatamodel === null) {
            throw new Error("チーム名が存在しません");
        }

        await this.prismaClient.$transaction(async (prismaClient) => {
            const deletePairDatamodel = await this.prismaClient.pairBelongTeam.deleteMany({
                where: {
                    teamId: beforreallTeamsDatamodel.id
                },
            })

            for (let i = 0; i < pairName.length; i++) {
                const savedPairDatamodel = await this.prismaClient.pairBelongTeam.create({
                    data: {
                        id: createRandomIdString(),
                        pairId: pairName[i] || "",
                        teamId: beforreallTeamsDatamodel.id,
                    }
                })
            }
        })
        return this.getTeamEntity()
    }

    public async updatePairMember(pairName: string, memberEmails: string[]): Promise<Team[]> {
        const beforreallpairDatamodel = await this.prismaClient.pair.findFirst({
            where: {
                pairName: pairName
            },
            include: {
                pairBelongMember: true
            }
        })

        if (beforreallpairDatamodel === null) {
            throw new Error("ペア名が存在しません");
        }
        await this.prismaClient.$transaction(async (prismaClient) => {
            const deletePairDatamodel = await this.prismaClient.pairBelongMember.deleteMany({
                where: {
                    pairId: beforreallpairDatamodel.id
                },
            })

            for (let i = 0; i < memberEmails.length; i++) {
                const savedPairDatamodel = await this.prismaClient.pairBelongTeam.create({
                    data: {
                        id: createRandomIdString(),
                        pairId: memberEmails[i] || "",
                        teamId: beforreallpairDatamodel.id,
                    }
                })
            }
        })
        return this.getTeamEntity()
    }

    public async getTeamEntity(): Promise<Team[]> {
        const allTeamsDatamodel = await this.prismaClient.team.findMany({
            include: {
                pairBelongTeam: {
                    include: {
                        pair: {
                            include: {
                                pairBelongMember: true
                            }
                        }
                    }
                },
            },
        })
        const getTeamEntity = allTeamsDatamodel.map(
            (teamDM) =>
                new Team({
                    id: teamDM.id,
                    teamName: new TeamNameVO(teamDM.teamName),
                    pairs: teamDM.pairBelongTeam.map((p) => new Pair({
                        id: p.pair.id,
                        pairName: new PairNameVO(p.pair.pairName),
                        users: p.pair.pairBelongMember.map((u) => u.userId)
                    })),
                }))
        return getTeamEntity;
    }

}
