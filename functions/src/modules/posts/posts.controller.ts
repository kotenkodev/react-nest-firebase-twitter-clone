import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { CheckOwnership } from 'src/common/decorators/check-ownership.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() postData: CreatePostDto) {}

  @UseGuards(FirebaseAuthGuard)
  @UseGuards(OwnershipGuard)
  @CheckOwnership({
    resource: 'posts',
    idParam: 'id',
    ownerField: 'authorId',
  })
  @Patch(':id')
  async updatePostById(
    @Param('id') id: string,
    @Body() postData: UpdatePostDto,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @UseGuards(OwnershipGuard)
  @CheckOwnership({
    resource: 'posts',
    idParam: 'id',
    ownerField: 'authorId',
  })
  @Get(':id')
  findPostById(@Param('id') id: string) {}

  @UseGuards(FirebaseAuthGuard)
  @UseGuards(OwnershipGuard)
  @CheckOwnership({
    resource: 'posts',
    idParam: 'id',
    ownerField: 'authorId',
  })
  @Delete(':id')
  async deletePostById(@Param('id') id: string) {}
}
