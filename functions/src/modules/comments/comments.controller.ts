import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OwnershipGuard } from '../../common/guards/ownership.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  getComments(
    @Param('postId') postId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('parentId') parentId?: string,
    @Query('lastDocId') lastDocId?: string,
  ) {
    return this.commentService.getComments(postId, limit, parentId, lastDocId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  createComment(
    @GetUser('uid') userId: string,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(userId, postId, createCommentDto);
  }

  @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  @CheckOwnership({
    resource: 'comments',
    idParam: 'commentId',
    ownerField: 'authorId',
  })
  @Put(':commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(commentId, updateCommentDto);
  }

  @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  @CheckOwnership({
    resource: 'comments',
    idParam: 'commentId',
    ownerField: 'authorId',
  })
  @Delete(':commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
