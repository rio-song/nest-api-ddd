import { Pair, PairNameVO } from 'src/domain/entity/pair'
import { User } from 'src/domain/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IPairRepository } from 'src/domain/repository-interface/pair-repository'
import { IPairQS } from 'src/app/query-service-interface/pair-qs'
import { UserDTO } from '../query-service-interface/user-qs'
import { IUserQS } from '../query-service-interface/user-qs'


export class PostPairUseCase {
    private readonly pairRepo: IPairRepository
    private readonly pairQS: IPairQS
    private readonly userQS: IUserQS

    public constructor(pairRepo: IPairRepository, pairQS: IPairQS, userQS: IUserQS) {
        this.pairRepo = pairRepo,
            this.pairQS = pairQS,
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

        const userDTO = await this.userQS.getUser(memberEmails)

        const pairEntity = new Pair({
            id: createRandomIdString(),
            pairName: pairName,
            users: new User(userDTO)
        })
        await this.pairRepo.save(pairEntity)
    }

}

