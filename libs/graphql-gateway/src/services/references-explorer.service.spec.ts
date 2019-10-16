/* tslint:disable:max-classes-per-file */
import { INestApplicationContext, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { Resolver } from '@nestjs/graphql';
import { GRAPHQL_MODULE_OPTIONS } from '@nestjs/graphql/dist/graphql.constants';
import { ResolveReference } from '../decorators';
import { ReferencesExplorerService } from './references-explorer.service';

@Resolver()
class AccountsResolver {
  @Resolver('User')
  @ResolveReference()
  // tslint:disable-next-line
  public user() {}
}

@Module({
  providers: [
    {
      provide: GRAPHQL_MODULE_OPTIONS,
      useValue: {},
    },
    AccountsResolver,
    MetadataScanner,
    ReferencesExplorerService,
  ],
})
class AppModule {}

describe('ReferencesExplorerService', () => {
  // tslint:disable-next-line:prefer-const
  let app: INestApplicationContext;
  // tslint:disable-next-line:prefer-const
  let referencesExplorer: ReferencesExplorerService;

  beforeEach(async () => {
    app = await NestFactory.createApplicationContext(AppModule);
    referencesExplorer = app.get(ReferencesExplorerService);
  });

  describe('explore', () => {
    it('should return User with __resolveReference', () => {
      const resolvers = referencesExplorer.explore();

      expect(resolvers).toEqual({
        User: {
          __resolveReference: expect.any(Function),
        },
      });
      expect(resolvers).toMatchSnapshot();
    });
  });
});
