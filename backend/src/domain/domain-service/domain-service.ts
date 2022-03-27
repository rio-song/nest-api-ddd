import { IUserQS } from 'src/app/query-service-interface/user-qs'

export class DomainService {
    private readonly userQS: IUserQS;
    public constructor(userQS: IUserQS) {
        this.userQS = userQS
    }

    public async emailDoubleCheck(email: string) {
        if (await this.userQS.emailDoubleCheck(email) === false) {
            return null
        }
    }

}