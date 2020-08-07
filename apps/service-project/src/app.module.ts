import { Module } from '@nestjs/common';
import {
  CoreModule,
  ServiceRegistryModule,
} from '@ultimatebackend/core/modules';
import { MongoModule } from '@juicycleff/repo-orm/database';
import { MongoMultiTenantConfigService } from '@ultimatebackend/core/mutiltenancy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    /**
     * NOTICE: Scoped Request is not yet supported by CQRS hence commands
     * and query will fail. Working to fix it in NestJS
     * Using registerAsync will disable dependency injection in CQRS.
     */
    MongoModule.registerAsync({
      useClass: MongoMultiTenantConfigService,
    }),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
