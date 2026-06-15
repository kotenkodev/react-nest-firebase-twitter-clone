import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @ValidateIf((o, v) => v !== '' && v !== null)
  @IsUrl({ require_tld: false })
  photoURL?: string;
}
