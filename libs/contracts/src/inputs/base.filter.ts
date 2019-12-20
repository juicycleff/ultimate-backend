/* tslint:disable:max-classes-per-file */
import { ArgsType, Field, InputType, ClassType } from 'type-graphql';
import {
  BooleanComparisonFilter,
  NumberComparisonFilter,
  StringComparisonFilter,
  DateComparisonFilter,
} from '@ultimatebackend/contracts/types';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';
import { InstanceCollector } from '@graphqlcqrs/core/decorators/instance-collector.decorator';
import { PaginationInput } from '@ultimatebackend/contracts';

interface FilterMongoOption {
  simple?: boolean;
}

export function FilterMongo<TItem>(TItemClass: ClassType<Partial<TItem>>, option?: FilterMongoOption): any {

  @InstanceCollector(`Filter${TItemClass.name}Input`)
  @InputType(`Filter${TItemClass.name}Input`)
  abstract class FilterMongoClass {
    [key: string]: any;

    @Field(() => [FilterMongoClass], { nullable: true })
    _OR?: FilterMongoClass[];

    @Field(() => [FilterMongoClass], { nullable: true })
    _AND?: FilterMongoClass[];

    @Field(() => [FilterMongoClass], { nullable: true })
    _NOR?: FilterMongoClass[];
  }

  const recursiveBuilder = (temp: any, classTarget: any, superClass: any = null) => {
    const fields = getMetadataStorage().fields.filter(value => value.objectType === temp.constructor.name);
    if (superClass) {
      const parentFields = getMetadataStorage().fields.filter(value => value.objectType === superClass.prototype.constructor.name);

      parentFields.map(value => {
        if (value.getType() === Boolean) {
          Field(() => BooleanComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
        } else if (value.getType() === String) {
          Field(() => StringComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
        } else if (value.getType() === Number) {
          Field(() => NumberComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
        } else if (value.getType() === Date) {
          Field(() => DateComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
        } else {
          if (value.getType() === Array || value.getType() === Object) {
            if (typeof value.fieldType !== 'string' && Object.getPrototypeOf(value.fieldType?.prototype).constructor.name === 'FilterMongoClass') {
              // @ts-ignore
              Field(() => value.fieldType, { nullable: true })(classTarget.prototype, value.name);
            }
            // recursiveBuilder(value.fieldType, classTarget);
            // const TypeClass = InstanceLoader.getInstance(this, `${value.fieldType.prototype.constructor.name}InputFilter`);
            // Field(() => TypeClass, { nullable: true })(classTarget.prototype, value.name);
            // recursiveBuilder(value.fieldType, classTarget);
          }
        }
      });
    }

    fields.map(value => {
      if (value.getType() === Boolean) {
        Field(() => BooleanComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
      } else if (value.getType() === String) {
        Field(() => StringComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
      } else if (value.getType() === Number) {
        Field(() => NumberComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
      } else if (value.getType() === Date) {
        Field(() => DateComparisonFilter, { nullable: true })(classTarget.prototype, value.name);
      } else {
        if (value.getType() === Array || value.getType() === Object) {
          if (typeof value.fieldType !== 'string' && Object.getPrototypeOf(value.fieldType?.prototype).constructor.name === 'FilterMongoClass') {
            // @ts-ignore
            Field(() => value.fieldType, { nullable: true })(classTarget.prototype, value.name);
          }
          // recursiveBuilder(value.fieldType, classTarget);
        }
      }
    });
  };

  const target = new TItemClass();
  const SuperClass = Object.getPrototypeOf(Object.getPrototypeOf(target)).constructor;
  recursiveBuilder(target, FilterMongoClass, SuperClass);

  if (option && option.simple) { return FilterMongoClass; }

  @ArgsType()
  abstract class WhereFilter {
    @Field(() => FilterMongoClass, { nullable: true })
    where?: FilterMongoClass;

    @Field(() => PaginationInput, { nullable: true })
    paginate?: PaginationInput;
  }

  return WhereFilter;
}
