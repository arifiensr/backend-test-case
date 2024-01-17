import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BorrowBookDto, FindBookDto, ReturnBookDto } from '../../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindBookDto) {
    try {
      const where: Object = {};
      if (params.code) where['code'] = params.code;
      if (params.title)
        where['title'] = {
          contains: params.title,
        };

      if (params.author)
        where['author'] = {
          contains: params.author,
        };

      where['stock'] = {
        gt: 0,
      };

      const [count, result] = await this.prisma.$transaction([
        this.prisma.book.count({
          where,
        }),
        this.prisma.book.findMany({
          where,
        }),
      ]);

      if (result.length === 0) {
        throw new HttpException('Book not found!', HttpStatus.NOT_FOUND);
      }

      return {
        data: result,
        metadata: {
          count: count,
        },
        _meta: {
          status: 'Success',
          message: 'Success get books!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(code: string) {
    try {
      const where: Object = {};
      where['code'] = code;
      where['stock'] = {
        gt: 0,
      };

      const [count, result] = await this.prisma.$transaction([
        this.prisma.book.count({
          where,
        }),
        this.prisma.book.findUnique({
          where: {
            code: code,
            stock: { gt: 0 },
          },
        }),
      ]);

      if (!result) {
        throw new HttpException('Book not found!', HttpStatus.NOT_FOUND);
      }

      return {
        data: result,
        metadata: {
          count: count,
        },
        _meta: {
          status: 'Success',
          message: 'Success get a book!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async borrow(body: BorrowBookDto) {
    try {
      const moment = require('moment');
      const current_date = moment();

      const member = await this.prisma.member.findUnique({
        where: {
          code: body.member_code,
        },
      });

      if (!member) {
        throw new HttpException('Member not found!', HttpStatus.NOT_FOUND);
      }

      if (member.penalty_expired_date > current_date) {
        throw new HttpException(
          `Member is currently under penalty!`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.prisma.member.update({
          where: {
            code: body.member_code,
          },
          data: {
            is_penalty: false,
            penalty_date: null,
            penalty_expired_date: null,
          },
        });
      }

      const borrowed_books = await this.prisma.borrowing.findMany({
        where: {
          member_code: body.member_code,
        },
      });

      if (borrowed_books.length === 2) {
        throw new HttpException(
          `Member already borrowed 2 books!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (borrowed_books.find((book) => book.book_code === body.book_code)) {
        throw new HttpException(
          `Member already borrowed same book!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const book = await this.prisma.book.findUnique({
        where: {
          code: body.book_code,
        },
      });

      if (!book) {
        throw new HttpException('Book not found!', HttpStatus.NOT_FOUND);
      }

      if (book.stock === 0) {
        throw new HttpException(
          `Book's stock is empty!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const deadline_date = moment(current_date).add(7, 'days');
      const [create, update] = await this.prisma.$transaction([
        this.prisma.borrowing.create({
          data: {
            member_code: body.member_code,
            book_code: body.book_code,
            borrowing_date: current_date,
            deadline_date: deadline_date,
          },
        }),
        this.prisma.book.update({
          where: {
            code: body.book_code,
          },
          data: {
            stock: {
              decrement: 1,
            },
          },
        }),
      ]);

      return {
        data: create,
        metadata: {
          count: 1,
        },
        _meta: {
          status: 'Success',
          message: 'Success borrow a book!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async return(body: ReturnBookDto) {
    try {
      const moment = require('moment');
      const current_date = moment();

      const member = await this.prisma.member.findUnique({
        where: {
          code: body.member_code,
        },
      });

      if (!member) {
        throw new HttpException('Member not found!', HttpStatus.NOT_FOUND);
      }

      const borrowed_books = await this.prisma.borrowing.findUnique({
        where: {
          member_code_book_code: {
            member_code: body.member_code,
            book_code: body.book_code,
          },
        },
      });

      if (!borrowed_books) {
        throw new HttpException(
          `Member did not borrow the book!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      let penalty_message: string;
      if (borrowed_books.deadline_date < current_date) {
        await this.prisma.member.update({
          where: {
            code: body.member_code,
          },
          data: {
            is_penalty: true,
            penalty_date: current_date,
            penalty_expired_date: moment(current_date).add(3, 'days'),
          },
        });

        penalty_message = 'Success return a book but member is get a penalty!';
      }

      const [create, update, del] = await this.prisma.$transaction([
        this.prisma.history.create({
          data: {
            member_code: body.member_code,
            book_code: body.book_code,
            borrowing_date: borrowed_books.borrowing_date,
            returning_date: current_date,
          },
        }),
        this.prisma.book.update({
          where: {
            code: body.book_code,
          },
          data: {
            stock: {
              increment: 1,
            },
          },
        }),
        this.prisma.borrowing.delete({
          where: {
            member_code_book_code: {
              member_code: body.member_code,
              book_code: body.book_code,
            },
          },
        }),
      ]);

      return {
        data: create,
        metadata: {
          count: 1,
        },
        _meta: {
          status: 'Success',
          message: penalty_message ? penalty_message : 'Success return a book!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
