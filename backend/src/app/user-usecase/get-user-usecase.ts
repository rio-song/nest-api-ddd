import { IUserQS } from '../query-service-interface/user-qs'

export class GetAllUsersUseCase {
    private readonly userQS: IUserQS
    public constructor(userQS: IUserQS) {
        this.userQS = userQS
    }
    public async do() {
        try {
            return await this.userQS.getAllUsers()
        } catch (error) {
            // memo: エラー処理
            throw error
        }
    }
}
