import { Pair, PairNameVO } from 'src/domain/entity/pair'
import { User } from 'src/domain/entity/user'
import { IPairQS } from '../query-service-interface/pair-qs'
import { IPairRepository } from 'src/domain/repository-interface/pair-repository'
import { createRandomIdString } from 'src/util/random'
import { IUserQS } from '../query-service-interface/user-qs'


export class PutUserUseCase {
    private readonly pairRepository: IPairRepository
    private readonly pairQS: IPairQS
    private readonly userQS: IUserQS

    public constructor(pairQS: IPairQS, pairRepository: IPairRepository, userQS: IUserQS) {
        this.pairQS = pairQS,
            this.pairRepository = pairRepository
        this.userQS = userQS
    }

    public async do(params: {
        pairName: string;
        memberEmails: string
    }) {

        const {
            pairName,
            memberEmails
        } = params

        const pair = await this.pairQS.getPair(pairName)
        const user = await this.userQS.getUser(memberEmails)

        const pairEntity = new Pair({
            id: pair.id,
            pairName,
            users: new User(user)
        })
        await this.pairRepository.update(pairEntity)
    }
}
