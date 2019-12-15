export interface IPermission {
  name: string;
  readonly identify: string;
  readonly tenant?: string;
  readonly action: string;
}
