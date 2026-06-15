import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.findAll();
  }

  async create(uid: string, dto: CreatePostDto): Promise<Post> {
    const { id, ...postData } = dto;

    return this.postsRepository.create(id, {
      ...postData,
      authorId: uid,
    });
  }

  async update(id: string, data: UpdatePostDto): Promise<Post> {
    return this.postsRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }
}
