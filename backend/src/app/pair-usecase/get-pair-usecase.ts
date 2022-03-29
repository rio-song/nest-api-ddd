import { IPairQS } from '../query-service-interface/pair-qs'

export class GetAllPairsUseCase {
    private readonly pairQS: IPairQS
    public constructor(pairQS: IPairQS) {
        this.pairQS = pairQS
    }
    public async do() {
        try {
            return await this.pairQS.getAllPairs()
        } catch (error) {
            // memo: エラー処理
            throw error
        }
    }
}
