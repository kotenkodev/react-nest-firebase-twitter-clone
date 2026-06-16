import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
  Validate,
} from 'class-validator';
import { PostValidationConstraint } from './post.validator';

export class CreatePostDto {
  @Validate(PostValidationConstraint)
  _validation?: boolean;

  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @ValidateIf((object, value) => value !== '')
  @IsOptional()
  @IsUrl({ require_tld: false })
  photoURL?: string;
}
