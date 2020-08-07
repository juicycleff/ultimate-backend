/* tslint:disable:max-classes-per-file */
import { InputType } from '@nestjs/graphql';
import { FilterMongo } from './base.filter';
import { BooleanPayload, Price, KeyValuePair, Feature } from '../';

@InputType()
export class BooleanPayloadFilterInput extends FilterMongo(BooleanPayload, {
  simple: true,
}) {}

@InputType()
export class PriceFilterInput extends FilterMongo(Price, { simple: true }) {}

@InputType()
export class KeyValuePairFilterInput extends FilterMongo(KeyValuePair, {
  simple: true,
}) {}

@InputType()
export class FeatureFilterInput extends FilterMongo(Feature, {
  simple: true,
}) {}
