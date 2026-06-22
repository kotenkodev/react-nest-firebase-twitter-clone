import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum PostSortBy {
  NEWEST = 'newest',
  POPULAR = 'popular',
}

export class PostQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  lastDocId?: string;

  @IsOptional()
  @IsEnum(PostSortBy)
  sortBy?: PostSortBy;
}
