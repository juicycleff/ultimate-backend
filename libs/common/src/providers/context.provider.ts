import * as requestContext from 'request-context';

export class ContextProvider {
  static get<T>(key: string): T {
    return requestContext.get(ContextProvider._getKeyWithNamespace(key));
  }

  static set(key: string, value: any): void {
    requestContext.set(ContextProvider._getKeyWithNamespace(key), value);
  }

  // tslint:disable-next-line:variable-name
  private static readonly _nameSpace = 'request';

  private static _getKeyWithNamespace(key: string): string {
    return `${ContextProvider._nameSpace}.${key}`;
  }
}
