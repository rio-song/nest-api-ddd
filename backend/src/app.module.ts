import { Module } from '@nestjs/common'
import { PairController } from './controller/pair.controller'
import { UserController } from './controller/user.controller'
import { TeamController } from './controller/team.controller'
import { LessonController } from './controller/lesson.controller'
import { UserLessonController } from './controller/user-lesson.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [UserController, PairController, TeamController, LessonController, UserLessonController],
  providers: [],
})
export class AppModule { }
