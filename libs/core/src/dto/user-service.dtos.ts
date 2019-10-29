import {Node, DateTime} from './shared.dto';

export class User implements Node {
  id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  firstname: string;
  lastname: string;
  email: string;
}
