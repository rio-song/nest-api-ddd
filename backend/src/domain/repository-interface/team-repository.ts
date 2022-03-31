import { Team } from '../entity/team'

export interface ITeamRepository {
    save(Team: Team): Promise<Team>
    //  update(Pair: Pair): Promise<Pair>
}
