
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

    public async updatePairTeam(teamEntity: Team): Promise<Team[]> {
        const { id, teamName, pairs } = teamEntity.getAllProperties()
        if (pairs.map((u) => u.getAllProperties().users).length > 3) {
            const index = pairs.findIndex((element) => element.getAllProperties().users.length > 3)
            if (index !== -1 && index != null) {
                const getUserId = await this.prismaClient.pairBelongMember.findFirst({
                    where: {
                        pairId: pairs[index]?.getAllProperties().id
                    },
                })
                await this.prismaClient.$transaction(async (prismaClient) => {
                    if (getUserId?.userId[0] != null && getUserId?.userId[1] != null) {
                        const deletedUserDatamodel = await this.prismaClient.pairBelongMember.deleteMany({
                            where: {
                                pairId: pairs[index]?.getAllProperties().id
                            },
                        })

                        const savedTeamDatamodel1 = await this.prismaClient.pairBelongMember.createMany({
                            data: [{
                                id: createRandomIdString(),
                                userId: getUserId?.userId[0],
                                pairId: getUserId.pairId,
                            }, {
                                id: createRandomIdString(),
                                userId: getUserId?.userId[1],
                                pairId: getUserId.pairId,
                            }],
                            skipDuplicates: true
                        })

                        const countUserId = await this.prismaClient.pairBelongMember.groupBy({
                            by: ['pairId'],
                            orderBy: {
                                pairId: 'asc',
                            },
                            _count:
                                { userId: true }
                        })
                        if (countUserId[0]?._count != null && countUserId[0]?._count.userId < 2) {
                            for (let i = 2; i < getUserId?.userId.length; i++) {
                                if (getUserId.userId[i] != null) {
                                    const savedTeamDatamodel1 = await this.prismaClient.pairBelongMember.createMany({
                                        data: {
                                            id: createRandomIdString(),
                                            //↓undefinedを直すのはこの書き方でいいのか？？？
                                            userId: getUserId.userId[i] || "",
                                            pairId: countUserId[0].pairId,
                                        }
                                    })
                                }
                            }
                        }
                    }
                })
            }
        }
        return this.getTeamEntity()
    }

    public async getTeamPairbyUserName(userId: string): Promise<Team[]> {
        const beforreallTeamsDatamodel = await this.prismaClient.team.findMany({
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

        //チームが１つもない時
        if (beforreallTeamsDatamodel.length === 0) {
            const teamName = 1
            const pairName = "a"
            await this.prismaClient.$transaction(async (prismaClient) => {

                const savedTeamDatamodel = await this.prismaClient.team.create({
                    data: {
                        id: createRandomIdString(),
                        teamName: teamName,
                    }
                })

                const savedPairDatamodel = await this.prismaClient.pair.create({
                    data: {
                        id: createRandomIdString(),
                        pairName: pairName,
                    },
                })

                const savePairBelongTeam = await this.prismaClient.pairBelongTeam.create({
                    data: {
                        id: createRandomIdString(),
                        pairId: savedPairDatamodel.id,
                        teamId: savedTeamDatamodel.id
                    },
                })
            }
            )
        }

        //チームはあるがペアが１つもない時
        if (beforreallTeamsDatamodel.map((n) => n.pairBelongTeam).length === 0) {
            const findSmallTeam = await this.prismaClient.pairBelongTeam.groupBy({
                by: ['teamId'],
                orderBy: {
                    teamId: 'asc',
                },
            })
            await this.prismaClient.$transaction(async (prismaClient) => {
                if (findSmallTeam[0]?.teamId) {
                    //const defaltPairName = /[a-z]/
                    const pairName = "a"
                    const savedPairDatamodel = await this.prismaClient.pair.create({
                        data: {
                            id: createRandomIdString(),
                            pairName: pairName,
                            pairBelongTeam: {
                                create: {
                                    id: createRandomIdString(),
                                    teamId: findSmallTeam[0]?.teamId
                                }
                            }
                        },
                    })
                    const savedPairMemberDatamodel = await this.prismaClient.pairBelongMember.create({
                        data: {
                            id: createRandomIdString(),
                            pairId: savedPairDatamodel.id,
                            userId: userId
                        }
                    })
                }
            })
        }
        //既にチームもペアもある場合
        //ここのペアが全部３人だった時に新しいチームを作るというのを入れる。
        const findSmallMember = await this.prismaClient.pairBelongMember.groupBy({
            by: ['pairId'],
            orderBy: {
                pairId: 'asc',
            },
        })
        if (findSmallMember[0]?.pairId) {
            const savedPairMemberDatamodel = await this.prismaClient.pairBelongMember.create({
                data: {
                    id: createRandomIdString(),
                    pairId: findSmallMember[0]?.pairId,
                    userId: userId
                }
            })
        }
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
                    const savedTeamDatamodel1 = await this.prismaClient.pairBelongMember.createMany({
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

    public async getTeamEntity() {
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
