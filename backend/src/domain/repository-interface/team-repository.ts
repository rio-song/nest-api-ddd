import { Team } from '../entity/team'

export interface ITeamRepository {
    //書き方不明、保留中
    updatePairTeam(teamEntity: Team): Promise<Team[]>
    updatePairTeamWhenSmall(teamEntity: Team): Promise<Team[]>
    getTeamPairbyUserName(userId: string): Promise<Team[]>
    deletePairteam(userId: string): Promise<Team[]>
    getTeamPairbyTeamName(teamName: number, pairName: string[]): Promise<Team[]>
    updatePairMember(pairName: string, memberEmails: string[]): Promise<Team[]>
}
