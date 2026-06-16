import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}

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

    const user = await this.usersService.findOne(uid);
    if (!user) {
      throw new NotFoundException(`User with UID ${uid} not found`);
    }

    return this.postsRepository.create(id, {
      ...postData,
      authorId: uid,
      author: {
        firstName: user.firstName,
        lastName: user.lastName,
        photoURL: user.photoURL,
      },
    });
  }

  async update(id: string, data: UpdatePostDto): Promise<Post> {
    return this.postsRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }
}
