import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindBookDto {
  @ApiProperty({ required: false, description: `Book's unique code`, example: 'JK-45' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false, description: `Book's title`, example: 'Harry Potter' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, description: `Book's author`, example: 'J.K Rowling' })
  @IsString()
  @IsOptional()
  author?: string;
}

export class BorrowBookDto {
  @ApiProperty({ required: true, description: `Member's unique code`, example: 'M001' })
  @IsString()
  @IsNotEmpty()
  member_code?: string;

  @ApiProperty({ required: false, description: `Book's unique code`, example: 'JK-45' })
  @IsString()
  @IsNotEmpty()
  book_code?: string;
}

export class ReturnBookDto {
  @ApiProperty({ required: true, description: `Member's unique code`, example: 'M001' })
  @IsString()
  @IsNotEmpty()
  member_code?: string;

  @ApiProperty({ required: false, description: `Book's unique code`, example: 'JK-45' })
  @IsString()
  @IsNotEmpty()
  book_code?: string;
}