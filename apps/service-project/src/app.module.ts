import { Module } from '@nestjs/common';
import { GraphqlDistributedModule } from '@graphqlcqrs/graphql-gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    GraphqlDistributedModule.forRoot({
      typePaths: ['./**/*.graphql'],
      introspection: true,
      playground: {
        workspaceName: 'Snowball Demo',
        settings: {
          'editor.theme': 'light',
        },
      },
      context: (context) => {
        return ({
          ...context,
          req: context.req,
        });
      },
    }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
