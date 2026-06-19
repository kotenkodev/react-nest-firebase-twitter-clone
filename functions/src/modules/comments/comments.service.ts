import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => PostsService))
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
      parentId: data.parentId || null,
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

  async updateComment(commentId: string, data: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.isDeleted) {
      throw new ForbiddenException(`Comment with ID ${commentId} is deleted`);
    }

    return this.commentRepository.update(commentId, data);
  }

  async deleteComment(commentId: string) {
    return this.commentRepository.delete(commentId);
  }

  async deletePostComments(postId: string): Promise<void> {
    await this.commentRepository.deleteCommentsByPostId(postId);
  }
}
