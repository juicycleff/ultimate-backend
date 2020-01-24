/* tslint:disable:no-namespace */

declare namespace NodeJS  {
  interface Global {
    __MONGO_URI__: string;
    __MONGO_DB_NAME__: string;
  }
}
