import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { LikesService } from './likes.service';

@UseGuards(FirebaseAuthGuard)
@Controller('likes')
export class InteractionsController {
  constructor(private readonly likesService: LikesService) {}

  @Post('interactions')
  @HttpCode(200)
  async getPostInteractions(
    @GetUser('uid') userId: string,
    @Body() body: { postIds: string[] },
  ) {
    return await this.likesService.findManyByIds(userId, body.postIds);
  }
}
