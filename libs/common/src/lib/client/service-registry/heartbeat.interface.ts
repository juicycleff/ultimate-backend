import { PlainObject } from '../../utils';

export interface HeartbeatOptions {
  enabled: boolean;
  ttlInSeconds?: number;
}

export interface Service {
  name: string;
  address: string;
  port?: number;
  id?: string;
  version?: string;
  domain?: string;
  metadata?: PlainObject;
  status?: string;
  tags?: string[];
}
