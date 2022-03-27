import { User } from 'src/domain/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { DomainService } from 'src/domain/domain-service/domain-service'
import { IUserQS } from 'src/app/query-service-interface/user-qs'

export class PostUserUseCase {
    private readonly userRepo: IUserRepository
    private readonly userQS: IUserQS

    public constructor(userRepo: IUserRepository, userQS: IUserQS) {
        this.userRepo = userRepo,
            this.userQS = userQS
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

        const domainService = new DomainService(this.userQS)

        if (await domainService.emailDoubleCheck(email) === null) {
            throw new Error('登録済みのメールアドレスです.')
        }

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
