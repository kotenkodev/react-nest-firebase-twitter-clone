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
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { GetResource } from 'src/common/decorators/get-resource.decorator';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(FirebaseAuthGuard)
  // @Post()
  // async create(@GetUser('uid') uid: string, @Body() postData: CreatePostDto) {
  //   return this.postsService.create({ ...postData, authorId: uid });
  // }

  // @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  // @CheckOwnership({
  //   resource: 'posts',
  //   idParam: 'id',
  //   ownerField: 'authorId',
  // })
  // @Patch(':id')
  // async updatePostById(
  //   @Param('id') id: string,
  //   @GetResource() post: PostEntity,
  //   @Body() postData: UpdatePostDto,
  // ) {
  //   return this.postsService.update(id, postData);
  // }

  // @Get(':id')
  // async findPostById(@Param('id') id: string) {
  //   return this.postsService.findOne(id);
  // }

  // @Get()
  // async findAll() {
  //   return this.postsService.findAll();
  // }

  // @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  // @CheckOwnership({
  //   resource: 'posts',
  //   idParam: 'id',
  //   ownerField: 'authorId',
  // })
  // @Delete(':id')
  // async deletePostById(@Param('id') id: string) {
  //   return this.postsService.remove(id);
  // }
}
