
import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { Team } from 'src/domain/entity/team'
import { createRandomIdString } from 'src/util/random'

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

    public async update(teamEntity: Team): Promise<Team> {
        const { id, pairName } = pairEntity.getAllProperties()

        const { users } = pairEntity.getUsers()

        const updatedUserDatamodel = await this.prismaClient.user.update({
            where: {
                id: users.getUserId().id,
            },
            data: {
                pairId: id
            },
        })
        const updatedUserEntity = new Pair({
            ...updatedUserDatamodel,
        })
        return updatedUserEntity
    }

    public async delete(teamEntity: Team): Promise<Team> {
        const { id, pairName } = pairEntity.getAllProperties()

        const { users } = pairEntity.getUsers()

        const updatedUserDatamodel = await this.prismaClient.user.deleteMany({
            where: {
                id: users.getUserId().id,
            },
            data: {
                pairId: id
            },
        })
        const updatedUserEntity = new Pair({
            ...updatedUserDatamodel,
        })
        return updatedUserEntity
    }
}
