import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProjectRepository } from '@ultimatebackend/repository';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectRequest,
  DeleteProjectResponse,
  FindProjectsRequest,
  FindProjectsResponse,
  ReadProjectRequest,
  ReadProjectResponse,
  ProjectService,
  UpdateProjectRequest,
  UpdateProjectResponse,
} from '@ultimatebackend/proto-schema/project';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateProjectCommand,
  DeleteProjectCommand,
  UpdateProjectCommand,
  GetProjectQuery,
  GetProjectsQuery,
} from './cqrs';
import { getIdentityFromCtx } from '@ultimatebackend/core';

@Controller('projects')
export class ProjectsController implements ProjectService<any> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly spaceRepository: ProjectRepository,
  ) {}

  @GrpcMethod('ProjectService')
  createProject(
    request: CreateProjectRequest,
    ctx: any,
  ): Promise<CreateProjectResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return this.commandBus.execute(
      new CreateProjectCommand(request, user, this.spaceRepository),
    );
  }

  @GrpcMethod('ProjectService')
  deleteProject(
    request: DeleteProjectRequest,
    ctx: any,
  ): Promise<DeleteProjectResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return this.commandBus.execute(
      new DeleteProjectCommand(request, user, this.spaceRepository),
    );
  }

  @GrpcMethod('ProjectService')
  findProjects(
    request: FindProjectsRequest,
    ctx: any,
  ): Promise<FindProjectsResponse> {
    return this.queryBus.execute(
      new GetProjectsQuery(this.spaceRepository, request),
    );
  }

  @GrpcMethod('ProjectService')
  readProject(
    request: ReadProjectRequest,
    ctx: any,
  ): Promise<ReadProjectResponse> {
    return this.queryBus.execute(
      new GetProjectQuery(request, this.spaceRepository),
    );
  }

  @GrpcMethod('ProjectService')
  updateProject(
    request: UpdateProjectRequest,
    ctx: any,
  ): Promise<UpdateProjectResponse> {
    const { user } = getIdentityFromCtx(ctx);
    return this.commandBus.execute(
      new UpdateProjectCommand(request, user, this.spaceRepository),
    );
  }
}
