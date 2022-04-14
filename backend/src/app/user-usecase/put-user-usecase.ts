import { User } from 'src/domain/entity/user'
import { IUserRepository } from 'src/domain/repository-interface/user-repository'
import { IUserQS } from 'src/app/query-service-interface/user-qs'
import { ITeamRepository } from 'src/domain/repository-interface/team-repository'
import { Team, TeamNameVO } from 'src/domain/entity/team'
import { Pair, PairNameVO } from 'src/domain/entity/pair'
import { createRandomIdString } from 'src/util/random'


export class PutUserUseCase {
    private readonly userRepo: IUserRepository
    private readonly teamRepo: ITeamRepository
    private readonly userQS: IUserQS

    public constructor(userQS: IUserQS, userRepo: IUserRepository, teamRepo: ITeamRepository) {
        this.userRepo = userRepo,
            this.userQS = userQS,
            this.teamRepo = teamRepo
    }

    public async do(params: {
        lastName: string;
        firstName: string;
        email: string;
        userStatus: string;
    }) {

        //constをletに書き換えてOKか
        let {
            email,
            userStatus,
        } = params

        const user = await this.userQS.getUser(email)
        if (userStatus === user.userStatus) {
            throw new Error("登録済のステータスと同じです")
        }

        const userEntity = new User({
            id: user.id,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            userStatus: userStatus,
        })

        //以下、post-user-usecaseと重複している。けど、どこでまとめていいかわからない。
        if (userStatus === 'studying') {
            await this.userRepo.save(userEntity)

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

        } else {
            //休学・退学時
            //ステータス変更ユーザーが所属しているペア名の取得。
            const team = await this.teamRepo.getTeamPairbyUserId(userEntity.getUserId().id)

            await this.userRepo.changeUserStatus(userEntity);
            await this.teamRepo.deletePairMember(userEntity.getUserId().id);

            //ステータス変更ユーザーが所属しているペアの残りのメンバーを取得。
            const users = await this.userRepo.getUserIdbyPairId(team.getPairs()[0]?.getPairId() || "")
            //ペア内の情報の取得
            if (users.length = 1) {

                //ユーザーとペアの紐づきを削除。
                await this.teamRepo.deletePairMember(userEntity.getUserId().id);
                //そのペアを削除。
                await this.teamRepo.deletePair(team.getPairs()[0]?.getPairId() || "");

                const smallestPair = await this.teamRepo.getSmallestPair()

                //以下同じ処理を３回目重複して書いているので移動したい。
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

            } else if (users.length = 0) {
                //ペア自体の削除。
                await this.teamRepo.deletePair(team.getPairs()[0]?.getPairId() || "");
            }
        }
    }
}

