import { Controller, Get, Param, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { FindMemberDto } from '../../dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOkResponse({ description: 'Success get members!' })
  @ApiNotFoundResponse({ description: 'Member not found!' })
  @Get()
  findAll(@Query() params: FindMemberDto) {
    return this.memberService.findAll(params);
  }
  
  @ApiOkResponse({ description: 'Success get a member!' })
  @ApiNotFoundResponse({ description: 'Member not found!' })
  @ApiParam({ name: 'code', type: String, example: 'M001' })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.memberService.findOne(code);
  }
}
