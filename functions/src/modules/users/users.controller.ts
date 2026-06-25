import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createUser(
    @GetUser('uid') userId: string,
    @Body() data: Omit<CreateUserDto, 'id'>,
  ) {
    return this.usersService.create(userId, data);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMe(@GetUser() decodedUser: DecodedIdToken & { name?: string }) {
    const [firstName = '', ...lastNameParts] = (decodedUser.name || '').split(
      ' ',
    );
    const lastName = lastNameParts.join(' ');

    return this.usersService.upsert({
      id: decodedUser.uid,
      email: decodedUser.email || '',
      emailVerified: decodedUser.email_verified || false,
      firstName: firstName || 'User',
      lastName: lastName,
      photoURL: decodedUser.picture || '',
    });
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  @CheckOwnership({
    resource: 'users',
  })
  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ) {
    return this.usersService.update(id, userData);
  }
}
