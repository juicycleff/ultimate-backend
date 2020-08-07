import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  BooleanComparisonFilter,
  NumberComparisonFilter,
  StringComparisonFilter,
  DateComparisonFilter,
  EnumComparisonFilter,
} from '@ultimatebackend/contracts/types';
import { getMetadataStorage } from '@ultimatebackend/core/metadata';
import { InstanceCollector } from '@ultimatebackend/core/decorators/instance-collector.decorator';
import { PaginationInput } from '@ultimatebackend/contracts';
import { ClassType } from '@ultimatebackend/common';

interface FilterMongoOption {
  simple?: boolean;
}

export function FilterMongo<TItem>(
  TItemClass: ClassType<Partial<TItem>>,
  option?: FilterMongoOption,
): any {
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

  const recursiveBuilder = (
    temp: any,
    classTarget: any,
    superClass: any = null,
  ) => {
    const fields = getMetadataStorage().fields.filter(
      (value) => value.objectType === temp.constructor.name,
    );

    if (superClass) {
      const parentFields = getMetadataStorage().fields.filter(
        (value) => value.objectType === superClass.prototype.constructor.name,
      );

      parentFields.map((value) => {
        if (value.getType() === Boolean) {
          Field(() => BooleanComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name,
          );
        } else if (value.getType() === String) {
          Field(() => StringComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name,
          );
        } else if (value.getType() === Number) {
          Field(() => NumberComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name,
          );
        } else if (value.getType() === Date) {
          Field(() => DateComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name,
          );
        } else if (value.getType() === Object) {
          // Field(() => EnumComparisonFilterFunc<classTarget>(value.returnTypeFunc), { nullable: true })(classTarget.prototype, value.name);
        } else {
          if (value.getType() === Array) {
            if (
              typeof value.fieldType !== 'string' &&
              Object.getPrototypeOf(value.fieldType?.prototype).constructor
                .name === 'FilterMongoClass'
            ) {
              // @ts-ignore
              Field(() => value.fieldType, { nullable: true })(
                classTarget.prototype,
                value.name,
              );
            }
            // recursiveBuilder(value.fieldType, classTarget);
            // const TypeClass = InstanceLoader.getInstance(this, `${value.fieldType.prototype.constructor.name}InputFilter`);
            // Field(() => TypeClass, { nullable: true })(classTarget.prototype, value.name);
            // recursiveBuilder(value.fieldType, classTarget);
          }
        }
      });
    }

    fields.map((value) => {
      if (value.getType() === Boolean) {
        Field(() => BooleanComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name,
        );
      } else if (value.getType() === String) {
        Field(() => StringComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name,
        );
      } else if (value.getType() === Number) {
        Field(() => NumberComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name,
        );
      } else if (value.getType() === Date) {
        Field(() => DateComparisonFilter, { nullable: true })(
          classTarget.prototype,
          value.name,
        );
      } else if (value.getType().constructor.name === 'Object') {
        if (value.typeOptions.isEnum) {
          Field(() => EnumComparisonFilter, { nullable: true })(
            classTarget.prototype,
            value.name,
            // @ts-ignore
            typeof value.name,
          );
        }
      } else {
        if (value.getType() === Array) {
          if (
            typeof value.fieldType !== 'string' &&
            Object.getPrototypeOf(value.fieldType?.prototype).constructor
              .name === 'FilterMongoClass'
          ) {
            // @ts-ignore
            Field(() => value.fieldType, { nullable: true })(
              classTarget.prototype,
              value.name,
            );
          }
          // recursiveBuilder(value.fieldType, classTarget);
        }
      }
    });
  };

  const target = new TItemClass();
  const SuperClass = Object.getPrototypeOf(Object.getPrototypeOf(target))
    .constructor;
  recursiveBuilder(target, FilterMongoClass, SuperClass);

  if (option && option.simple) {
    return FilterMongoClass;
  }

  @ArgsType()
  abstract class WherePaginatedFilter {
    @Field(() => FilterMongoClass, { nullable: true })
    where?: FilterMongoClass;

    @Field(() => PaginationInput, { nullable: true })
    paginate?: PaginationInput;
  }

  return WherePaginatedFilter;
}
