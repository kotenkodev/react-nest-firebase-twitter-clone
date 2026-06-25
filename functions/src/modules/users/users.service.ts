import { Injectable, NotFoundException } from '@nestjs/common';
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

  async upsert(data: {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    photoURL: string;
  }): Promise<User> {
    const existingUser = await this.usersRepository.findOne(data.id);

    if (!existingUser) {
      const newUser = await this.usersRepository.create(data.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        emailVerified: data.emailVerified,
        photoURL: data.photoURL,
      });
      return newUser!;
    }

    if (existingUser.emailVerified !== data.emailVerified) {
      const updatedUser = await this.usersRepository.update(data.id, {
        emailVerified: data.emailVerified,
      });
      return updatedUser!;
    }

    return existingUser;
  }

  async create(id: string, data: Partial<CreateUserDto>): Promise<User | null> {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return this.usersRepository.update(id, data);
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
