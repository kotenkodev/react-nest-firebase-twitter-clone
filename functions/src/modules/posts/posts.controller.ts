import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { FirebaseOptionalAuthGuard } from 'src/common/guards/firebase-optional-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(FirebaseOptionalAuthGuard)
  @Get(':id')
  async findPostById(@Param('id') id: string, @GetUser('uid') userId?: string) {
    return this.postsService.findOne(id, userId);
  }

  @UseGuards(FirebaseOptionalAuthGuard)
  @Get()
  async findAll(
    @GetUser('uid') userId: string,
    @Query('lastDocId') lastDocId?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.postsService.findAll(userId, lastDocId, limit);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async create(@GetUser('uid') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  @CheckOwnership({
    resource: 'posts',
    idParam: 'id',
    ownerField: 'authorId',
  })
  @Patch(':id')
  async updatePostById(
    @Param('id') id: string,
    @Body() postData: UpdatePostDto,
  ) {
    return this.postsService.update(id, postData);
  }

  @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  @CheckOwnership({
    resource: 'posts',
    idParam: 'id',
    ownerField: 'authorId',
  })
  @Delete(':id')
  async deletePostById(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
