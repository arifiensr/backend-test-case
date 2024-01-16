import { Module } from '@nestjs/common';
// import { HealthModule } from './health/health.module';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    // HealthModule,=
    BookModule,
    MemberModule,
  ],
})
export class ServiceModule {}
