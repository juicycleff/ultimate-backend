export enum WebhookHttpVerbEnum {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum WebhookCrudEnum {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  ALL = 'ALL',
}

export enum WebhookAuthEnum {
  NONE = 'NONE',
  BASIC = 'BASIC',
  API_KEY = 'API_KEY',
  TOKEN = 'TOKEN',
  OAUTH_2 = 'OAUTH_2',
}

export enum WebhookApiKeyFieldEnum {
  HEADER = 'HEADER',
  PARAMS = 'PARAMS',
}
