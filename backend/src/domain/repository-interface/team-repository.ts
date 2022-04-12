import { Team } from '../entity/team'

export interface ITeamRepository {
    //書き方不明、保留中
    getTeamEntity(): Promise<Team[]>
    getPairUnder3members(): Promise<Team | null>
    joinPair(teamEntity: Team): Promise<Team[]>
    createPair(teamId: string, pairName: string): Promise<{ id: string, pairName: string }>
    getTeamId(): Promise<{ id: string, teamName: number } | null>

    createTeamPair(teamEntity: Team): Promise<Team[]>
    updatePairTeamWhenSmall(teamEntity: Team): Promise<Team[]>
    //getTeamPairbyUserName(userId: string): Promise<Team[]>
    deletePairteam(userId: string): Promise<Team[]>
    getTeamPairbyTeamName(teamName: number, pairName: string[]): Promise<Team[]>
    updatePairMember(pairName: string, memberEmails: string[]): Promise<Team[]>
}
