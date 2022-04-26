import { ITeamQS } from '../query-service-interface/team-qs'

export class GetAllTeamsUseCase {
    private readonly teamQS: ITeamQS
    public constructor(teamQS: ITeamQS) {
        this.teamQS = teamQS
    }
    public async do() {
        try {
            return await this.teamQS.getAllTeams()
        } catch (error) {
            // memo: エラー処理
            throw error
        }
    }
}
