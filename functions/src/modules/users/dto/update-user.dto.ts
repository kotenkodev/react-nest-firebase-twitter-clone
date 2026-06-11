import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  MaxDate,
  IsDate,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), { message: 'Date of birth cannot be in the future.' })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'Bio must be at most 250 characters.' })
  bio?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  photoURL?: string;
}
