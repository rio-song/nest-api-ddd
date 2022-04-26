import { User } from 'src/domain/entity/user'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { IUserQS } from 'src/app/query-service-interface/user-qs'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { JoinTeamPair } from 'src/domain/domain-service/joinTeamPair'


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
        const joinTeamPair = new JoinTeamPair(this.userRepo, this.teamRepo)

        //以下、post-user-usecaseと重複している。けど、どこでまとめていいかわからない。
        if (userStatus === 'studying') {
            await this.userRepo.save(userEntity)
            joinTeamPair.JoinTeamPair(userEntity)

        } else {
            //休学・退学時
            //ステータス変更ユーザーが所属しているペア名の取得。
            const team = await this.teamRepo.getTeamPairbyUserId(userEntity.getUserId().id)

            await this.userRepo.changeUserStatus(userEntity);
            await this.teamRepo.deletePairMember(userEntity.getUserId().id);

            //ステータス変更ユーザーが所属しているペアの残りのメンバーを取得。
            const users = await this.userRepo.getUserIdbyPairId(team.getPairs()[0]?.getPairId() || "")
            //ペア内の情報の取得
            if (users.length = 1) {

                //ユーザーとペアの紐づきを削除。
                await this.teamRepo.deletePairMember(userEntity.getUserId().id);
                //そのペアを削除。
                await this.teamRepo.deletePair(team.getPairs()[0]?.getPairId() || "");

                joinTeamPair.JoinTeamPair(userEntity)


            } else if (users.length = 0) {
                //ペア自体の削除。
                await this.teamRepo.deletePair(team.getPairs()[0]?.getPairId() || "");
            }
        }
    }
}

