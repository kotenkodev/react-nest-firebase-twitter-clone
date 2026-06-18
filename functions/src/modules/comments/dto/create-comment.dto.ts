import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @MaxLength(500, { message: 'Content must be at most 500 characters long' })
  content: string;

  @IsOptional()
  parentId?: string;
}
