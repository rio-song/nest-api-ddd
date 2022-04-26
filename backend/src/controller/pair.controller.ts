import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { GetPairResponse } from './response/get-pair-response'
import { PutPairRequest } from './request/put-pair-request'
import { GetAllPairsUseCase } from '../app/pair-usecase/get-pair-usecase'
import { PairQS } from 'src/infra/db/query-service/pair-qs'
import { PrismaClient } from '@prisma/client'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { PutPairUseCase } from 'src/app/pair-usecase/put-pair-usecase'

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

    @Put()
    async putPair(
        @Body() putPairDto: PutPairRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new TeamRepository(prisma)
        const usecase = new PutPairUseCase(repo)
        await usecase.do({
            pairName: putPairDto.pairName,
            memberEmails: putPairDto.memberEmails
        })
    }

}
