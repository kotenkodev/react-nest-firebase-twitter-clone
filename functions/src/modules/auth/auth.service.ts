import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
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
}
