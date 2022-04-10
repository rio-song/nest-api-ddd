
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'

export class PutTeamUseCase {
    private readonly teamRepository: ITeamRepository
    public constructor(
        teamRepository: ITeamRepository,
    ) {
        this.teamRepository = teamRepository
    }

    public async do(params: {
        teamName: number;
        pairName: string[]
    }) {

        const {
            teamName,
            pairName
        } = params

        const team = await this.teamRepository.getTeamPairbyTeamName(teamName, pairName)
    }
}
