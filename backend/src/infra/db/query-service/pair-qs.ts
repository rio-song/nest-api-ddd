import { PrismaClient } from '@prisma/client'
import {
    PairDTO,
    IPairQS,
} from 'src/app/query-service-interface/pair-qs'

export class PairQS implements IPairQS {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async getAllPairs(): Promise<PairDTO[]> {
        const allPairs = await this.prismaClient.pair.findMany()
        return allPairs.map(
            (userDM) =>
                new PairDTO({
                    ...userDM,
                }),
        )
    }

    public async getPair(pairName: string): Promise<PairDTO[]> {
        const pair = await this.prismaClient.pair.findMany({
            where: {
                pairName: pairName
            },
        })

        return pair.map(
            (pairDM) =>
                new PairDTO({
                    ...pairDM,
                }),
        )
    }

}