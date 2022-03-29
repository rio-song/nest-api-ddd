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

    // public async emailDoubleCheck(email: string): Promise<boolean> {
    //     const emailDoubleCheck = await this.prismaClient.user.findFirst({
    //         where: {
    //             email: email
    //         },
    //     })
    //     if (emailDoubleCheck === null) {
    //         return true;
    //     } else {
    //         return false
    //     }

    // }

    // public async getUser(email: string): Promise<UserDTO> {
    //     const user = await this.prismaClient.user.findFirst({
    //         where: {
    //             email: email
    //         },
    //     })

    //     if (user === null) {
    //         throw new Error("存在しないユーザーです")
    //     }
    //     return new UserDTO(user)
    // }
}