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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { CheckOwnership } from 'src/common/decorators/check-ownership.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: CreateUserDto) {}

  @UseGuards(FirebaseAuthGuard)
  @UseGuards(OwnershipGuard)
  @CheckOwnership({
    resource: 'users',
  })
  @Patch(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @UseGuards(OwnershipGuard)
  @CheckOwnership({
    resource: 'users',
  })
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @UseGuards(OwnershipGuard)
  @CheckOwnership({
    resource: 'users',
  })
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {}
}
