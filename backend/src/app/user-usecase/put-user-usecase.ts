import { User } from 'src/domain/entity/user'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { IUserQS } from 'src/app/query-service-interface/user-qs'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'


export class PutUserUseCase {
    private readonly userRepo: IUserRepository
    private readonly teamRepo: ITeamRepository
    private readonly userQS: IUserQS

    public constructor(userQS: IUserQS, userRepo: IUserRepository, teamRepo: ITeamRepository) {
        this.userRepo = userRepo,
            this.userQS = userQS,
            this.teamRepo = teamRepo
    }

    public async do(params: {
        lastName: string;
        firstName: string;
        email: string;
        userStatus: string;
    }) {

        //constをletに書き換えてOKか
        let {
            email,
            userStatus,
        } = params

        const user = await this.userQS.getUser(email)
        if (userStatus === user.userStatus) {
            throw new Error("登録済のステータスと同じです")
        }

        const userEntity = new User({
            id: user.id,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            userStatus: userStatus,
        })

        if (userStatus === 'studying') {
            //ここもトランザクション必要
            await this.userRepo.save(userEntity);
            await this.teamRepo.getTeamPairbyUserName(userEntity.getUserId().id);
        } else {
            await this.userRepo.changeUserStatus(userEntity);
            await this.teamRepo.deletePairteam(userEntity.getUserId().id);
        }
    }
}