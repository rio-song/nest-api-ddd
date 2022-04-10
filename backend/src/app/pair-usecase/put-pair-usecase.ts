
import { IPairQS } from '../query-service-interface/pair-qs'
import { createRandomIdString } from 'src/util/random'
import { IUserQS } from '../query-service-interface/user-qs'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'

export class PutPairUseCase {
    private readonly teamRepo: ITeamRepository

    public constructor(teamRepo: ITeamRepository) {
        this.teamRepo = teamRepo
    }

    public async do(params: {
        pairName: string;
        memberEmails: string[]
    }) {

        const {
            pairName,
            memberEmails
        } = params

        //ペアドメインに本来ならかくことかもしれないが、ペアドメインでは、３件以上ある場合、ユーザーを分割するが、
        //pairの更新時にユーザーが違うユーザーにくっつくのは違和感なので、ここでエラーを返すように記載。
        if (memberEmails.length > 3) {
            throw new Error("3人以上では更新できません")
        }

        const pair = await this.teamRepo.updatePairMember(pairName, memberEmails)
    }
}
