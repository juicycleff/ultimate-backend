/* tslint:disable:max-classes-per-file */
import { ArgsType, Field, InputType, Int } from 'type-graphql';
import { ClassType } from 'type-graphql';

export function FilterMongo<TItem>(TItemClass: ClassType<TItem>): any {

  // for ()

  // ✅ works! it even correctly infers type 'number'
  const d = Object.getOwnPropertyNames(TItemClass);
  // tslint:disable-next-line:no-console
  console.log(d);

  @InputType()
  abstract class FilterMongoClass {
    @Field(() => Int)
    total?: number;
  }

  @ArgsType()
  abstract class WhereFilterMongoClass {
    @Field(() => FilterMongoClass)
    where?: FilterMongoClass;
  }
  return WhereFilterMongoClass;
}

function getSpecialProperty<TModel, TKey extends keyof TModel>(
  model: ClassType<TModel>,
  key: string,
) {
  return model[key];
}
