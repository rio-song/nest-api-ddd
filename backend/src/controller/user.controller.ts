import { Body, Controller, Get, Post, Put } from '@nestjs/common'
//import { ApiResponse } from '@nestjs/swagger'
import { GetUserResponse } from './response/get-user-response'
import { PostUserRequest } from './request/post-user-request'
import { PutUserRequest } from './request/put-user-request'
import { GetAllUsersUseCase } from '../app/user-usecase/get-user-usecase'
import { PostUserUseCase } from '../app/user-usecase/post-user-usecase'
import { PutUserUseCase } from '../app/user-usecase/put-user-usecase'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserQS } from 'src/infra/db/query-service/user-qs'
import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common';

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
        const repo = new UserRepository(prisma)
        const userQS = new UserQS(prisma)
        const usecase = new PostUserUseCase(repo, userQS)
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
        const repo = new UserRepository(prisma)
        const userQS = new UserQS(prisma)
        const usecase = new PutUserUseCase(repo, userQS)
        await usecase.do({
            lastName: putUserDto.lastName,
            firstName: putUserDto.firstName,
            email: putUserDto.email,
            userStatus: putUserDto.userStatus,
        })
    }

}
