import { Args, Query, Resolver } from '@nestjs/graphql';
import { NotImplementedError } from '@ultimatebackend/common';
import { Role } from './types';
import { GqlAuthGuard, RolesRpcClientService } from '@ultimatebackend/core';
import { UseGuards } from '@nestjs/common';

@Resolver(Role)
export class RolesResolver {
  constructor(private readonly service: RolesRpcClientService) {}

  @Query(() => [Role])
  async roles() {
    throw new NotImplementedError('Not implemented');
  }

  @Query(() => Role)
  async role(@Args('id') id: string) {
    // @ts-ignore
    const d = await this.service.roleService.hasRights({
      sub: 'Hello',
      dom: 'Hello',
      res: 'Hello',
      act: 'Hello',
      auth: 'Hello',
    });

    // tslint:disable-next-line:no-console
    console.log('Resulting value => ', d);
  }
}
