import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantClientGuard, TenantGuard } from '@graphqlcqrs/core';
import { CurrentUser } from '@graphqlcqrs/common';
import { ProjectEntity, ProjectRepository, UserEntity } from '@graphqlcqrs/repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserInputError } from 'apollo-server-express';
import { Project, ProjectFilterArgs, ProjectFilterInput, ProjectMutations } from '../types';
import {
  CreateProjectCommand,
  DeleteProjectCommand,
  UpdateProjectCommand,
  GetProjectQuery,
  GetProjectsQuery,
} from '../cqrs';

/**
 * NOTICE: Scoped Request is not yet supported by CQRS hence commands and query will fail. Working to fix it in NestJS
 */
@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly projectRepository: ProjectRepository,
  ) {}

  @UseGuards(TenantGuard)
  @Mutation(() => Project, { name: 'project' })
  async projectMutations(@Args() input: ProjectMutations, @Context() ctx: any, @CurrentUser() user: UserEntity): Promise<ProjectEntity> {
    const { create, delete: remove, update } = input;
    if (create === null && remove === null && update === null) { // Check to make sure input is not null
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }

    if (create) {
      return await this.commandBus.execute(new CreateProjectCommand(create, this.projectRepository));
    } else if (update) {
      return await this.commandBus.execute(new UpdateProjectCommand(update, this.projectRepository));
    } else if (remove) {
      return await this.commandBus.execute(new DeleteProjectCommand(remove, this.projectRepository));
    } else {
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }
  }

  @UseGuards(TenantClientGuard)
  @Query(() => Project)
  async project(@Args('input') input: ProjectFilterInput): Promise<ProjectEntity> {
    return await this.queryBus.execute(new GetProjectQuery(input, this.projectRepository));
  }

  @UseGuards(TenantClientGuard)
  @Query(() => [Project!])
  async projects(@Args() input: ProjectFilterArgs): Promise<ProjectEntity[]> {
    return await this.queryBus.execute(new GetProjectsQuery(this.projectRepository, input));
  }
}
