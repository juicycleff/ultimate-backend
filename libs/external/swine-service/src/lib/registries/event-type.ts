/** Event is registry event
 */
import { RegistryEventType, Service } from '../interfaces';

export class RegistryEvent {
  // Id is registry id
  id: string;

  // Type defines type of event
  type: RegistryEventType;

  // Timestamp is event timestamp
  timestamp?: Date;

  // Service is registry service
  service?: Service;
}

// WildcardDomain indicates any domain
export const WildcardDomain = '*';

// DefaultDomain to use if none was provided in options
export const DefaultDomain = 'ultimate-backend';
