import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['id', 'email'] as const),
) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), { message: 'Date of birth cannot be in the future.' })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'Bio must be at most 250 characters.' })
  bio?: string;
}
