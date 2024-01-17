import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import e from 'express';

describe('BookController', () => {
  let controller: BookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService, PrismaService],
    })
      .compile();

    controller = module.get<BookController>(BookController);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = await controller.findAll({});
      expect(books).toEqual({
        data: expect.any(Array),
        metadata: expect.any(Object),
        _meta: expect.any(Object),
      });
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const param = 'JK-45';
      const book = await controller.findOne(param);
      expect(book).toEqual({
        data: expect.any(Object),
        metadata: expect.any(Object),
        _meta: expect.any(Object),
      });
    });
  });
});
