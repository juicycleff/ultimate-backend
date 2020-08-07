export interface IRoleAccess {
  sub: string;
  dom: string;
  obj: string;
  act: string;
}

export interface IActionList {
  read: string[];
  update: string[];
  delete: string[];
  create: string[];
}

export interface IResourceBuilder {
  name: string;
  domain: string;
  actions: IActionList;
}
