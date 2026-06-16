import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikesRepository } from './dto/likes.repository';

@Module({
  providers: [LikesService, LikesRepository],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
