import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindMemberDto } from 'src/dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindMemberDto) {
    try {
      const where: Object = {};
      if (params.code) where['code'] = params.code;
      if (params.name)
        where['name'] = {
          contains: params.name,
        };

      if (params.penalty === true) {
        where['is_penalty'] = true;
      } else if (params.penalty === false) {
        where['is_penalty'] = false;
      }

      const [count, result] = await this.prisma.$transaction([
        this.prisma.member.count({
          where,
        }),
        this.prisma.member.findMany({
          where,
          include: {
            borrowing: true,
          }
        }),
      ]);

      if (result.length === 0) {
        throw new HttpException('Member not found!', HttpStatus.NOT_FOUND);
      }

      result.forEach((member) => {
        member['borrowed_books'] = member['borrowing']
        member['borrowed_books_count'] = member['borrowing'].length
        delete member['borrowing']
      })

      return {
        data: result,
        metadata: {
          count: count,
        },
        _meta: {
          status: 'Success',
          message: 'Success get members!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(code: string) {
    try {
      const where: Object = {};
      where['code'] = code

      const [count, result] = await this.prisma.$transaction([
        this.prisma.member.count({
          where,
        }),
        this.prisma.member.findUnique({
          where: {
            code: code,
          },
          include: {
            borrowing: true,
          }
        }),
      ]);

      if (!result) {
        throw new HttpException('Member not found!', HttpStatus.NOT_FOUND);
      }

      result['borrowed_books'] = result['borrowing']
      result['borrowed_books_count'] = result['borrowing'].length
      delete result['borrowing']

      return {
        data: result,
        metadata: {
          count: count,
        },
        _meta: {
          status: 'Success',
          message: 'Success get member!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
