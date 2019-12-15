import { Directive, ObjectType } from 'type-graphql/dist';
import { Node } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Billing extends Node {

}
