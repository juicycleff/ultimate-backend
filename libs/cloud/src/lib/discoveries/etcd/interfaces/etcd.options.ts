export interface EtcdOptions {
  host: string;
  port: number;
  secure?: boolean;
  aclToken?: string;
  passing?: boolean;
}
