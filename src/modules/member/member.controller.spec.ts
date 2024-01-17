import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MemberController', () => {
  let controller: MemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService, PrismaService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const members = await controller.findAll({});
      expect(members).toEqual({
        data: expect.any(Array),
        metadata: expect.any(Object),
        _meta: expect.any(Object),
      });
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const param = 'M001';
      const book = await controller.findOne(param);
      expect(book).toEqual({
        data: expect.any(Object),
        metadata: expect.any(Object),
        _meta: expect.any(Object),
      });
    });
  });
});
