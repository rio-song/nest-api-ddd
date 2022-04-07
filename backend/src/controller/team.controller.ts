import { Body, Controller, Get, Post, Put } from '@nestjs/common'
//import { ApiResponse } from '@nestjs/swagger'
import { GetTeamResponse } from './response/get-team-response'
import { PostTeamRequest } from './request/post-team-request'
import { PutTeamRequest } from './request/put-team-request'
import { PutTeamUseCase } from 'src/app/team-usecate/put-team-usecase'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { PostTeamUseCase } from 'src/app/team-usecate/post-team-usecase'
import { GetAllTeamsUseCase } from 'src/app/team-usecate/get-team-usecase'
import { TeamQS } from 'src/infra/db/query-service/team-qs'
import { PrismaClient } from '@prisma/client'
//import { Injectable } from '@nestjs/common';

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

    @Post()
    async postTeam(
        @Body() postTeamDto: PostTeamRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new TeamRepository(prisma)
        const teamQS = new TeamQS(prisma)
        const usecase = new PostTeamUseCase(repo, teamQS)
        await usecase.do({
            teamName: postTeamDto.teamName,
        })
    }

    @Put()
    async putTeam(
        @Body() putTeamDto: PutTeamRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new TeamRepository(prisma)
        const teamQS = new TeamQS(prisma)
        //const userQS = new UserQS(prisma)
        const usecase = new PutTeamUseCase(repo
            //, repo, userQS
        )
        await usecase.do({
            teamName: putTeamDto.teamName,
            pairName: putTeamDto.pairName
        })
    }

}
