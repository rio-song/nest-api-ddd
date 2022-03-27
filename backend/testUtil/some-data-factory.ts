import * as faker from 'faker'
import { User } from 'src/domain/entity/user'
import { prisma } from '@testUtil/prisma'

export const seedSomeData = async (params: {
    id?: string
    required?: boolean
    number?: number
}) => {
    // const { id, required, number } = params
    // const someDataEntity = new SomeData({
    //     id: id ?? faker.random.uuid(),
    //     required: required ?? true,
    //     number: number ?? 1,
    // })
    // await prisma.someData.create({
    //     data: {
    //         ...someDataEntity.getAllProperties(),
    //     },
    // })
}
