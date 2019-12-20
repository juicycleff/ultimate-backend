import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantGuard } from '@graphqlcqrs/core';
import { CurrentUser } from '@graphqlcqrs/common';
import { ProjectEntity, UserEntity } from '@graphqlcqrs/repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserInputError } from 'apollo-server-express';
import { Project, ProjectFilterArgs, ProjectFilterInput, ProjectMutations } from '../types';
import { ProjectService } from './project.service';

/**
 * NOTICE: Scoped Request is not yet supported by CQRS hence commands and query will fail. Working to fix it in NestJS
 */
@UseGuards(TenantGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly projectService: ProjectService,
  ) {}

  @Mutation(() => Project, { name: 'project' })
  async projectMutations(@Args() input: ProjectMutations, @Context() ctx: any, @CurrentUser() user: UserEntity): Promise<ProjectEntity> {
    const { create, delete: remove, update } = input;
    if (create === null && remove === null && update === null) { // Check to make sure input is not null
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }

    if (create) {
      // return await this.commandBus.execute(new CreateProjectCommand(create));
      return await this.projectService.create(create);
    } else if (update) {
      // return await this.commandBus.execute(new UpdateProjectCommand(update));
      return await this.projectService.update(update);
    } else if (remove) {
      // return await this.commandBus.execute(new DeleteProjectCommand(remove));
      return await this.projectService.delete(remove);
    } else {
      throw new UserInputError('Mutation inputs missing'); // Throw an apollo input error
    }
  }

  @Query(() => Project)
  async project(@Args('input') input: ProjectFilterInput): Promise<ProjectEntity> {
    // return await this.queryBus.execute(new GetProjectQuery(input));
    return await this.projectService.findOne(input);
  }

  @Query(() => [Project!])
  async projects(@Args() input: ProjectFilterArgs): Promise<ProjectEntity[]> {
    // return await this.queryBus.execute(new GetProjectsQuery(input));
    return await this.projectService.find(input);
  }
}
