import { User } from 'src/domain/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from './repository-interface/user-repository'

export class PostUserUseCase {
    private readonly userRepo: IUserRepository
    public constructor(userRepo: IUserRepository) {
        this.userRepo = userRepo
    }
    public async do(params: {
        lastName: string;
        firstName: string;
        email: string;
        userStatus: string;
    }) {


        const {
            lastName,
            firstName,
            email,
            userStatus,
        } = params

        const userEntity = new User({
            id: createRandomIdString(),
            lastName,
            firstName,
            email,
            userStatus,
        })
        await this.userRepo.save(userEntity)
    }
}
