import { Inject, Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { GqlModuleOptions } from '@nestjs/graphql';
import { GqlParamsFactory } from '@nestjs/graphql/dist/factories/params.factory';
import {
  GRAPHQL_MODULE_OPTIONS, PARAM_ARGS_METADATA,
  RESOLVER_TYPE_METADATA,
} from '@nestjs/graphql/dist/graphql.constants';
import { ResolverMetadata } from '@nestjs/graphql/dist/interfaces/resolver-metadata.interface';
import { BaseExplorerService } from '@nestjs/graphql/dist/services/base-explorer.service';
import { identity } from 'rxjs';
import { RESOLVE_REFERENCE_KEY, RESOLVE_REFERENCE_METADATA } from '../tokens';

@Injectable()
export class ReferencesExplorerService extends BaseExplorerService {
  private readonly gqlParamsFactory = new GqlParamsFactory();

  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly externalContextCreator: ExternalContextCreator,
    @Inject(GRAPHQL_MODULE_OPTIONS)
    private readonly gqlOptions: GqlModuleOptions,
  ) {
    super();
  }

  public explore() {
    const modules = this.getModules(
      this.modulesContainer,
      this.gqlOptions.include || [],
    );

    const references  = this.flatMap(modules, (wrapper, moduleRef) => {
      return wrapper.instance && this.filterReferences(wrapper, moduleRef);
    });

    return this.groupMetadata(references);
  }

  private predicate(instance: object, prototype: any, methodName: string): ResolverMetadata {
    const callback = prototype[methodName];
    const isResolverReference = Reflect.getMetadata(RESOLVE_REFERENCE_METADATA, callback);

    if (!isResolverReference) {
      // @ts-ignore
      return null;
    }

    const resolverType =
      Reflect.getMetadata(RESOLVER_TYPE_METADATA, callback) ||
      // @ts-ignore
      Reflect.getMetadata(RESOLVER_TYPE_METADATA, instance.constructor);

    return {
      name: RESOLVE_REFERENCE_KEY, // probably should be __resolveReference
      type: resolverType,
      methodName,
    };
  }

  private filterReferences(
    wrapper: InstanceWrapper,
    moduleRef: Module,
  ): ResolverMetadata[] {
    const { instance } = wrapper;

    // @ts-ignore
    const prototype = Object.getPrototypeOf(instance);
    const resolvers = this.metadataScanner.scanFromPrototype(
      instance,
      prototype,
      (name) => this.predicate(instance, prototype, name),
    );

    return resolvers
      // @ts-ignore
      .filter((resolver) => !!resolver)
      .map((resolver) => {
        const createContext = (transform?: () => void) => {
          return this.createContextCallback(
            instance,
            prototype,
            wrapper,
            moduleRef,
            resolver,
            false,
            transform,
          );
        };

        return {
          ...resolver,
          callback: createContext(),
        };
      });
  }

  private createContextCallback<T extends object>(
    instance: T,
    prototype: any,
    wrapper: InstanceWrapper,
    moduleRef: Module,
    resolver: ResolverMetadata,
    isRequestScoped: boolean,
    transform: any = identity,
  ) {
    return this.externalContextCreator.create(
      instance,
      prototype[resolver.methodName],
      resolver.methodName,
      PARAM_ARGS_METADATA,
      this.gqlParamsFactory,
      undefined,
      undefined,
      undefined,
    );
  }
}
