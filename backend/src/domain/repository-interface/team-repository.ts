import { Team } from '../entity/team'

export interface ITeamRepository {
    save(Team: Team): Promise<Team>
    //書き方不明、保留中
    update(params: any): Promise<any>
}
