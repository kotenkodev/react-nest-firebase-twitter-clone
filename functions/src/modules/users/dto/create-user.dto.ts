import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  @MinLength(3, { message: 'First name must be at least 3 characters long.' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters.' })
  @IsOptional()
  lastName: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'Bio cannot exceed 250 characters.' })
  photoURL?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
