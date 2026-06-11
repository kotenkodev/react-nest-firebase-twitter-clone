import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { FIREBASE_AUTH } from '../firebase/firebase.module';
import { Auth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  private readonly auth: Auth;

  constructor(
    @Inject(FIREBASE_AUTH) private readonly admin: Auth,
    private readonly usersService: UsersService,
  ) {
    this.auth = admin;
  }

  async syncUser(
    uid: string,
    email: string,
    additionalData?: Partial<User>,
  ): Promise<User> {
    let user = await this.usersService.findOne(uid);

    if (!user) {
      const newUser: Partial<User> = {
        email,
        ...additionalData,
      };
      await this.usersService.create(uid, newUser);
      return {
        id: uid,
        ...newUser,
        createdAt: new Date(),
      } as User;
    } else if (additionalData && Object.keys(additionalData).length > 0) {
      const updateData = Object.fromEntries(
        Object.entries(additionalData).filter(([_, v]) => v !== undefined),
      );
      if (Object.keys(updateData).length > 0) {
        await this.usersService.update(uid, updateData);
        user = { ...user, ...updateData };
      }
    }

    return user;
  }
}
