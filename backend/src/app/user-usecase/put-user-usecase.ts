import { User } from 'src/domain/entity/user'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { IUserQS } from 'src/app/query-service-interface/user-qs'

export class PutUserUseCase {
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

        //constをletに書き換えてOKか
        let {
            lastName,
            firstName,
            email,
            userStatus,
        } = params

        const user = await this.userQS.getUser(email)
        if (userStatus === user.userStatus) {
            throw new Error("登録済のステータスと同じです")
        }

        const id = user.id
        lastName = user.lastName
        firstName = user.firstName
        email = user.email

        const userEntity = new User({
            id,
            lastName,
            firstName,
            email,
            userStatus,
        })
        await this.userRepo.update(userEntity)
    }
}