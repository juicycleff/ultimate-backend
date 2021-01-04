export interface ConsulOptions {
  host: string;
  port: number;
  secure?: boolean;
  aclToken?: string;
  passing?: boolean;
}
