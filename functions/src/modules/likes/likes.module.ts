import { forwardRef, Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikesRepository } from './likes.repository';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { InteractionsController } from './interactions.controller';

@Module({
  imports: [UsersModule, forwardRef(() => PostsModule)],
  controllers: [LikesController, InteractionsController],
  providers: [LikesService, LikesRepository],
  exports: [LikesService],
})
export class LikesModule {}
