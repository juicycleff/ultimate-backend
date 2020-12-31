export interface RegistryOption {
  address: Array<string>;

  timeout: Date;

  secure: boolean;
}

export interface RegisterOption {
  ttl: Date;
  // Domain to register the service in
  domain: string;
}

export interface WatchOption {
  // Specify a service to watch
  // If blank, the watch is for all services
  service: string;

  // Domain to watch
  domain: string;
}

export interface DeregisterOption {
  // Domain the service was registered in
  domain: string;
}

export type GetOption = DeregisterOption;

export type ListOption = DeregisterOption;
