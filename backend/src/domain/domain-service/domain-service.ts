import { PrismaClient } from '@prisma/client'

export class DomainService {

    public async emailDoubleCheck(email: string) {
        const emailDoubleCheck = await new PrismaClient().user.findFirst({
            where: {
                email: email
            },
        })
        if (emailDoubleCheck !== null) {
            throw new Error("既に存在するユーザーです")
        }
    }
}