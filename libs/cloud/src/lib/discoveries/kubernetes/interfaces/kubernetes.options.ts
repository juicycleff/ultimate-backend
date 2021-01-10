export interface KubernetesOptions {
  host: string;
  port: number;
  secure?: boolean;
  aclToken?: string;
  passing?: boolean;
}
