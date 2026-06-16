import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Validate } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PostValidationConstraint } from './post.validator';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['id', '_validation'] as const),
) {
  @Validate(PostValidationConstraint)
  _validation?: boolean;
}
