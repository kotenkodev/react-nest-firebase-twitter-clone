import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { LikesService } from './likes.service';

@UseGuards(FirebaseAuthGuard, OwnershipGuard)
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @CheckOwnership({
    resource: 'likes',
    idParam: 'id',
    ownerField: 'userId',
  })
  @Post()
  async likePost(
    @Param('postId') postId: string,
    @GetUser('uid') userId: string,
    @Body() body: ToggleLikeDto,
  ) {
    return await this.likesService.upsert(userId, postId, body.type);
  }

  @CheckOwnership({
    resource: 'likes',
    idParam: 'id',
    ownerField: 'userId',
  })
  @Delete(':id')
  async deleteLike(
    @Param('postId') postId: string,
    @GetUser('uid') userId: string,
  ) {
    return await this.likesService.delete(userId, postId);
  }
}
