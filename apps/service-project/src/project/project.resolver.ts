import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project, CreateProjectInput } from '../types';
import { PaginationInput } from '@ultimatebackend/contracts';
import { UseGuards } from '@nestjs/common';
import { TenantGuard } from '@graphqlcqrs/core';

@Resolver(() => Project)
export class ProjectResolver {

  @Mutation(() => Project)
  async createProject(@Args('input') input: CreateProjectInput): Promise<any> {
    return null; // plainToClass(, result);
  }

  @Mutation(() => Project)
  async removeProject(@Args('id') id: string): Promise<any> {
    return null; // plainToClass(, result);
  }

  @Query(() => Project)
  async project(@Args('id') id: string): Promise<any> {
    return null; // await this.projectService.findOne({ id });
  }

  @Query(() => [Project!])
  async projects(@Args('paginate') paginate: PaginationInput): Promise<any[]> {
    return null; // await this.projectService.findAll(null, paginate);
  }
}
