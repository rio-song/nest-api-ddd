import { Body, Controller, Get, Post, Put } from '@nestjs/common'
//import { ApiResponse } from '@nestjs/swagger'
import { GetPairResponse } from './response/get-pair-response'
import { PostPairRequest } from './request/post-pair-request'
import { GetAllPairsUseCase } from '../app/pair-usecase/get-pair-usecase'
import { PostPairUseCase } from '../app/pair-usecase/post-pair-usecase'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { PairQS } from 'src/infra/db/query-service/pair-qs'
import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common';
import { UserQS } from 'src/infra/db/query-service/user-qs'

@Controller({
    path: '/pair',
})
export class PairController {
    @Get()
    async getAllPairs(): Promise<GetPairResponse> {
        const prisma = new PrismaClient()
        const qs = new PairQS(prisma)
        const usecase = new GetAllPairsUseCase(qs)
        const result = await usecase.do()
        const response = new GetPairResponse({ Pairs: result })
        return response
    }

    @Post()
    async postPair(
        @Body() postPairDto: PostPairRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new PairRepository(prisma)
        const pairQS = new PairQS(prisma)
        const userQS = new UserQS(prisma)
        const usecase = new PostPairUseCase(repo, pairQS, userQS)
        await usecase.do({
            pairName: postPairDto.pairName,
            memberEmails: postPairDto.memberEmails
        })
    }

    @Put()
    async putPair(
        @Body() postPairDto: PostPairRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new PairRepository(prisma)
        const pairQS = new PairQS(prisma)
        const userQS = new UserQS(prisma)
        const usecase = new PostPairUseCase(repo, pairQS, userQS)
        await usecase.do({
            pairName: postPairDto.pairName,
            memberEmails: postPairDto.memberEmails
        })
    }

}
