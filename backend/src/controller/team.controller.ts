import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { GetTeamResponse } from './response/get-team-response'
import { PutTeamRequest } from './request/put-team-request'
import { PutTeamUseCase } from 'src/app/team-usecate/put-team-usecase'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { GetAllTeamsUseCase } from 'src/app/team-usecate/get-team-usecase'
import { TeamQS } from 'src/infra/db/query-service/team-qs'
import { PrismaClient } from '@prisma/client'

@Controller({
    path: '/team',
})
export class TeamController {
    @Get()
    async getAllTeam(): Promise<GetTeamResponse> {
        const prisma = new PrismaClient()
        const qs = new TeamQS(prisma)
        const usecase = new GetAllTeamsUseCase(qs)
        const result = await usecase.do()
        const response = new GetTeamResponse({ team: result })
        return response
    }

    @Put()
    async putTeam(
        @Body() putTeamDto: PutTeamRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new TeamRepository(prisma)
        const usecase = new PutTeamUseCase(repo)
        await usecase.do({
            teamName: putTeamDto.teamName,
            pairName: putTeamDto.pairName
        })
    }

}
