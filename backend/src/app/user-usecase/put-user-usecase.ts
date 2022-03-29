import { User } from 'src/domain/entity/user'
import { Pair } from 'src/domain/entity/pair'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { IUserQS } from 'src/app/query-service-interface/user-qs'
import { IPairQS } from '../query-service-interface/pair-qs'
import { IPairRepository } from 'src/domain/repository-interface/pair-repository'
import { createRandomIdString } from 'src/util/random'



export class PutUserUseCase {
    private readonly userRepo: IUserRepository
    private readonly pairRepository: IPairRepository
    private readonly userQS: IUserQS
    private readonly pairQS: IPairQS

    public constructor(userQS: IUserQS, userRepo: IUserRepository, pairQS: IPairQS, pairRepository: IPairRepository) {
        this.userRepo = userRepo,
            this.userQS = userQS,
            this.pairQS = pairQS,
            this.pairRepository = pairRepository
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

        if (userStatus === 'withdraw') {
            //チームとペアから抜ける。
        }

        if (userStatus === 'breaking') {
            //チームとペアから抜ける。
        }

        if (userStatus === 'studying') {
            //ペアに所属する。
            const pair = await this.pairQS.getAllPairs()
            if (pair.length === 0) {
                //idを採番
                //pairNameを新規作成
                //teamIdを決める
                const id = createRandomIdString()

                // const pairEntity = new Pair({
                //     id,
                //     pairName,
                //     teamId: "aaaa",
                // })

                // this.pairRepository.save(pairEntity)

            } else {


            }


            //チームに所属する。
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