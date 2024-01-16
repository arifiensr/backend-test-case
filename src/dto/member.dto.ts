import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindMemberDto {
  @ApiProperty({ required: false, description: `Member's unique code`, example: 'M001' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false, description: `Member's name`, example: 'Angga' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: `Penalty filter`, example: false })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  @IsOptional()
  penalty?: boolean;
}
