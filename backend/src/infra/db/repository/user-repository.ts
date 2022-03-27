import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/app/repository-interface/user-repository'
import { User } from 'src/domain/entity/user'

export class UserRepository implements IUserRepository {
    private prismaClient: PrismaClient
    public constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient
    }

    public async save(userEntity: User): Promise<User> {
        const { id, lastName, firstName, email, userStatus } = userEntity.getAllProperties()

        const savedUserDatamodel = await this.prismaClient.user.create({
            data: {
                id,
                lastName,
                firstName,
                email,
                userStatus
            },
        })
        const savedUserEntity = new User({
            ...savedUserDatamodel,
        })
        return savedUserEntity
    }
}
