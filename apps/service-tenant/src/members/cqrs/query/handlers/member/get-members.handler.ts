import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { TenantRepository } from '@ultimatebackend/repository';
import { GetMembersQuery } from '../../impl';
import { mongoParser } from '@juicycleff/repo-orm';
import * as jsonQuery from 'query';
import { FindMemberResponse, Member } from '@ultimatebackend/proto-schema/tenant';

@QueryHandler(GetMembersQuery)
export class GetMembersHandler implements IQueryHandler<GetMembersQuery> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<FindMemberResponse> {
    this.logger.log(`'Async '${query.constructor.name}...`);
    const { input, tenant: userTenant } = query;

    try {
      let tenant;
      if (input.filter) {

        tenant = await this.tenantRepository.findOne({
          normalizedName: userTenant.normalizedName,
        });

        const parsedQuery = mongoParser(JSON.parse(input.filter));
        const members = jsonQuery.query(tenant.members, parsedQuery);

        return {
          members: members as unknown as Member[],
        };
      }

      tenant = await this.tenantRepository.findOne({
        normalizedName: userTenant.normalizedName,
      }, false);

      return {
        members: tenant.members as unknown as Member[],
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
