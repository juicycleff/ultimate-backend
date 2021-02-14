export interface Service {
  name: string;
  id?: string;
  tags?: string[];
  address?: string;
  port?: number;
  nodes?: Array<Service>;
  region?: string;
}
