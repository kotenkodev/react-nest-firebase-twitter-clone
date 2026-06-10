import { SetMetadata } from '@nestjs/common';

export interface OwnershipOptions {
  resource: 'posts' | 'users' | 'comments';
  idParam?: string;
  ownerField?: string;
}

export const CHECK_OWNERSHIP_KEY = 'check_ownership';
export const CheckOwnership = (options: OwnershipOptions) =>
  SetMetadata(CHECK_OWNERSHIP_KEY, options);
