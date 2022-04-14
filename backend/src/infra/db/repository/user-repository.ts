import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
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
    public async changeUserStatus(userEntity: User): Promise<User> {
        const { id, lastName, firstName, email, userStatus } = userEntity.getAllProperties()

        const updatedUserDatamodel = await this.prismaClient.user.update({
            where: {
                id: id,
            },
            data: {
                userStatus: userStatus
            },
        })
        const updatedUserEntity = new User({
            ...updatedUserDatamodel,
        })
        return updatedUserEntity
    }

    public async getUserIdbyPairId(pairId: string): Promise<User[]> {

        const userDatamodel = await this.prismaClient.pairBelongMember.findMany({
            where: {
                pairId: pairId,
            },
            include: {
                user: true,
            },
        })
        const updatedUserEntity = userDatamodel.map((u) => new User({
            id: u.user.id,
            lastName: u.user.lastName,
            firstName: u.user.firstName,
            email: u.user.email,
            userStatus: u.user.userStatus
        }))
        return updatedUserEntity
    }
}
