import { Module } from '@nestjs/common';
import * as path from 'path';
import { buildContext } from 'graphql-passport';
import { GraphqlDistributedModule } from 'nestjs-graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@graphqlcqrs/common';
import { MongoModule } from '@juicycleff/nest-multi-tenant';
import { join } from 'path';
import { TenantModule } from './tenant/tenant.module';
import { TenantMemberModule } from './tenant-member/tenant-member.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: [path.join(process.cwd() + '/apps/service-tenant/src', '/**/*.graphql')],
      definitions: {
        path: join(process.cwd() + '/libs/contracts/', 'src/services/tenant-contract.ts'),
        outputAs: 'class',
      },
      introspection: true,
      playground: {
        workspaceName: 'GRAPHQL SERVICE USER',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: ({ req, res }) => buildContext({ req, res }),
    }),
    CommonModule,
    MongoModule.forRoot({
      uri: `${process.env.MONGO_DB_SERVER_URI}${process.env.MONGODB_DB_NAME}`,
      dbName: process.env.MONGODB_DB_NAME,
    }),
    TenantModule,
    TenantMemberModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
