import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { FIREBASE_DB } from '../../modules/firebase/firebase.module';
import {
  CHECK_OWNERSHIP_KEY,
  OwnershipOptions,
} from '../decorators/check-ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(FIREBASE_DB) private readonly db: admin.firestore.Firestore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const options = this.reflector.get<OwnershipOptions>(
      CHECK_OWNERSHIP_KEY,
      handler,
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as admin.auth.DecodedIdToken;
    const resourceId = request.params[options.idParam || 'id'];

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!resourceId) {
      return true;
    }

    const doc = await this.db
      .collection(options.resource)
      .doc(resourceId)
      .get();

    if (!doc.exists) {
      throw new NotFoundException(
        `${options.resource} with ID ${resourceId} not found`,
      );
    }

    const data = doc.data();

    if (options.resource === 'users') {
      if (doc.id !== user.uid) {
        throw new ForbiddenException('You do not own this resource');
      }
      return true;
    }

    const ownerField = options.ownerField || 'userId';
    if (data?.[ownerField] !== user.uid) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
