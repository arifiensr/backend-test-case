import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { FindMemberDto } from 'src/dto';
import { ApiAcceptedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
}
