import { Body, Controller, Get, Post, Put } from '@nestjs/common'
//import { ApiResponse } from '@nestjs/swagger'
import { GetTeamResponse } from './response/get-team-response'
import { PostTeamRequest } from './request/post-team-request'
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
        const pairQS = new TeamQS(prisma)
        const usecase = new PostTeamUseCase(repo, pairQS)
        await usecase.do({
            teamName: postTeamDto.teamName,
        })
    }

    // @Put()
    // async putPair(
    //     @Body() postPairDto: PostPairRequest,
    // ): Promise<void> {
    //     const prisma = new PrismaClient()
    //     const repo = new PairRepository(prisma)
    //     const pairQS = new PairQS(prisma)
    //     const userQS = new UserQS(prisma)
    //     const usecase = new PutPairUseCase(pairQS, repo, userQS)
    //     await usecase.do({
    //         pairName: postPairDto.pairName,
    //         memberEmails: postPairDto.memberEmails
    //     })
    // }

}
