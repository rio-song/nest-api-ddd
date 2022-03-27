import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetUserResponse } from './response/get-user-response'
import { PostUserRequest } from './request/post-user-request'
import { GetAllUsersUseCase } from '../app/get-user-usecase'
import { PostUserUseCase } from '../app/post-user-usecase'
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

    // @ApiResponse({ status: 200, type: GetUserResponse })
    // async getSomeData(): Promise<GetUserResponse> {
    //     const prisma = new PrismaClient()
    //     const qs = new UserQS(prisma)
    //     const usecase = new GetAllUsersUseCase(qs)
    //     const result = await usecase.do()
    //     const response = new GetUserResponse({ Users: result })
    //     return response
    // }

    @Post()
    async postUser(
        @Body() postUserDto: PostUserRequest,
    ): Promise<void> {
        const prisma = new PrismaClient()
        const repo = new UserRepository(prisma)
        const usecase = new PostUserUseCase(repo)
        await usecase.do({
            lastName: postUserDto.lastName,
            firstName: postUserDto.firstName,
            email: postUserDto.email,
            userStatus: postUserDto.userStatus,
        })
    }
}
