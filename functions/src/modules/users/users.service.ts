import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(id: string, data: Partial<CreateUserDto>): Promise<User | null> {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return this.usersRepository.create(id, data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const userData = { ...data };

    Object.keys(userData).forEach((key) => {
      if (userData[key] === undefined) {
        delete userData[key];
      }
    });

    return this.usersRepository.update(id, userData);
  }
}
