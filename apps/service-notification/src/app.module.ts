import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { CommonModule } from '@graphqlcqrs/common';
import { MongoModule } from '@juicycleff/nest-multi-tenant';

@Module({
  imports: [
    CommonModule,
    MongoModule.forRoot({
      uri: `${process.env.MONGO_DB_SERVER_URI}${process.env.MONGODB_DB_NAME}`,
      dbName: process.env.MONGODB_DB_NAME,
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
