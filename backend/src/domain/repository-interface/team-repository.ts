import { Team } from '../entity/team'

export interface ITeamRepository {
    //書き方不明、保留中
    getTeamEntity(): Promise<Team[]>
    getSmallestPair(): Promise<Team | null>
    getTeamId(): Promise<{ id: string, teamName: number } | null>
    getTeamPairbyTeamName(teamName: number, pairName: string[]): Promise<Team[]>
    getTeamPairbyUserId(userid: string): Promise<Team>

    joinPair(teamEntity: Team): Promise<Team[]>

    createTeamPair(teamEntity: Team): Promise<Team[]>
    createPair(teamId: string, pairName: string): Promise<{ id: string, pairName: string }>

    updatePairMember(pairName: string, memberEmails: string[]): Promise<Team[]>

    deletePairMember(userId: string): Promise<Team[]>
    deletePair(pairId: string): Promise<Team[]>
}
