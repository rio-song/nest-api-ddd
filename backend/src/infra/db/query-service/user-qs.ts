import { PrismaClient } from '@prisma/client'
import {
    UserDTO,
    IUserQS,
} from 'src/app/query-service-interface/user-qs'

export class UserQS implements IUserQS {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async getAllUsers(): Promise<UserDTO[]> {
        const allUsers = await this.prismaClient.user.findMany()
        return allUsers.map(
            (userDM) =>
                new UserDTO({
                    ...userDM,
                }),
        )
    }

    public async emailDoubleCheck(email: string): Promise<boolean> {
        const emailDoubleCheck = await this.prismaClient.user.findFirst({
            where: {
                email: email
            },
        })
        if (emailDoubleCheck === null) {
            return true;
        } else {
            return false
        }

    }

    public async getUser(email: string): Promise<UserDTO> {
        const user = await this.prismaClient.user.findFirst({
            where: {
                email: email
            },
        })

        if (user === null) {
            throw new Error("存在しないユーザーです")
        }
        return new UserDTO(user)
    }
}