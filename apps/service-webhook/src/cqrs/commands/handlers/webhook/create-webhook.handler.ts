import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AxiosRequestConfig, Method } from 'axios';
import { HttpService, Logger } from '@nestjs/common';
import { WebhookRepository } from '@ultimatebackend/repository';
import { WebhookCreatedEvent } from '@ultimatebackend/core';
import { CreateWebhookResponse } from '@ultimatebackend/proto-schema/webhook';
import {
  WebhookApiKeyFieldEnum,
  WebhookAuthEnum,
} from '@ultimatebackend/contracts';
import { RpcException } from '@nestjs/microservices';
import { CreateWebhookCommand } from '../../';
import { mapWebhookEntityToProto } from '../../../../utitlity';

/**
 * @implements {ICommandHandler<CreateWebhookCommand>}
 * @classdesc CQRS command to request webhook creation
 * @class
 */
@CommandHandler(CreateWebhookCommand)
export class CreateWebhookHandler
  implements ICommandHandler<CreateWebhookCommand> {
  logger = new Logger(this.constructor.name);
  repo: WebhookRepository;

  /**
   * @constructor
   * @param repo
   * @param eventBus
   */
  constructor(
    private readonly eventBus: EventBus,
    private httpService: HttpService,
  ) {}

  async execute(command: CreateWebhookCommand): Promise<CreateWebhookResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { cmd, user } = command;
    this.repo = command.repo;

    try {
      if (!cmd.endpoint) {
        throw new RpcException('Missing webhook endpoint');
      }

      if (!cmd.name) {
        throw new RpcException('Missing webhook name');
      }

      if (!cmd.requestType) {
        throw new RpcException('Missing webhook http verb type');
      }

      const authType = cmd.auth.type as WebhookAuthEnum;
      const method = cmd.requestType as Method;
      const requestConfig: AxiosRequestConfig = {};
      requestConfig.method = method;
      requestConfig.baseURL = cmd.endpoint;
      requestConfig.responseType = 'json';

      if (authType === WebhookAuthEnum.BASIC) {
        requestConfig.auth = {
          password: cmd.auth?.password,
          username: cmd.auth?.username,
        };
      } else if (authType === WebhookAuthEnum.TOKEN) {
        requestConfig.headers = {
          Authorization: cmd.auth?.token,
        };
      } else if (authType === WebhookAuthEnum.API_KEY) {
        const addTo = cmd.auth?.addTo as WebhookApiKeyFieldEnum;

        if (addTo === WebhookApiKeyFieldEnum.HEADER) {
          requestConfig.headers = {
            [cmd.auth?.key]: cmd.auth?.value,
          };
        } else if (addTo === WebhookApiKeyFieldEnum.PARAMS) {
          requestConfig.url = `?${cmd.auth?.key}=${cmd.auth?.value}`;
        }
      } else if (authType === WebhookAuthEnum.OAUTH_2) {
        const addTo = cmd.auth?.addTo as WebhookApiKeyFieldEnum;
        if (addTo === WebhookApiKeyFieldEnum.HEADER) {
          requestConfig.headers = {
            Authorization: cmd.auth?.token,
          };
        } else if (addTo === WebhookApiKeyFieldEnum.PARAMS) {
          requestConfig.url = `?Authorization=${cmd.auth?.token}`;
        }
      }

      const httpTest = await this.httpService
        .request(requestConfig)
        .toPromise();
      if (httpTest.status < 200 && httpTest.status >= 300) {
        throw new RpcException(
          'Could not reach or validate your webhook endpoint',
        );
      }

      const resp = await this.repo.create({
        createdBy: user.id,
        active: true,
        // @ts-ignore
        action: cmd.eventType,
        endpoint: cmd.endpoint,
        // @ts-ignore
        requestType: cmd.requestType,
        // @ts-ignore
        auth: cmd.auth,
        name: cmd.name,
      });

      /*  Publish to the event store of our newly created access token */
      await this.eventBus.publish(new WebhookCreatedEvent(resp));

      return {
        webhook: mapWebhookEntityToProto(resp),
      };
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
