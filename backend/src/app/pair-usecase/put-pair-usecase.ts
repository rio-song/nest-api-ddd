import { Pair, PairNameVO } from 'src/domain/entity/pair'
import { IPairQS } from '../query-service-interface/pair-qs'
import { IPairRepository } from 'src/domain/repository-interface/pair-repository'
import { createRandomIdString } from 'src/util/random'


export class PutUserUseCase {
    private readonly pairRepository: IPairRepository
    private readonly pairQS: IPairQS

    public constructor(pairQS: IPairQS, pairRepository: IPairRepository) {
        this.pairQS = pairQS,
            this.pairRepository = pairRepository
    }

    public async do(params: {
        pairName: PairNameVO;
        teamId: string;
    }) {

        const {
            pairName,
            teamId,
        } = params

        // const userEntity = new Pair({
        //     id: createRandomIdString(),
        //     pairName,
        //     teamId,
        // })
        //await this.pairRepository.update(userEntity)
    }
}