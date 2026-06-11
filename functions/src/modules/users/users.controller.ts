import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { CheckOwnership } from '../../common/decorators/check-ownership.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMe(@GetUser('uid') uid: string) {
    return this.usersService.findOne(uid);
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

  @UseGuards(FirebaseAuthGuard, OwnershipGuard)
  @CheckOwnership({
    resource: 'users',
  })
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
