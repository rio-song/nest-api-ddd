import { Team, TeamNameVO } from 'src/domain/entity/team'
import { createRandomIdString } from 'src/util/random'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { ITeamQS } from '../query-service-interface/team-qs'
import { Pair } from 'src/domain/entity/pair'

export class PostTeamUseCase {
    private readonly teamRepo: ITeamRepository
    private readonly teamQS: ITeamQS

    public constructor(teamRepo: ITeamRepository, teamQS: ITeamQS) {
        this.teamRepo = teamRepo,
            this.teamQS = teamQS
    }

    public async do(params: {
        teamName: number;
    }) {
        const {
            teamName,
        } = params

        const gatTeamName = await this.teamQS.getTeam(teamName)

        if (gatTeamName === true) {
            throw new Error("既に存在するチーム名です");
        }

        const teamEntity = new Team({
            id: createRandomIdString(),
            teamName: new TeamNameVO(teamName),
            pairs: null
        })

        await this.teamRepo.save(teamEntity);
    }

}

