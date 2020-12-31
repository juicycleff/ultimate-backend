import { MemoryRecord, Services } from './types.interface';
import { serviceToRecord } from './utils';

export function getServiceRecords(memServices?: Services): Map<string, Map<string, MemoryRecord>> {
  if (!memServices) {
    return null
  }

  const services = new Map<string, Map<string, MemoryRecord>>();

  for (const key in memServices) {
    // eslint-disable-next-line no-prototype-builtins
    if (memServices.hasOwnProperty(key)) {
      if (memServices.has(key)) {
        services[key] = new Map<string, MemoryRecord>();
      }
      if (!services[key]) {
        services[key] = new Map<string, MemoryRecord>();
      }

      const svc = memServices[key];

      svc.forEach(s => {
        services[s.name][s.version] = serviceToRecord(s, 0);
      })
    }
  }

  return services
}
