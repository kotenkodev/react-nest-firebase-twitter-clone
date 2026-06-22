import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LikesService))
    private readonly likesService: LikesService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}

  async findOne(id: string, userId?: string): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (!userId) {
      return {
        ...post,
        userLike: null,
      };
    }

    const like = await this.likesService.findOne(userId, id);

    return {
      ...post,
      userLike: like?.type || null,
    };
  }

  async findAll(
    currentUserId?: string,
    lastDocId?: string,
    limit: number = 10,
    userId?: string,
    sortBy?: 'newest' | 'popular',
  ): Promise<Post[]> {
    const posts: Post[] = await this.postsRepository.findAll(
      limit,
      lastDocId,
      userId,
      sortBy,
    );

    if (!currentUserId || posts.length === 0) {
      return posts.map((post) => ({
        ...post,
        userLike: null,
      }));
    }

    const likes = await this.likesService.findManyByIds(
      currentUserId,
      posts.map((post) => post.id),
    );

    return posts.map((post, index) => ({
      ...post,
      userLike: likes[index]?.type || null,
    }));
  }

  async create(userId: string, dto: CreatePostDto): Promise<Post | null> {
    const { id, ...postData } = dto;

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with UID ${userId} not found`);
    }

    return this.postsRepository.create(id, {
      ...postData,
      authorId: userId,
      author: {
        firstName: user.firstName,
        lastName: user.lastName,
        photoURL: user.photoURL,
      },
    });
  }

  async update(id: string, data: UpdatePostDto): Promise<Post | null> {
    return this.postsRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.likesService.deletePostLikes(id);
    await this.commentsService.deletePostComments(id);
    await this.postsRepository.delete(id);
  }
}
