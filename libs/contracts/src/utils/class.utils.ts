export class InstanceLoader {
  // tslint:disable-next-line:ban-types
  static getInstance(context: Object, name: string, ...args: any[]) {
    const instance = Object.create(context[name].prototype);
    instance.constructor.apply(instance, args);
    return instance;
  }
}
