export enum DbEventsEnum {
  SAVE,
  UPDATE,
  UPDATE_ONE,
  UPDATE_MANY,
  CREATE,
  DELETE,
  DELETE_MANY,
  DELETE_ONE,
  FIND,
  FIND_MANY,
}

export type DataEvents =
  | 'SAVE'
  | 'UPDATE'
  | 'UPDATE_ONE'
  | 'CREATE'
  | 'DELETE_MANY'
  | 'DELETE'
  | 'DELETE_ONE'
  | 'FIND'
  | 'FIND_MANY'
  | 'FIND_ONE';
