
import { PrismaClient } from '@prisma/client'
import { IPairRepository } from 'src/domain/repository-interface/pair-repository'
import { Pair, PairNameVO } from 'src/domain/entity/pair'
import { createRandomIdString } from 'src/util/random'

export class PairRepository implements IPairRepository {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async save(pairEntity: Pair): Promise<Pair> {
        const { id, pairName } = pairEntity.getAllProperties()

        const { users } = pairEntity.getUsers()
        const savedPairDatamodel = await this.prismaClient.pair.create({
            data: {
                id: id,
                pairName: pairName.getPairNameVO(),
            },
        })

        //pairMemberのテーブル更新方法
        // const savedPairMemberDatamodel = await this.prismaClient.pairMember.create({
        //     data: {
        //         id: createRandomIdString(),
        //         userId: users.id
        //         pairId: id,
        //     },
        // })
        //const savedPairDatamodels = { savedPairDatamodel, users }

        const savedPairEntity = new Pair({
            savedPairDatamodel,
        })
        return savedPairEntity
    }
    // public async savePairMember(pairEntity: Pair,): Promise<Pai> {
    //     const { id, pairName } = pairEntity.getAllProperties()

    //     const savedPairDatamodel = await this.prismaClient.pair.create({
    //         data: {
    //             id: id,
    //             pairName: pairName.getPairNameVO(),
    //         },
    //     })


    //     const savedPairEntity = new Pair({
    //         ...savedPairDatamodel,
    //     })
    //     return savedPairEntity
    // }
    // public async update(userEntity: User): Promise<User> {
    //     const { id, lastName, firstName, email, userStatus } = userEntity.getAllProperties()

    //     const updatedUserDatamodel = await this.prismaClient.user.update({
    //         where: {
    //             id: id,
    //         },
    //         data: {
    //             userStatus: userStatus
    //         },
    //     })
    //     const updatedUserEntity = new User({
    //         ...updatedUserDatamodel,
    //     })
    //     return updatedUserEntity
    // }
}
