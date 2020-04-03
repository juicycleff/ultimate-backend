import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { ExtendConnectionType, SignalType, Node } from '@ultimatebackend/contracts';
import { Filterable } from '@ultimatebackend/core';

@ObjectType()
export class SignalData {

  @Field({ nullable: true })
  numericValue?: number;

  @Field()
  rawValue: string;
}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Signal extends Node {

  @Filterable()
  @Field()
  timestamp: string;

  @Filterable()
  @Field()
  pointMac: string;

  @Filterable()
  @Field(() => SignalType)
  type: SignalType;

  @Filterable()
  @Field()
  unit: string;

  @Filterable()
  @Field(() => SignalData)
  defaultData: SignalData;
}

@ObjectType()
export class SignalConnection extends ExtendConnectionType(Signal) {}
