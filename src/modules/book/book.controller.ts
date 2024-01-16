import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { BorrowBookDto, FindBookDto, ReturnBookDto } from 'src/dto';

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
