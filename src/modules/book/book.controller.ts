import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BorrowBookDto, FindBookDto, ReturnBookDto } from '../../dto';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOkResponse({ description: 'Success get books!' })
  @ApiNotFoundResponse({ description: 'Book not found!' })
  @Get()
  findAll(@Query() params: FindBookDto) {
    return this.bookService.findAll(params);
  }

  @ApiOkResponse({ description: 'Success get a book!' })
  @ApiNotFoundResponse({ description: 'Book not found!' })
  @ApiParam({ name: 'code', type: String, example: 'JK-45' })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.bookService.findOne(code);
  }

  @ApiCreatedResponse({ description: 'Success borrow a book!' })
  @Post('borrow')
  borrow(@Body() body: BorrowBookDto) {
    return this.bookService.borrow(body);
  }

  @ApiCreatedResponse({ description: 'Success return a book!' })
  @Post('return')
  return(@Body() body: ReturnBookDto) {
    return this.bookService.return(body);
  }
}
