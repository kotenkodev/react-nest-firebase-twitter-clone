import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from '../users/users.service';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  getComments(
    postId: string,
    limit: number = 10,
    parentId?: string,
    lastDocId?: string,
  ) {
    return this.commentRepository.findAll(postId, limit, parentId, lastDocId);
  }

  async createComment(userId: string, postId: string, data: CreateCommentDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with UID ${userId} not found`);
    }

    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const newComment: Partial<Comment> = {
      ...data,
      postId,
      authorId: userId,
      author: {
        firstName: user.firstName,
        lastName: user.lastName,
        photoURL: user.photoURL,
      },
    };

    return this.commentRepository.create(newComment);
  }

  updateComment(commentId: string, data: UpdateCommentDto) {
    return this.commentRepository.update(commentId, data);
  }

  deleteComment(commentId: string) {
    return this.commentRepository.delete(commentId);
  }
}
