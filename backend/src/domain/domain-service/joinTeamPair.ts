import { User } from 'src/domain/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { Team, TeamNameVO } from 'src/domain/entity/team'
import { Pair, PairNameVO } from 'src/domain/entity/pair'

//３ヶ所に書いてたチームペア参加を1つにまとめてみた。
export class JoinTeamPair {

    private readonly userRepo: IUserRepository
    private readonly teamRepo: ITeamRepository

    public constructor(userRepo: IUserRepository, teamRepo: ITeamRepository,) {
        this.userRepo = userRepo,
            this.teamRepo = teamRepo
    }
    public async JoinTeamPair(userEntity: User) {
        const smallestPair = await this.teamRepo.getSmallestPair()

        if (smallestPair === null) {
            const team = await this.teamRepo.getTeamId()
            if (team != null) {
                //チームはあるが紐づくペアがないため、ペアを作って加入。
                //ペアの作成
                const firstPair = "a"
                const newPair = await this.teamRepo.createPair(team.id, firstPair)

                const teamEntity = new Team({
                    id: team.id,
                    teamName: new TeamNameVO(team.teamName),
                    pairs: [new Pair({
                        id: newPair.id,
                        pairName: new PairNameVO(newPair.pairName),
                        users: [userEntity.getUserId().id]
                    })]
                })
                //ペアに加入。
                await this.teamRepo.joinPair(teamEntity)

            } else {
                //チームもペアない
                const teamEntity = new Team({
                    id: createRandomIdString(),
                    teamName: new TeamNameVO(1),
                    pairs: [new Pair({
                        id: createRandomIdString(),
                        pairName: new PairNameVO("a"),
                        users: [userEntity.getUserId().id]
                    })]
                })
                await this.teamRepo.createTeamPair(teamEntity);
            }

        } else {
            const countMembersOfSmallestPair = smallestPair.getPairs().map((u) => u.countmembersOfPair)

            //最も人数の少ないペアが３人以下の場合(所属するメンバーが0件になった場合、ペアは削除される前提)
            if (countMembersOfSmallestPair.length < 3) {
                const teamEntity = new Team({
                    id: smallestPair.getTeamId(),
                    teamName: smallestPair.getTeamName(),
                    pairs: smallestPair.getPairs().map((p) => new Pair({
                        id: p.getPairId(),
                        pairName: p.getPairName(),
                        users: [userEntity.getUserId().id]
                    }))
                })
                //ペアに加入。
                await this.teamRepo.joinPair(teamEntity)

            } else {
                //最も人数の少ないペアが所属するチーム内のペアの人数を確認
                if (smallestPair.getPairs.length < 26) {

                    //使われていないpairNameの検索
                    const unusedPairName = ""

                    //新しいペアの作成
                    const newPair = await this.teamRepo.createPair(smallestPair.getTeamId(), unusedPairName)

                    const teamEntity = new Team({
                        id: smallestPair.getTeamId(),
                        teamName: smallestPair.getTeamName(),
                        pairs: [new Pair({
                            id: newPair.id,
                            pairName: new PairNameVO(unusedPairName),
                            users: [userEntity.getUserId().id]
                        })]
                    })
                    //ペアに加入。
                    await this.teamRepo.joinPair(teamEntity)

                } else {
                    //使われていないteamNameの検索
                    const unusedTeamName = ;

                    //新しいチームペア作成。そのチームに加入。
                    const teamEntity = new Team({
                        id: createRandomIdString(),
                        teamName: new TeamNameVO(unusedTeamName),
                        pairs: [new Pair({
                            id: createRandomIdString(),
                            pairName: new PairNameVO("a"),
                            users: [userEntity.getUserId().id]
                        })]
                    })
                    await this.teamRepo.createTeamPair(teamEntity);

                }
            }
        }
    }
}
