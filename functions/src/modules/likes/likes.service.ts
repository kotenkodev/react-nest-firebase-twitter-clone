import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Like, LikeType } from './entities/like.entity';
import { LikesRepository } from './likes.repository';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}

  private generateLikeId(userId: string, postId: string): string {
    return `${userId}_${postId}`;
  }

  async findOne(userId: string, postId: string): Promise<Like | null> {
    const likeId = this.generateLikeId(userId, postId);
    return this.likesRepository.findOne(likeId);
  }

  async findManyByIds(
    ids: { userId: string; postId: string }[],
  ): Promise<(Like | null)[]> {
    const likeIds = ids.map((id) => this.generateLikeId(id.userId, id.postId));
    return this.likesRepository.findManyByIds(likeIds);
  }

  async upsert(
    userId: string,
    postId: string,
    type: LikeType,
  ): Promise<Like | null> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const post = await this.postService.findOne(postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    const like = await this.likesRepository.findOne(
      this.generateLikeId(userId, postId),
    );

    if (!like) {
      return await this.create(userId, postId, type);
    } else {
      if (like.type === type) {
        await this.likesRepository.delete(like.id);
        return null;
      }

      return await this.updateLikeType(like, type);
    }
  }

  private async create(
    userId: string,
    postId: string,
    type: LikeType,
  ): Promise<Like | null> {
    const likeId = this.generateLikeId(userId, postId);
    const existingLike = await this.likesRepository.findOne(likeId);
    if (existingLike) {
      throw new Error(
        `Like already exists for user ${userId} and post ${postId}`,
      );
    }

    return await this.likesRepository.create(likeId, {
      userId,
      postId,
      type,
    });
  }

  private async updateLikeType(
    existingLike: Like,
    newType: LikeType,
  ): Promise<Like> {
    if (existingLike.type === newType) {
      throw new Error(
        `Like type is already ${newType} for user ${existingLike.userId} and post ${existingLike.postId}`,
      );
    }

    const updatedLike = await this.likesRepository.update(existingLike.id, {
      type: newType,
    });
    return updatedLike!;
  }

  async delete(userId: string, postId: string): Promise<void> {
    const likeId = this.generateLikeId(userId, postId);
    await this.likesRepository.delete(likeId);
  }

  async deletePostLikes(postId: string): Promise<void> {
    await this.likesRepository.deleteLikesByPostId(postId);
  }
}
