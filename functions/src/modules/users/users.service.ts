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

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(id: string, data: Partial<CreateUserDto>): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return this.usersRepository.create(id, data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const userData = { ...data };

    Object.keys(userData).forEach((key) => {
      if (userData[key] === undefined) {
        delete userData[key];
      }
    });

    return this.usersRepository.update(id, userData);
  }

  async remove(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }
}
