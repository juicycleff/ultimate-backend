import { Request as ExpressRequest } from 'express';
import { DataSource } from 'apollo-datasource';
import { PassportSubscriptionContext, PassportContext } from 'graphql-passport';
import { UserEntity } from '@ultimatebackend/repository';

export interface GqlContext extends PassportContext<UserEntity, ExpressRequest> {

}

export interface GqlSubscriptionContext extends PassportSubscriptionContext<UserEntity, ExpressRequest>, DataSource {
}
