import { Request } from 'express';

export interface IRequest extends Request {
  user: string; // or any other type
}
