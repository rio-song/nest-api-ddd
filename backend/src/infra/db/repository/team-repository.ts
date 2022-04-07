
import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { Team } from 'src/domain/entity/team'
import { createRandomIdString } from 'src/util/random'
import { Pair, PairNameVO } from 'src/domain/entity/pair'

export class TeamRepository implements ITeamRepository {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async save(teamEntity: Team): Promise<Team> {
        const { id, teamName } = teamEntity.getAllProperties()

        const team = await this.prismaClient.team.findFirst({
            where: {
                teamName: teamName.getTeamNameVO()
            }
        })
        if (team !== null) {
            throw new Error("既に存在するチーム名です");
        }

        const savedTeamDatamodel = await this.prismaClient.team.create({
            data: {
                id: id,
                teamName: teamName.getTeamNameVO(),
            },
        })

        const savedTeamEntity = new Team({
            id: id, teamName: teamName, pairs: null
        })
        return savedTeamEntity
    }

    public async update(params: any): Promise<any> {
        //const { id, pairName, teamName } = pairEntity.getAllProperties()
        const {
            teamName,
            pairName
        } = params

        //const { users } = pairEntity.getUsers()

        const team = await this.prismaClient.team.findFirst({
            where: {
                teamName: teamName.getTeamNameVO()
            }
        })
        if (team === null) {
            throw new Error("既に存在するチーム名です");
        }

        const pair = await this.prismaClient.pair.findFirst({
            where: {
                pairName: pairName.getPairNameVO()
            }
        })

        if (pair === null) {
            throw new Error("既に存在するペア名です");
        }

        //リクエストが配列なので、１件でも複数でもteamに保存する。
        //配列内の数を数えて、その数だけペアの名前が存在するか確認する。
        // 存在しないものはエラーで返す。
        // 存在するペアをまとめて、チームに紐づける。

        const deletedUserDatamodel = await this.prismaClient.pairBelongTeam.delete({
            where: {
                id: team.id,
            }
        })

        const savedTeamDatamodel = await this.prismaClient.pairBelongTeam.create({
            data: {
                id: createRandomIdString(),
                pairId: pair.id,
                teamId: team.id,
            },
        })

        const updatedUserEntity = new Team({
            id: savedTeamDatamodel.id, teamName: teamName, pairs: new Pair({ id: pair.id, pairName })
        })
        return updatedUserEntity
    }
}
