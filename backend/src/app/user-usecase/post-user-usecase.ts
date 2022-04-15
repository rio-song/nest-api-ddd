import { User } from 'src/domain/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { DomainService } from 'src/domain/domain-service/domain-service'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { JoinTeamPair } from 'src/domain/domain-service/joinTeamPair'

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

        await new DomainService().emailDoubleCheck(email) !== null
        const userEntity = new User({
            id: createRandomIdString(),
            lastName,
            firstName,
            email,
            userStatus,
        })
        await this.userRepo.save(userEntity);

        if (userStatus === "studying") {
            const joinTeamPair = new JoinTeamPair(this.userRepo, this.teamRepo)
            joinTeamPair.JoinTeamPair(userEntity)

        }
    }
}
