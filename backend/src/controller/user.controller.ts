import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PostUserRequest } from './request/post-user-request'
import { PutUserRequest } from './request/put-user-request'
import { GetUserResponse } from './response/get-user-response'
import { GetAllUsersUseCase } from '../app/user-usecase/get-user-usecase'
import { PostUserUseCase } from '../app/user-usecase/post-user-usecase'
import { PutUserUseCase } from '../app/user-usecase/put-user-usecase'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserQS } from 'src/infra/db/query-service/user-qs'

@Controller({
    path: '/user',
})
export class UserController {
    @Get()
    async getAllUsers(): Promise<GetUserResponse> {
        const prisma = new PrismaClient()
        const qs = new UserQS(prisma)
        const usecase = new GetAllUsersUseCase(qs)
        const result = await usecase.do()
        const response = new GetUserResponse({ Users: result })
        return response
    }

    @Post()
    async postUser(
        @Body() postUserDto: PostUserRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const userRepo = new UserRepository(prisma)
        const teamRepo = new TeamRepository(prisma)
        const usecase = new PostUserUseCase(userRepo, teamRepo)
        await usecase.do({
            lastName: postUserDto.lastName,
            firstName: postUserDto.firstName,
            email: postUserDto.email,
            userStatus: postUserDto.userStatus,
        })
    }

    @Put()
    async putUser(
        @Body() putUserDto: PutUserRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repoUser = new UserRepository(prisma)
        const teamRepo = new TeamRepository(prisma)
        const userQS = new UserQS(prisma)
        const usecase = new PutUserUseCase(userQS, repoUser, teamRepo)
        await usecase.do({
            lastName: putUserDto.lastName,
            firstName: putUserDto.firstName,
            email: putUserDto.email,
            userStatus: putUserDto.userStatus,
        })
    }

}
