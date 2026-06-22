import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FIREBASE_AUTH } from '../../modules/firebase/firebase.module';
import { Auth } from 'firebase-admin/auth';
import { Request } from 'express';

@Injectable()
export class FirebaseOptionalAuthGuard implements CanActivate {
  constructor(@Inject(FIREBASE_AUTH) private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.user = null;
      return true;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      request.user = decodedToken;
    } catch {
      request.user = null;
    }

    return true;
  }
}
