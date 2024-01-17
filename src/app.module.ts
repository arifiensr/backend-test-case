import { Module } from '@nestjs/common';
import { ServiceModule } from './modules/service.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ServiceModule,
    PrismaModule,
  ],
})
export class AppModule {}
