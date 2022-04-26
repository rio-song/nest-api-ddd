import { PrismaClient } from '@prisma/client'
import {
    PairDTO,
    IPairQS,
} from 'src/app/query-service-interface/pair-qs'
import { UserDTO } from 'src/app/query-service-interface/user-qs'

export class PairQS implements IPairQS {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async getAllPairs(): Promise<PairDTO[]> {
        const allPairs = await this.prismaClient.pair.findMany({
            include: {
                pairBelongMember: {
                    include: {
                        user: true
                    }
                }
            }
        })
        return allPairs.map(
            (pairDM) =>
                new PairDTO({
                    id: pairDM.id,
                    pairName: pairDM.pairName,
                    users: pairDM.pairBelongMember.map((u) =>
                        new UserDTO({
                            id: u.user.id,
                            firstName: u.user.firstName,
                            lastName: u.user.lastName,
                            email: u.user.email,
                            userStatus: u.user.userStatus
                        })
                    )
                }),
        )
    }
}