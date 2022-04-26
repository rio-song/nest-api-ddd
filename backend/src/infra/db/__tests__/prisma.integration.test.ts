import { prisma } from '@testUtil/prisma'

describe('prism全般に関するテスト', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany()
    })
    afterAll(async () => {
        await prisma.$disconnect()
    })
    describe('基本的なcrud機能', () => {
        afterEach(async () => {
            await prisma.user.deleteMany()
        })
        it('DBに追加できる', async () => {
            await prisma.user.create({
                data: {
                    id: '1',
                    lastName: 'AAA',
                    firstName: 'BBB',
                    email: 'aaa@gmail.com',
                    userStatus: 'studyng'
                },
            })
            const alluser = await prisma.user.findMany()
            expect(alluser).toHaveLength(1)
        })
        it('DBを更新できる', async () => {
            await prisma.user.update({
                where: {
                    id: '1',
                },
                data: {
                    userStatus: 'studyng'
                },
            })
            const alluser = await prisma.user.findMany()
            expect(alluser).toHaveLength(1)
        })
    })
    describe('トランザクション', () => {
        it('トランザクション処理中に問題が発生したらロールバックされる', async () => {
            try {
                const task1 = prisma.user.create({
                    data: {
                        id: '1',
                        lastName: 'AAA',
                        firstName: 'BBB',
                        email: 'aaa@gmail.com',
                        userStatus: 'studyng'
                    },
                })
                const task2 = prisma.user.create({
                    data: {
                        id: '1',
                        lastName: 'AAA',
                        firstName: 'BBB',
                        email: 'aaa@gmail.com',
                        userStatus: 'studyng'
                    },
                })
                await prisma.$transaction([task1, task2])
            } catch (error) {
                const alluser = await prisma.user.findMany()
                expect(alluser).toHaveLength(0)
            }
        })
    })
})
