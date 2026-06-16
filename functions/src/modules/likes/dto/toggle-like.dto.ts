import { IsEnum } from 'class-validator';
import { LikeType } from '../entities/like.entity';

export class ToggleLikeDto {
  @IsEnum(LikeType, {
    message: `type must be either 'like' or 'dislike'`,
  })
  type: LikeType;
}
