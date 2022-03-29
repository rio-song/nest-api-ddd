import { Module } from '@nestjs/common'
import { PairController } from './controller/pair.controller'
import { UserController } from './controller/user.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [UserController, PairController],
  providers: [],
})
export class AppModule { }
