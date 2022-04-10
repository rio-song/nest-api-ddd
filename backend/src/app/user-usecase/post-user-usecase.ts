import { User } from 'src/domain/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { DomainService } from 'src/domain/domain-service/domain-service'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'

export class PostUserUseCase {
    private readonly userRepo: IUserRepository
    private readonly teamRepo: ITeamRepository

    public constructor(userRepo: IUserRepository, teamRepo: ITeamRepository,) {
        this.userRepo = userRepo,
            this.teamRepo = teamRepo
    }
    public async do(params: {
        lastName: string;
        firstName: string;
        email: string;
        userStatus: string;
    }) {

        const {
            lastName,
            firstName,
            email,
            userStatus,
        } = params

        new DomainService().emailDoubleCheck(email);

        const userEntity = new User({
            id: createRandomIdString(),
            lastName,
            firstName,
            email,
            userStatus,
        })

        //ここもトランザクション必要
        await this.userRepo.save(userEntity);

        if (userStatus === "studying") {
            const allTeamMember = await this.teamRepo.getTeamPairbyUserName(userEntity.getUserId().id);
        }
    }
}
