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
import { ALGOLIA } from '../algolia/algolia.module';
import type { Algoliasearch } from 'algoliasearch';
import { CommentsService } from '../comments/comments.service';
import { logger } from 'firebase-functions';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LikesService))
    private readonly likesService: LikesService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(ALGOLIA) private readonly algolia: Algoliasearch,
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
    searchText?: string,
    userId?: string,
    sortBy?: 'newest' | 'popular',
  ): Promise<Post[]> {
    let posts: Post[] = [];

    if (searchText) {
      try {
        const response = await this.algolia.search({
          requests: [
            {
              indexName: 'PostsSearch',
              query: searchText,
              hitsPerPage: 100, // Fetch up to 100 hits to support cursor pagination
            },
          ],
        });

        const hits = response.results[0].hits;
        let ids = hits.map((hit) => hit.objectID);

        if (ids.length > 0) {
          if (lastDocId) {
            const index = ids.indexOf(lastDocId);
            if (index !== -1) {
              ids = ids.slice(index + 1);
            } else {
              ids = [];
            }
          }

          ids = ids.slice(0, limit);

          if (ids.length > 0) {
            const postsWithNulls =
              await this.postsRepository.findManyByIds(ids);
            posts = postsWithNulls.filter(
              (post): post is Post => post !== null,
            );
          }
        }
      } catch (error) {
        logger.error('Error searching posts via Algolia:', error);
        posts = [];
      }
    } else {
      posts = await this.postsRepository.findAll(
        limit,
        lastDocId,
        searchText,
        userId,
        sortBy,
      );
    }

    if (!currentUserId || posts.length === 0) {
      return posts.map((post) => ({
        ...post,
        userLike: null,
      }));
    }

    const likes = await this.likesService.findManyByIds(
      posts.map((post) => ({ userId: currentUserId, postId: post.id })),
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
    await this.postsRepository.delete(id);
    await this.likesService.deletePostLikes(id);
    await this.commentsService.deletePostComments(id);
  }
}
